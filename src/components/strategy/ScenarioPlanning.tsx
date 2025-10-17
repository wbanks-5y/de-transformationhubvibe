
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStrategicScenarios } from "@/hooks/use-strategic-scenarios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Plus, HelpCircle, Lightbulb } from "lucide-react";
import ConfigureScenarioDialog from './ConfigureScenarioDialog';

const ScenarioPlanning: React.FC = () => {
  const { data: scenarios = [], refetch } = useStrategicScenarios();
  const [configureDialogOpen, setConfigureDialogOpen] = useState(false);
  const [scenarioToEdit, setScenarioToEdit] = useState(null);

  const scenarioColors = {
    optimistic: '#10B981',
    baseline: '#3B82F6', 
    pessimistic: '#EF4444'
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'optimistic': return TrendingUp;
      case 'pessimistic': return TrendingDown;
      default: return BarChart3;
    }
  };

  // Process scenario outcomes for simple chart
  const processOutcomesForChart = () => {
    if (!scenarios.length) return [];
    
    const metrics = [...new Set(scenarios.flatMap(s => 
      s.strategic_scenario_outcomes?.map(o => o.metric_name) || []
    ))];
    
    return metrics.map(metric => {
      const chartData = { metric: metric.charAt(0).toUpperCase() + metric.slice(1) };
      
      scenarios.forEach(scenario => {
        const outcome = scenario.strategic_scenario_outcomes?.find(o => o.metric_name === metric);
        if (outcome) {
          let numericValue = 0;
          const valueStr = outcome.value_change;
          if (valueStr.includes('%')) {
            numericValue = parseFloat(valueStr.replace('%', '').replace('+', ''));
          } else {
            numericValue = parseFloat(valueStr.replace('+', '')) || 0;
          }
          chartData[scenario.scenario_type] = numericValue;
        }
      });
      
      return chartData;
    });
  };

  const handleCreateScenario = () => {
    setScenarioToEdit(null);
    setConfigureDialogOpen(true);
  };

  const handleEditScenario = (scenario: any) => {
    setScenarioToEdit(scenario);
    setConfigureDialogOpen(true);
  };

  const chartData = processOutcomesForChart();

  return (
    <div className="space-y-6">
      {/* Header with explanation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Scenario Planning</h2>
            <p className="text-gray-600">Plan for different possible futures</p>
          </div>
          <Button onClick={handleCreateScenario} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Scenario
          </Button>
        </div>

        {/* What is this section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">What is Scenario Planning?</h3>
                <p className="text-sm text-blue-800">
                  Create different "what-if" scenarios to see how your business might perform under various conditions. 
                  For example: What if sales grow 20%? What if costs increase? What if we enter a new market?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Scenarios or Empty State */}
      {scenarios.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Lightbulb className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Scenarios Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first scenario to start planning for different business futures. 
              You can model optimistic, realistic, and pessimistic outcomes.
            </p>
            <Button onClick={handleCreateScenario} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Scenario
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => {
              const IconComponent = getScenarioIcon(scenario.scenario_type);
              const outcomeCount = scenario.strategic_scenario_outcomes?.length || 0;
              
              return (
                <Card 
                  key={scenario.id} 
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleEditScenario(scenario)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <IconComponent 
                        className="h-8 w-8" 
                        style={{ color: scenarioColors[scenario.scenario_type] }}
                      />
                      <Badge 
                        variant="outline"
                        style={{ 
                          color: scenarioColors[scenario.scenario_type],
                          borderColor: scenarioColors[scenario.scenario_type]
                        }}
                      >
                        {scenario.probability}% likely
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{scenario.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>{outcomeCount} outcomes defined</span>
                        <span className="capitalize">{scenario.scenario_type}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Simple Comparison Chart */}
          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Scenario Impact Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="optimistic" fill={scenarioColors.optimistic} name="Optimistic" />
                      <Bar dataKey="baseline" fill={scenarioColors.baseline} name="Baseline" />
                      <Bar dataKey="pessimistic" fill={scenarioColors.pessimistic} name="Pessimistic" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Example Scenarios You Could Create
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Optimistic</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    "New product launch succeeds" - Revenue +25%, Market share +15%
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Baseline</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Current trends continue" - Revenue +5%, Steady growth
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Pessimistic</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Economic downturn" - Revenue -10%, Cost cuts needed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <ConfigureScenarioDialog
        isOpen={configureDialogOpen}
        onOpenChange={setConfigureDialogOpen}
        scenario={scenarioToEdit}
        onSave={() => {
          refetch();
          setScenarioToEdit(null);
        }}
      />
    </div>
  );
};

export default ScenarioPlanning;
