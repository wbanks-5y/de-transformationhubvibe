
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Target, BarChart3, Activity, Zap } from "lucide-react";
import { useStrategicScenarios } from "@/hooks/use-strategic-scenarios";
import { useScenarioImpactCategories, useScenarioParameters } from "@/hooks/use-enhanced-scenarios";

interface ScenarioAnalysisPanelProps {
  selectedScenarios: string[];
  onScenarioSelect: (scenarioIds: string[]) => void;
}

const ScenarioAnalysisPanel: React.FC<ScenarioAnalysisPanelProps> = ({
  selectedScenarios,
  onScenarioSelect
}) => {
  const [analysisType, setAnalysisType] = useState('impact');
  const { data: scenarios = [] } = useStrategicScenarios();
  const { data: impactCategories = [] } = useScenarioImpactCategories();

  const scenarioColors = {
    optimistic: '#10B981',
    baseline: '#3B82F6', 
    pessimistic: '#EF4444'
  };

  // Process data for sensitivity analysis
  const processParameterSensitivity = () => {
    const selectedScenarioData = scenarios.filter(s => selectedScenarios.includes(s.id));
    
    return [
      { parameter: 'Market Growth', sensitivity: 0.8, impact: 15, scenario: 'optimistic' },
      { parameter: 'Competition', sensitivity: 0.6, impact: -8, scenario: 'pessimistic' },
      { parameter: 'Cost Inflation', sensitivity: 0.4, impact: -12, scenario: 'pessimistic' },
      { parameter: 'Technology Adoption', sensitivity: 0.9, impact: 20, scenario: 'optimistic' },
      { parameter: 'Regulatory Changes', sensitivity: 0.3, impact: -5, scenario: 'baseline' }
    ];
  };

  // Process data for scenario comparison
  const processScenarioComparison = () => {
    const selectedScenarioData = scenarios.filter(s => selectedScenarios.includes(s.id));
    
    return impactCategories.map(category => {
      const dataPoint = { category: category.display_name };
      
      selectedScenarioData.forEach(scenario => {
        const outcomes = scenario.strategic_scenario_outcomes || [];
        const categoryOutcome = outcomes.find(o => 
          o.metric_name.toLowerCase().includes(category.name.toLowerCase())
        );
        
        if (categoryOutcome) {
          const value = parseFloat(categoryOutcome.value_change.replace('%', '').replace('+', ''));
          dataPoint[scenario.name] = value;
          dataPoint[`${scenario.name}_color`] = scenarioColors[scenario.scenario_type];
        }
      });
      
      return dataPoint;
    });
  };

  // Process data for risk analysis radar chart
  const processRiskAnalysis = () => {
    return [
      { factor: 'Market Risk', optimistic: 2, baseline: 5, pessimistic: 8 },
      { factor: 'Financial Risk', optimistic: 3, baseline: 4, pessimistic: 7 },
      { factor: 'Operational Risk', optimistic: 1, baseline: 3, pessimistic: 6 },
      { factor: 'Technology Risk', optimistic: 4, baseline: 5, pessimistic: 8 },
      { factor: 'Regulatory Risk', optimistic: 2, baseline: 4, pessimistic: 7 },
      { factor: 'Competitive Risk', optimistic: 3, baseline: 6, pessimistic: 9 }
    ];
  };

  const sensitivityData = processParameterSensitivity();
  const comparisonData = processScenarioComparison();
  const riskData = processRiskAnalysis();

  const getAnalysisInsights = () => {
    const selectedScenarioData = scenarios.filter(s => selectedScenarios.includes(s.id));
    
    const insights = [];
    
    if (selectedScenarioData.length === 0) {
      insights.push({
        type: 'info',
        title: 'No Scenarios Selected',
        description: 'Select scenarios to view analysis insights',
        icon: Target
      });
    } else {
      // Probability distribution insight
      const avgProbability = selectedScenarioData.reduce((sum, s) => sum + s.probability, 0) / selectedScenarioData.length;
      insights.push({
        type: avgProbability > 60 ? 'positive' : avgProbability < 40 ? 'negative' : 'neutral',
        title: 'Probability Assessment',
        description: `Average probability: ${avgProbability.toFixed(0)}%`,
        icon: TrendingUp
      });

      // Risk level insight
      const pessimisticCount = selectedScenarioData.filter(s => s.scenario_type === 'pessimistic').length;
      if (pessimisticCount > 0) {
        insights.push({
          type: 'warning',
          title: 'Risk Consideration',
          description: `${pessimisticCount} pessimistic scenario(s) selected`,
          icon: AlertTriangle
        });
      }

      // Confidence insight
      const confidenceLevels = selectedScenarioData
        .filter(s => s.confidence_level)
        .map(s => s.confidence_level);
      
      if (confidenceLevels.length > 0) {
        const avgConfidence = confidenceLevels.reduce((sum, c) => sum + c, 0) / confidenceLevels.length;
        insights.push({
          type: avgConfidence > 70 ? 'positive' : avgConfidence < 50 ? 'negative' : 'neutral',
          title: 'Confidence Level',
          description: `Average confidence: ${avgConfidence.toFixed(0)}%`,
          icon: Activity
        });
      }
    }
    
    return insights;
  };

  const insights = getAnalysisInsights();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Scenario Analysis</h3>
          <p className="text-sm text-gray-600">
            {selectedScenarios.length} scenario(s) selected for analysis
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="impact">Impact Analysis</SelectItem>
              <SelectItem value="sensitivity">Sensitivity Analysis</SelectItem>
              <SelectItem value="risk">Risk Analysis</SelectItem>
              <SelectItem value="comparison">Scenario Comparison</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Insights Panel */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            const colorClass = {
              positive: 'border-green-200 bg-green-50 text-green-800',
              negative: 'border-red-200 bg-red-50 text-red-800',
              warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
              neutral: 'border-blue-200 bg-blue-50 text-blue-800',
              info: 'border-gray-200 bg-gray-50 text-gray-800'
            }[insight.type];

            return (
              <Card key={index} className={`border-2 ${colorClass}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm">{insight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Analysis Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysisType === 'impact' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis label={{ value: 'Impact (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  {scenarios.filter(s => selectedScenarios.includes(s.id)).map((scenario, index) => (
                    <Bar 
                      key={scenario.id}
                      dataKey={scenario.name} 
                      fill={scenarioColors[scenario.scenario_type]}
                      name={scenario.name}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {analysisType === 'sensitivity' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sensitivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="parameter" />
                  <YAxis label={{ value: 'Sensitivity Score', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="sensitivity" fill="#8884d8" name="Sensitivity" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {analysisType === 'risk' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={riskData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar name="Optimistic" dataKey="optimistic" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                  <Radar name="Baseline" dataKey="baseline" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                  <Radar name="Pessimistic" dataKey="pessimistic" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {analysisType === 'comparison' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenarios.filter(s => selectedScenarios.includes(s.id)).map(scenario => (
                  <Card key={scenario.id} className="border-2" style={{ borderColor: scenarioColors[scenario.scenario_type] }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{scenario.name}</CardTitle>
                        <Badge 
                          variant="outline" 
                          style={{ color: scenarioColors[scenario.scenario_type], borderColor: scenarioColors[scenario.scenario_type] }}
                        >
                          {scenario.probability}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="capitalize">{scenario.scenario_type}</span>
                        </div>
                        {scenario.confidence_level && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confidence:</span>
                            <span>{scenario.confidence_level}%</span>
                          </div>
                        )}
                        {scenario.time_horizon_months && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time Horizon:</span>
                            <span>{scenario.time_horizon_months} months</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioAnalysisPanel;
