
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Calculator, AlertCircle, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  useCreateUpdateScenario,
  useScenarioParameters,
  useCreateUpdateScenarioParameter,
  useDeleteScenarioParameter,
  useScenarioImpactCategories,
  useScenarioOutcomes,
  useCreateUpdateScenarioOutcome,
  useDeleteScenarioOutcome,
  useValidateScenarioParameters
} from "@/hooks/use-enhanced-scenarios";

interface ConfigureScenarioDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scenario?: any;
  onSave?: () => void;
}

const ConfigureScenarioDialog: React.FC<ConfigureScenarioDialogProps> = ({
  isOpen,
  onOpenChange,
  scenario,
  onSave
}) => {
  const { user } = useAuth();
  const [scenarioData, setScenarioData] = useState({
    name: '',
    description: '',
    scenario_type: 'baseline',
    probability: 50,
    assumptions: '',
    time_horizon_months: 12,
    confidence_level: 50,
    external_factors: []
  });

  const [newParameter, setNewParameter] = useState({
    parameter_name: '',
    parameter_type: 'numeric',
    base_value: '',
    min_value: '',
    max_value: '',
    unit: '',
    description: '',
    sensitivity_weight: 1.0
  });

  const [newOutcome, setNewOutcome] = useState({
    metric_name: '',
    value_change: '',
    impact_category_id: '',
    confidence_score: 50,
    time_frame_months: 12,
    baseline_value: '',
    notes: ''
  });

  const [newFactor, setNewFactor] = useState('');
  const [validationErrors, setValidationErrors] = useState<any>({});

  const { data: parameters = [], refetch: refetchParameters } = useScenarioParameters(scenario?.id);
  const { data: outcomes = [], refetch: refetchOutcomes } = useScenarioOutcomes(scenario?.id);
  const { data: impactCategories = [] } = useScenarioImpactCategories();
  
  const createUpdateScenario = useCreateUpdateScenario();
  const createUpdateParameter = useCreateUpdateScenarioParameter();
  const deleteParameter = useDeleteScenarioParameter();
  const createUpdateOutcome = useCreateUpdateScenarioOutcome();
  const deleteOutcome = useDeleteScenarioOutcome();
  const validateParameters = useValidateScenarioParameters();

  useEffect(() => {
    if (scenario) {
      setScenarioData({
        name: scenario.name || '',
        description: scenario.description || '',
        scenario_type: scenario.scenario_type || 'baseline',
        probability: scenario.probability || 50,
        assumptions: scenario.assumptions || '',
        time_horizon_months: scenario.time_horizon_months || 12,
        confidence_level: scenario.confidence_level || 50,
        external_factors: Array.isArray(scenario.external_factors) ? scenario.external_factors : []
      });
    } else {
      setScenarioData({
        name: '',
        description: '',
        scenario_type: 'baseline',
        probability: 50,
        assumptions: '',
        time_horizon_months: 12,
        confidence_level: 50,
        external_factors: []
      });
    }
  }, [scenario]);

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!scenarioData.name.trim()) {
        toast("Scenario name is required");
        return;
      }

      const dataToSave = {
        ...scenarioData,
        id: scenario?.id,
        is_active: true,
        created_by: user?.id
      };

      console.log('Saving scenario with data:', dataToSave);
      await createUpdateScenario.mutateAsync(dataToSave);
      
      toast(scenario ? "Scenario updated successfully" : "Scenario created successfully");
      
      onSave?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save scenario:', error);
      toast(`Failed to save scenario: ${error.message}`);
    }
  };

  const handleAddParameter = async () => {
    if (!scenario?.id || !newParameter.parameter_name || !newParameter.base_value) {
      toast("Please fill in parameter name and base value");
      return;
    }

    try {
      await createUpdateParameter.mutateAsync({
        ...newParameter,
        scenario_id: scenario.id
      });
      
      setNewParameter({
        parameter_name: '',
        parameter_type: 'numeric',
        base_value: '',
        min_value: '',
        max_value: '',
        unit: '',
        description: '',
        sensitivity_weight: 1.0
      });
      
      refetchParameters();
      toast("Parameter added successfully");
    } catch (error) {
      console.error('Failed to add parameter:', error);
      toast(`Failed to add parameter: ${error.message}`);
    }
  };

  const handleDeleteParameter = async (parameterId: string) => {
    try {
      await deleteParameter.mutateAsync(parameterId);
      refetchParameters();
      toast("Parameter deleted successfully");
    } catch (error) {
      console.error('Failed to delete parameter:', error);
      toast(`Failed to delete parameter: ${error.message}`);
    }
  };

  const handleAddOutcome = async () => {
    if (!scenario?.id || !newOutcome.metric_name || !newOutcome.value_change) {
      toast("Please fill in metric name and value change");
      return;
    }

    try {
      await createUpdateOutcome.mutateAsync({
        ...newOutcome,
        scenario_id: scenario.id
      });
      
      setNewOutcome({
        metric_name: '',
        value_change: '',
        impact_category_id: '',
        confidence_score: 50,
        time_frame_months: 12,
        baseline_value: '',
        notes: ''
      });
      
      refetchOutcomes();
      toast("Outcome added successfully");
    } catch (error) {
      console.error('Failed to add outcome:', error);
      toast(`Failed to add outcome: ${error.message}`);
    }
  };

  const handleDeleteOutcome = async (outcomeId: string) => {
    try {
      await deleteOutcome.mutateAsync(outcomeId);
      refetchOutcomes();
      toast("Outcome deleted successfully");
    } catch (error) {
      console.error('Failed to delete outcome:', error);
      toast(`Failed to delete outcome: ${error.message}`);
    }
  };

  const handleValidateParameters = async () => {
    if (parameters.length === 0) {
      toast("No parameters to validate");
      return;
    }

    try {
      const result = await validateParameters.mutateAsync({
        scenarioId: scenario?.id || '',
        parameters
      });
      
      if (result.isValid) {
        toast("All parameters are valid");
        setValidationErrors({});
      } else {
        const errors = {};
        result.results.forEach(r => {
          if (!r.isValid) {
            errors[r.parameterId] = r.errors;
          }
        });
        setValidationErrors(errors);
        
        toast("Some parameters have validation errors");
      }
    } catch (error) {
      console.error('Validation failed:', error);
      toast("Failed to validate parameters");
    }
  };

  const handleAddFactor = () => {
    if (newFactor.trim()) {
      setScenarioData(prev => ({
        ...prev,
        external_factors: [...prev.external_factors, newFactor.trim()]
      }));
      setNewFactor('');
    }
  };

  const handleRemoveFactor = (index: number) => {
    setScenarioData(prev => ({
      ...prev,
      external_factors: prev.external_factors.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {scenario ? 'Configure Scenario' : 'Create New Scenario'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
            <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
            <TabsTrigger value="factors">External Factors</TabsTrigger>
          </TabsList>

          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Scenario Name</Label>
                <Input
                  value={scenarioData.name}
                  onChange={(e) => setScenarioData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter scenario name"
                />
              </div>

              <div className="space-y-2">
                <Label>Scenario Type</Label>
                <Select value={scenarioData.scenario_type} onValueChange={(value) => setScenarioData(prev => ({ ...prev, scenario_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="optimistic">Optimistic</SelectItem>
                    <SelectItem value="baseline">Baseline</SelectItem>
                    <SelectItem value="pessimistic">Pessimistic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Probability (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={scenarioData.probability}
                  onChange={(e) => setScenarioData(prev => ({ ...prev, probability: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Confidence Level (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={scenarioData.confidence_level}
                  onChange={(e) => setScenarioData(prev => ({ ...prev, confidence_level: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Time Horizon (Months)</Label>
                <Input
                  type="number"
                  min="1"
                  value={scenarioData.time_horizon_months}
                  onChange={(e) => setScenarioData(prev => ({ ...prev, time_horizon_months: parseInt(e.target.value) || 12 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={scenarioData.description}
                onChange={(e) => setScenarioData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this scenario..."
                rows={3}
              />
            </div>
          </TabsContent>

          
          <TabsContent value="parameters" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Scenario Parameters</h3>
              <Button onClick={handleValidateParameters} variant="outline" size="sm">
                <Check className="h-4 w-4 mr-2" />
                Validate All
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Parameter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Parameter Name</Label>
                    <Input
                      value={newParameter.parameter_name}
                      onChange={(e) => setNewParameter(prev => ({ ...prev, parameter_name: e.target.value }))}
                      placeholder="e.g., Market Growth Rate"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newParameter.parameter_type} onValueChange={(value) => setNewParameter(prev => ({ ...prev, parameter_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="numeric">Numeric</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Base Value</Label>
                    <Input
                      value={newParameter.base_value}
                      onChange={(e) => setNewParameter(prev => ({ ...prev, base_value: e.target.value }))}
                      placeholder="Base value"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Min Value</Label>
                    <Input
                      value={newParameter.min_value}
                      onChange={(e) => setNewParameter(prev => ({ ...prev, min_value: e.target.value }))}
                      placeholder="Minimum value"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Value</Label>
                    <Input
                      value={newParameter.max_value}
                      onChange={(e) => setNewParameter(prev => ({ ...prev, max_value: e.target.value }))}
                      placeholder="Maximum value"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      value={newParameter.unit}
                      onChange={(e) => setNewParameter(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., %, $, units"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newParameter.description}
                    onChange={(e) => setNewParameter(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this parameter..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sensitivity Weight</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={newParameter.sensitivity_weight}
                    onChange={(e) => setNewParameter(prev => ({ ...prev, sensitivity_weight: parseFloat(e.target.value) || 1.0 }))}
                  />
                </div>

                <Button onClick={handleAddParameter} disabled={!scenario?.id} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Parameter
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Label className="text-lg">Current Parameters</Label>
              {parameters.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No parameters configured yet</p>
              ) : (
                parameters.map((param) => (
                  <Card key={param.id} className={validationErrors[param.id] ? 'border-red-500' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{param.parameter_name}</h4>
                            <Badge variant="outline">{param.parameter_type}</Badge>
                            {validationErrors[param.id] && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>Base: {param.base_value} {param.unit}</div>
                            <div>Range: {param.min_value} - {param.max_value}</div>
                            <div>Weight: {param.sensitivity_weight}</div>
                          </div>
                          {param.description && (
                            <p className="text-sm text-gray-600 mt-2">{param.description}</p>
                          )}
                          {validationErrors[param.id] && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                              <p className="text-sm text-red-600 font-medium">Validation Errors:</p>
                              <ul className="text-sm text-red-600 mt-1">
                                {validationErrors[param.id].map((error, idx) => (
                                  <li key={idx}>• {error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteParameter(param.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="outcomes" className="space-y-4">
            <h3 className="text-lg font-semibold">Scenario Outcomes</h3>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Outcome</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Metric Name</Label>
                    <Input
                      value={newOutcome.metric_name}
                      onChange={(e) => setNewOutcome(prev => ({ ...prev, metric_name: e.target.value }))}
                      placeholder="e.g., Revenue Growth"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Value Change</Label>
                    <Input
                      value={newOutcome.value_change}
                      onChange={(e) => setNewOutcome(prev => ({ ...prev, value_change: e.target.value }))}
                      placeholder="e.g., +15%, -5%, 100k"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Impact Category</Label>
                    <Select value={newOutcome.impact_category_id} onValueChange={(value) => setNewOutcome(prev => ({ ...prev, impact_category_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {impactCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.display_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Confidence Score (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newOutcome.confidence_score}
                      onChange={(e) => setNewOutcome(prev => ({ ...prev, confidence_score: parseInt(e.target.value) || 50 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Baseline Value</Label>
                    <Input
                      value={newOutcome.baseline_value}
                      onChange={(e) => setNewOutcome(prev => ({ ...prev, baseline_value: e.target.value }))}
                      placeholder="Current baseline value"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Time Frame (Months)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newOutcome.time_frame_months}
                      onChange={(e) => setNewOutcome(prev => ({ ...prev, time_frame_months: parseInt(e.target.value) || 12 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={newOutcome.notes}
                    onChange={(e) => setNewOutcome(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this outcome..."
                    rows={2}
                  />
                </div>

                <Button onClick={handleAddOutcome} disabled={!scenario?.id} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Outcome
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Label className="text-lg">Current Outcomes</Label>
              {outcomes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No outcomes configured yet</p>
              ) : (
                outcomes.map((outcome) => (
                  <Card key={outcome.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{outcome.metric_name}</h4>
                            <Badge variant="outline">{outcome.value_change}</Badge>
                            <Badge variant="secondary">{outcome.confidence_score}% confident</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>Baseline: {outcome.baseline_value || 'Not set'}</div>
                            <div>Time Frame: {outcome.time_frame_months} months</div>
                          </div>
                          {outcome.notes && (
                            <p className="text-sm text-gray-600 mt-2">{outcome.notes}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOutcome(outcome.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="assumptions" className="space-y-4">
            <div className="space-y-2">
              <Label>Key Assumptions</Label>
              <Textarea
                value={scenarioData.assumptions}
                onChange={(e) => setScenarioData(prev => ({ ...prev, assumptions: e.target.value }))}
                placeholder="List the key assumptions underlying this scenario..."
                rows={8}
              />
            </div>
          </TabsContent>

          <TabsContent value="factors" className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFactor}
                  onChange={(e) => setNewFactor(e.target.value)}
                  placeholder="Add external factor..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFactor()}
                />
                <Button onClick={handleAddFactor}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>External Factors</Label>
                <div className="flex flex-wrap gap-2">
                  {scenarioData.external_factors.map((factor, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {factor}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFactor(index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                {scenarioData.external_factors.length === 0 && (
                  <p className="text-gray-500 text-sm">No external factors added yet</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createUpdateScenario.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {createUpdateScenario.isPending ? 'Saving...' : 'Save Scenario'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureScenarioDialog;
