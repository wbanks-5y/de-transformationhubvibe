
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NumberInput } from "@/components/ui/number-input";
import { CockpitMetric } from "@/types/cockpit";
import { useKPIFormulas } from "@/hooks/use-kpi-formulas";

interface KPIFormulaBuilderProps {
  availableMetrics: CockpitMetric[];
  onFormulaSelect: (formula: string, parameters: any) => void;
  currentFormula?: string;
  currentParameters?: any;
}

const KPIFormulaBuilder: React.FC<KPIFormulaBuilderProps> = ({
  availableMetrics,
  onFormulaSelect,
  currentFormula,
  currentParameters
}) => {
  const { data: formulas, isLoading } = useKPIFormulas();
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('');
  const [parameters, setParameters] = useState<any>({});
  const [customFormula, setCustomFormula] = useState<string>('');
  const [formulaMode, setFormulaMode] = useState<'template' | 'custom'>('template');

  useEffect(() => {
    if (currentFormula && currentParameters) {
      setCustomFormula(currentFormula);
      setParameters(currentParameters);
      setFormulaMode('custom');
    }
  }, [currentFormula, currentParameters]);

  const selectedFormula = formulas?.find(f => f.id === selectedFormulaId);

  const handleParameterChange = (paramKey: string, value: any) => {
    const newParameters = { ...parameters, [paramKey]: value };
    setParameters(newParameters);
    
    if (formulaMode === 'template' && selectedFormula) {
      // Replace template variables with actual values
      let formula = selectedFormula.formula_template;
      Object.entries(newParameters).forEach(([key, val]: [string, any]) => {
        if (val?.type === 'metric') {
          formula = formula.replace(`{${key}}`, `METRIC(${val.metric_id})`);
        } else if (val?.value !== undefined) {
          formula = formula.replace(`{${key}}`, val.value.toString());
        }
      });
      onFormulaSelect(formula, newParameters);
    }
  };

  const handleCustomFormulaChange = (formula: string) => {
    setCustomFormula(formula);
    onFormulaSelect(formula, parameters);
  };

  const handleTemplateSelect = (formulaId: string) => {
    setSelectedFormulaId(formulaId);
    setParameters({});
    setFormulaMode('template');
  };

  const renderParameterInput = (paramKey: string, paramSchema: any) => {
    const paramValue = parameters[paramKey];

    if (paramSchema.type === 'metric') {
      return (
        <div key={paramKey} className="space-y-2">
          <Label>{paramSchema.label || paramKey}</Label>
          <Select
            value={paramValue?.metric_id || ''}
            onValueChange={(metricId) => handleParameterChange(paramKey, { type: 'metric', metric_id: metricId })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {availableMetrics.map(metric => (
                <SelectItem key={metric.id} value={metric.id}>
                  {metric.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {paramSchema.description && (
            <p className="text-xs text-gray-500">{paramSchema.description}</p>
          )}
        </div>
      );
    }

    if (paramSchema.type === 'number') {
      return (
        <div key={paramKey} className="space-y-2">
          <Label>{paramSchema.label || paramKey}</Label>
          <NumberInput
            value={paramValue?.value || null}
            onChange={(value) => handleParameterChange(paramKey, { type: 'number', value: value || 0 })}
            placeholder={paramSchema.placeholder}
          />
          {paramSchema.description && (
            <p className="text-xs text-gray-500">{paramSchema.description}</p>
          )}
        </div>
      );
    }

    return (
      <div key={paramKey} className="space-y-2">
        <Label>{paramSchema.label || paramKey}</Label>
        <Input
          value={paramValue?.value || ''}
          onChange={(e) => handleParameterChange(paramKey, { type: 'text', value: e.target.value })}
          placeholder={paramSchema.placeholder}
        />
        {paramSchema.description && (
          <p className="text-xs text-gray-500">{paramSchema.description}</p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading formula templates...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Formula Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formula Mode Selection */}
        <div className="flex gap-2">
          <Button
            variant={formulaMode === 'template' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFormulaMode('template')}
          >
            Use Template
          </Button>
          <Button
            variant={formulaMode === 'custom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFormulaMode('custom')}
          >
            Custom Formula
          </Button>
        </div>

        {formulaMode === 'template' && (
          <div className="space-y-4">
            {/* Template Selection */}
            <div>
              <Label>Formula Template</Label>
              <Select value={selectedFormulaId} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a formula template" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {formulas?.map(formula => (
                    <SelectItem key={formula.id} value={formula.id}>
                      <div>
                        <div className="font-medium">{formula.display_name}</div>
                        <div className="text-xs text-gray-500">{formula.category}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Description */}
            {selectedFormula && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">{selectedFormula.display_name}</div>
                <div className="text-sm text-blue-700 mt-1">{selectedFormula.description}</div>
                <Badge variant="outline" className="mt-2">{selectedFormula.category}</Badge>
              </div>
            )}

            {/* Parameters */}
            {selectedFormula && selectedFormula.parameter_schema && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Parameters</Label>
                {Object.entries(selectedFormula.parameter_schema).map(([key, schema]: [string, any]) =>
                  renderParameterInput(key, schema)
                )}
              </div>
            )}

            {/* Example Usage */}
            {selectedFormula?.example_usage && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium">Example:</Label>
                <code className="block text-xs mt-1">{selectedFormula.example_usage}</code>
              </div>
            )}
          </div>
        )}

        {formulaMode === 'custom' && (
          <div className="space-y-4">
            <div>
              <Label>Custom Formula Expression</Label>
              <Input
                value={customFormula}
                onChange={(e) => handleCustomFormulaChange(e.target.value)}
                placeholder="e.g., (metric1 + metric2) / 100"
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use METRIC(id) to reference metrics, or standard mathematical expressions
              </p>
            </div>
          </div>
        )}

        {/* Available Metrics Reference */}
        {availableMetrics.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Available Metrics:</Label>
            <div className="flex flex-wrap gap-2">
              {availableMetrics.slice(0, 6).map(metric => (
                <Badge key={metric.id} variant="outline" className="text-xs">
                  {metric.display_name}
                </Badge>
              ))}
              {availableMetrics.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{availableMetrics.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPIFormulaBuilder;
