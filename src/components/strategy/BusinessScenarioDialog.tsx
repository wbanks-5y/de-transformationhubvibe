import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, DollarSign, Users, Building, Globe, Target, Calendar } from "lucide-react";
import { toast } from "sonner";

interface BusinessScenarioDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scenario?: any;
  onSave?: () => void;
}

// Predefined scenario templates
const scenarioTemplates = [
  {
    name: 'Economic Recession',
    type: 'pessimistic',
    description: 'Economic downturn impacts customer spending',
    impacts: { revenue: -15, costs: -5, customers: -20, marketShare: -10 },
    timeframe: '6-12 months',
    probability: 30
  },
  {
    name: 'New Competitor Entry',
    type: 'pessimistic', 
    description: 'Major competitor enters our market',
    impacts: { revenue: -10, costs: 5, customers: -15, marketShare: -20 },
    timeframe: '3-6 months',
    probability: 40
  },
  {
    name: 'Product Launch Success',
    type: 'optimistic',
    description: 'New product exceeds market expectations',
    impacts: { revenue: 25, costs: 15, customers: 30, marketShare: 20 },
    timeframe: '3-6 months',
    probability: 60
  },
  {
    name: 'Market Expansion',
    type: 'optimistic',
    description: 'Successfully expand to new geographic market',
    impacts: { revenue: 30, costs: 20, customers: 40, marketShare: 25 },
    timeframe: '6-12 months',
    probability: 50
  },
  {
    name: 'Steady Growth',
    type: 'baseline',
    description: 'Continue current trajectory with modest improvements',
    impacts: { revenue: 8, costs: 5, customers: 10, marketShare: 5 },
    timeframe: '12 months',
    probability: 70
  }
];

const BusinessScenarioDialog: React.FC<BusinessScenarioDialogProps> = ({
  isOpen,
  onOpenChange,
  scenario,
  onSave
}) => {
  const [scenarioData, setScenarioData] = useState({
    name: '',
    type: 'baseline',
    description: '',
    timeframe: '6 months',
    probability: 50,
    impacts: {
      revenue: 0,
      costs: 0,
      customers: 0,
      marketShare: 0
    },
    triggers: [''],
    assumptions: [''],
    actions: ['']
  });

  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleTemplateSelect = (templateName: string) => {
    const template = scenarioTemplates.find(t => t.name === templateName);
    if (template) {
      setScenarioData({
        ...scenarioData,
        name: template.name,
        type: template.type,
        description: template.description,
        timeframe: template.timeframe,
        probability: template.probability,
        impacts: template.impacts,
        triggers: ['Market conditions change', 'Customer behavior shifts'],
        assumptions: ['Current market trends continue', 'No major disruptions'],
        actions: ['Monitor key metrics', 'Adjust strategy as needed']
      });
      setSelectedTemplate(templateName);
    }
  };

  const handleSave = () => {
    if (!scenarioData.name.trim()) {
      toast.error("Please enter a scenario name");
      return;
    }

    // For now, just show success message
    toast.success("Scenario saved successfully!");
    onSave?.();
  };

  const addListItem = (field: 'triggers' | 'assumptions' | 'actions') => {
    setScenarioData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateListItem = (field: 'triggers' | 'assumptions' | 'actions', index: number, value: string) => {
    setScenarioData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'triggers' | 'assumptions' | 'actions', index: number) => {
    setScenarioData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateImpact = (metric: string, value: number) => {
    setScenarioData(prev => ({
      ...prev,
      impacts: {
        ...prev.impacts,
        [metric]: value
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Business Scenario</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="template" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="impacts">Business Impact</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Template Selection */}
          <TabsContent value="template" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Choose a Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Start with a pre-built scenario template, or create from scratch.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scenarioTemplates.map(template => (
                    <div 
                      key={template.name}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTemplate === template.name 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleTemplateSelect(template.name)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant={
                          template.type === 'optimistic' ? 'default' :
                          template.type === 'pessimistic' ? 'destructive' : 'secondary'
                        }>
                          {template.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>{template.timeframe}</span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className={template.impacts.revenue > 0 ? 'text-green-600' : 'text-red-600'}>
                            {template.impacts.revenue > 0 ? '+' : ''}{template.impacts.revenue}%
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    setSelectedTemplate('');
                    setScenarioData({
                      name: '',
                      type: 'baseline',
                      description: '',
                      timeframe: '6 months',
                      probability: 50,
                      impacts: { revenue: 0, costs: 0, customers: 0, marketShare: 0 },
                      triggers: [''],
                      assumptions: [''],
                      actions: ['']
                    });
                  }}
                >
                  Start from Scratch
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Scenario Name</Label>
                <Input
                  value={scenarioData.name}
                  onChange={(e) => setScenarioData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Economic Recession"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Scenario Type</Label>
                <Select value={scenarioData.type} onValueChange={(value) => setScenarioData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="optimistic">Optimistic (Best Case)</SelectItem>
                    <SelectItem value="baseline">Baseline (Most Likely)</SelectItem>
                    <SelectItem value="pessimistic">Pessimistic (Worst Case)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timeframe</Label>
                <Select value={scenarioData.timeframe} onValueChange={(value) => setScenarioData(prev => ({ ...prev, timeframe: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="1-2 years">1-2 years</SelectItem>
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
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={scenarioData.description}
                onChange={(e) => setScenarioData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this scenario involves..."
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Business Impact */}
          <TabsContent value="impacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Revenue Change (%)</Label>
                    <Input
                      type="number"
                      value={scenarioData.impacts.revenue}
                      onChange={(e) => updateImpact('revenue', parseInt(e.target.value) || 0)}
                      placeholder="e.g., +15 or -10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cost Change (%)</Label>
                    <Input
                      type="number"
                      value={scenarioData.impacts.costs}
                      onChange={(e) => updateImpact('costs', parseInt(e.target.value) || 0)}
                      placeholder="e.g., +5 or -15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Count Change (%)</Label>
                    <Input
                      type="number"
                      value={scenarioData.impacts.customers}
                      onChange={(e) => updateImpact('customers', parseInt(e.target.value) || 0)}
                      placeholder="e.g., +20 or -10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Market Share Change (%)</Label>
                    <Input
                      type="number"
                      value={scenarioData.impacts.marketShare}
                      onChange={(e) => updateImpact('marketShare', parseInt(e.target.value) || 0)}
                      placeholder="e.g., +5 or -15"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details */}
          <TabsContent value="details" className="space-y-4">
            {/* Triggers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Key Triggers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scenarioData.triggers.map((trigger, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={trigger}
                      onChange={(e) => updateListItem('triggers', index, e.target.value)}
                      placeholder="What could trigger this scenario?"
                    />
                    {scenarioData.triggers.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeListItem('triggers', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={() => addListItem('triggers')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Trigger
                </Button>
              </CardContent>
            </Card>

            {/* Assumptions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Key Assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scenarioData.assumptions.map((assumption, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={assumption}
                      onChange={(e) => updateListItem('assumptions', index, e.target.value)}
                      placeholder="What assumptions does this scenario rely on?"
                    />
                    {scenarioData.assumptions.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeListItem('assumptions', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={() => addListItem('assumptions')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assumption
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scenarioData.actions.map((action, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={action}
                      onChange={(e) => updateListItem('actions', index, e.target.value)}
                      placeholder="What actions should we take if this happens?"
                    />
                    {scenarioData.actions.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeListItem('actions', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={() => addListItem('actions')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Action
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Scenario
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessScenarioDialog;