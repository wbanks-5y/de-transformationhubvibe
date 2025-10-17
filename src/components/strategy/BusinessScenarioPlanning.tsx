import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Plus, Target, DollarSign, Users, Building, Globe, AlertTriangle, CheckCircle, ArrowRight, Brain, Lightbulb, Shield, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import BusinessScenarioDialog from './BusinessScenarioDialog';
import { EnhancedScenarioDialog } from './EnhancedScenarioDialog';
import { getTimeframeLabel, getScenarioTypeLabel } from '@/hooks/use-enhanced-scenario-intelligence';

// Hardcoded business scenarios for now - later can be moved to database
const businessScenarios = [
  {
    id: '1',
    name: 'Economic Recession',
    type: 'pessimistic',
    probability: 30,
    timeframe: '6-12 months',
    description: 'Economic downturn impacts customer spending and market demand',
    impacts: {
      revenue: -15,
      costs: -5,
      customers: -20,
      marketShare: -10
    },
    details: {
      triggers: ['High inflation', 'Interest rate increases', 'Consumer confidence drop'],
      assumptions: ['10-15% reduction in discretionary spending', 'Increased price sensitivity', 'Budget constraints'],
      actions: ['Cost reduction initiatives', 'Focus on core customers', 'Diversify revenue streams'],
      timeline: [
        { month: 'Month 1-2', action: 'Implement cost controls' },
        { month: 'Month 3-6', action: 'Adjust pricing strategy' },
        { month: 'Month 6-12', action: 'Recovery planning' }
      ]
    }
  },
  {
    id: '2',
    name: 'New Product Launch Success',
    type: 'optimistic',
    probability: 60,
    timeframe: '3-6 months',
    description: 'New product exceeds expectations and captures significant market share',
    impacts: {
      revenue: 25,
      costs: 15,
      customers: 30,
      marketShare: 20
    },
    details: {
      triggers: ['Strong market demand', 'Positive customer feedback', 'Competitive advantage'],
      assumptions: ['Product meets market needs', 'Effective marketing campaign', 'Supply chain readiness'],
      actions: ['Scale production capacity', 'Expand marketing budget', 'Hire additional staff'],
      timeline: [
        { month: 'Month 1', action: 'Product launch' },
        { month: 'Month 2-3', action: 'Monitor and optimize' },
        { month: 'Month 4-6', action: 'Scale operations' }
      ]
    }
  },
  {
    id: '3',
    name: 'Steady Growth',
    type: 'baseline',
    probability: 70,
    timeframe: '12 months',
    description: 'Business continues current trajectory with modest improvements',
    impacts: {
      revenue: 8,
      costs: 5,
      customers: 10,
      marketShare: 5
    },
    details: {
      triggers: ['Market stability', 'Consistent execution', 'Gradual improvements'],
      assumptions: ['No major disruptions', 'Steady market conditions', 'Continued operational efficiency'],
      actions: ['Process optimization', 'Customer retention focus', 'Strategic investments'],
      timeline: [
        { month: 'Q1', action: 'Baseline optimization' },
        { month: 'Q2-Q3', action: 'Growth initiatives' },
        { month: 'Q4', action: 'Planning for next year' }
      ]
    }
  }
];

const scenarioTypes = {
  optimistic: { color: '#10B981', icon: TrendingUp, label: 'Optimistic' },
  baseline: { color: '#3B82F6', icon: BarChart3, label: 'Baseline' },
  pessimistic: { color: '#EF4444', icon: TrendingDown, label: 'Pessimistic' }
};

const BusinessScenarioPlanning: React.FC = () => {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(['1', '2', '3']);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [enhancedDialogOpen, setEnhancedDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'comparison' | 'details'>('overview');
  const [aiScenarios, setAiScenarios] = useState<any[]>([]);

  const getScenariosByType = (type: string) => {
    return businessScenarios.filter(s => s.type === type);
  };

  const getAllScenarios = () => {
    return [...businessScenarios, ...aiScenarios];
  };

  const getComparisonData = () => {
    const metrics = ['revenue', 'costs', 'customers', 'marketShare'];
    const allScenarios = getAllScenarios();
    return metrics.map(metric => {
      const data = { metric: metric.charAt(0).toUpperCase() + metric.slice(1) };
      selectedScenarios.forEach(id => {
        const scenario = allScenarios.find(s => s.id === id);
        if (scenario) {
          data[scenario.name] = scenario.impacts[metric];
        }
      });
      return data;
    });
  };

  const getFinancialProjection = () => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const allScenarios = getAllScenarios();
    return months.map(month => {
      const data = { month: `M${month}` };
      selectedScenarios.forEach(id => {
        const scenario = allScenarios.find(s => s.id === id);
        if (scenario) {
          // Simple projection calculation
          const impact = scenario.impacts.revenue;
          const progression = Math.min(month / 6, 1); // Ramp up over 6 months
          data[scenario.name] = 100 + (impact * progression);
        }
      });
      return data;
    });
  };

  const toggleScenario = (id: string) => {
    setSelectedScenarios(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const handleAiScenarioGenerated = (scenarioData: any) => {
    const newAiScenario = {
      id: `ai_${Date.now()}`,
      name: scenarioData.scenarioAnalysis.scenario_name,
      type: 'ai_generated',
      probability: scenarioData.scenarioAnalysis.probability,
      timeframe: getTimeframeLabel(scenarioData.metadata.timeframe),
      description: `AI-generated scenario based on real cockpit data and market intelligence`,
      aiData: scenarioData,
      impacts: {
        revenue: scenarioData.scenarioAnalysis.cockpit_impacts?.find((c: any) => c.name.toLowerCase().includes('sales'))?.impact_percentage || 0,
        costs: scenarioData.scenarioAnalysis.cockpit_impacts?.find((c: any) => c.name.toLowerCase().includes('finance'))?.impact_percentage || 0,
        customers: scenarioData.scenarioAnalysis.cockpit_impacts?.find((c: any) => c.name.toLowerCase().includes('sales'))?.impact_percentage || 0,
        marketShare: scenarioData.scenarioAnalysis.cockpit_impacts?.find((c: any) => c.name.toLowerCase().includes('sales'))?.impact_percentage || 0
      }
    };

    setAiScenarios(prev => [newAiScenario, ...prev]);
    setSelectedScenarios(prev => [newAiScenario.id, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Scenario Planning</h2>
          <p className="text-muted-foreground">Model different business futures and their impacts</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button 
              variant={viewMode === 'overview' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('overview')}
            >
              Overview
            </Button>
            <Button 
              variant={viewMode === 'comparison' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('comparison')}
            >
              Compare
            </Button>
            <Button 
              variant={viewMode === 'details' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('details')}
            >
              Details
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEnhancedDialogOpen(true)}>
              <Brain className="h-4 w-4 mr-2" />
              AI Analysis
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Scenario
            </Button>
          </div>
        </div>
      </div>

      {/* What is this section */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-primary mb-1">Enhanced Scenario Planning</h3>
              <p className="text-sm text-primary/80">
                Create realistic business scenarios using your actual cockpit data and AI-powered market intelligence. 
                Generate evidence-based projections and actionable recommendations for strategic decision-making.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Scenarios Section */}
      {aiScenarios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI-Generated Scenarios
              <Badge variant="secondary">Data-Driven</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {aiScenarios.map(scenario => (
                <div 
                  key={scenario.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedScenarios.includes(scenario.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleScenario(scenario.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">{scenario.name}</h4>
                      <Badge variant="outline">{scenario.probability}%</Badge>
                      <Badge variant="secondary">
                        {getScenarioTypeLabel(scenario.aiData.metadata.scenarioType)}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {scenario.timeframe}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Baseline Performance:</span>
                      <span className="font-medium">{scenario.aiData.baseline.average_target_achievement}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cockpits Analyzed:</span>
                      <span className="font-medium">{scenario.aiData.metadata.cockpitCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>KPIs Analyzed:</span>
                      <span className="font-medium">{scenario.aiData.metadata.totalKpis}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Confidence:</span>
                      <span className="font-medium">{scenario.aiData.scenarioAnalysis.confidence_level}%</span>
                    </div>
                  </div>
                  
                  {scenario.aiData.recommendations && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-xs font-medium mb-2">
                        <Lightbulb className="h-3 w-3" />
                        Key Recommendations:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        {scenario.aiData.recommendations.immediate_actions?.slice(0, 2).map((action: string, index: number) => (
                          <div key={index} className="flex items-start gap-1">
                            <ArrowRight className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{action}</span>
                          </div>
                        ))}
                        {scenario.aiData.recommendations.risk_mitigation?.slice(0, 1).map((risk: string, index: number) => (
                          <div key={index} className="flex items-start gap-1">
                            <Shield className="h-3 w-3 mt-0.5 text-orange-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'overview' && (
        <>
          {/* Scenario Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(scenarioTypes).map(([type, config]) => {
              const scenarios = getScenariosByType(type);
              const IconComponent = config.icon;
              
              return (
                <Card key={type} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" style={{ color: config.color }} />
                      <CardTitle className="text-lg">{config.label} Scenarios</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {scenarios.map(scenario => (
                      <div 
                        key={scenario.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedScenarios.includes(scenario.id) 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => toggleScenario(scenario.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{scenario.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {scenario.probability}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{scenario.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{scenario.timeframe}</span>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span className={scenario.impacts.revenue > 0 ? 'text-green-600' : 'text-red-600'}>
                              {scenario.impacts.revenue > 0 ? '+' : ''}{scenario.impacts.revenue}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Impact Summary */}
          {selectedScenarios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Selected Scenarios Impact Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 {['revenue', 'costs', 'customers', 'marketShare'].map(metric => {
                    const allScenarios = getAllScenarios();
                    const avgImpact = selectedScenarios.reduce((sum, id) => {
                      const scenario = allScenarios.find(s => s.id === id);
                      return sum + (scenario?.impacts[metric] || 0);
                    }, 0) / selectedScenarios.length;

                    return (
                      <div key={metric} className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold mb-1">
                          <span className={avgImpact > 0 ? 'text-green-600' : avgImpact < 0 ? 'text-red-600' : 'text-gray-600'}>
                            {avgImpact > 0 ? '+' : ''}{avgImpact.toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {metric === 'marketShare' ? 'Market Share' : metric}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getComparisonData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                     {selectedScenarios.map((id, index) => {
                        const allScenarios = getAllScenarios();
                        const scenario = allScenarios.find(s => s.id === id);
                        const colors = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6'];
                        return (
                          <Bar 
                            key={id}
                            dataKey={scenario?.name} 
                            fill={colors[index % colors.length]} 
                            name={scenario?.name}
                          />
                        );
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {viewMode === 'comparison' && selectedScenarios.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Projection */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Projection (12 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getFinancialProjection()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {selectedScenarios.map((id, index) => {
                      const allScenarios = getAllScenarios();
                      const scenario = allScenarios.find(s => s.id === id);
                      const colors = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6'];
                      return (
                        <Line 
                          key={id}
                          type="monotone" 
                          dataKey={scenario?.name} 
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Risk vs Opportunity Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Risk vs Opportunity Assessment</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                {selectedScenarios.map(id => {
                  const allScenarios = getAllScenarios();
                  const scenario = allScenarios.find(s => s.id === id);
                  if (!scenario) return null;

                  const riskLevel = scenario.impacts.revenue < -10 ? 'high' : 
                                  scenario.impacts.revenue < 0 ? 'medium' : 'low';
                  const opportunityLevel = scenario.impacts.revenue > 15 ? 'high' :
                                         scenario.impacts.revenue > 5 ? 'medium' : 'low';

                  return (
                    <div key={id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: scenarioTypes[scenario.type].color }}
                        />
                        <span className="font-medium">{scenario.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="capitalize">{riskLevel} Risk</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="capitalize">{opportunityLevel} Opportunity</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === 'details' && (
        <div className="space-y-6">
          {selectedScenarios.map(id => {
            const allScenarios = getAllScenarios();
            const scenario = allScenarios.find(s => s.id === id);
            if (!scenario) return null;

            const IconComponent = scenario.type === 'ai_generated' ? Brain : scenarioTypes[scenario.type]?.icon || Brain;

            return (
              <Card key={id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <IconComponent 
                      className="h-5 w-5" 
                      style={{ color: scenario.type === 'ai_generated' ? '#8B5CF6' : scenarioTypes[scenario.type]?.color }}
                    />
                    <CardTitle>{scenario.name}</CardTitle>
                    <Badge variant="outline">{scenario.probability}% Probability</Badge>
                    {scenario.type === 'ai_generated' && (
                      <Badge variant="secondary">AI-Generated</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {scenario.type === 'ai_generated' ? (
                    // AI-generated scenario details
                    <div className="space-y-6">
                      {/* Market Intelligence */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          Market Intelligence
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Industry Trends:</span>
                            <ul className="mt-1 space-y-1">
                              {scenario.aiData.marketIntelligence.industry_trends?.slice(0, 3).map((trend: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                  {trend}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium">Risk Factors:</span>
                            <ul className="mt-1 space-y-1">
                              {scenario.aiData.marketIntelligence.risk_factors?.slice(0, 3).map((risk: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Cockpit Impacts */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Cockpit Impact Analysis
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {scenario.aiData.scenarioAnalysis.cockpit_impacts?.map((impact: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="font-medium">{impact.name}</span>
                              <span className={`font-bold ${impact.impact_percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {impact.impact_percentage > 0 ? '+' : ''}{impact.impact_percentage}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          AI Recommendations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <span className="font-medium text-green-600 flex items-center gap-1 mb-2">
                              <Clock className="h-3 w-3" />
                              Immediate Actions
                            </span>
                            <ul className="space-y-1 text-sm">
                              {scenario.aiData.recommendations.immediate_actions?.slice(0, 3).map((action: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <ArrowRight className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium text-blue-600 flex items-center gap-1 mb-2">
                              <Building className="h-3 w-3" />
                              Strategic Initiatives
                            </span>
                            <ul className="space-y-1 text-sm">
                              {scenario.aiData.recommendations.long_term_strategies?.slice(0, 3).map((strategy: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <ArrowRight className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  {strategy}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium text-orange-600 flex items-center gap-1 mb-2">
                              <Shield className="h-3 w-3" />
                              Risk Mitigation
                            </span>
                            <ul className="space-y-1 text-sm">
                              {scenario.aiData.recommendations.risk_mitigation?.slice(0, 3).map((mitigation: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Shield className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                  {mitigation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Original scenario details
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Triggers */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Key Triggers
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {scenario.details?.triggers?.map((trigger, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                              {trigger}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Assumptions */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Key Assumptions
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {scenario.details?.assumptions?.map((assumption, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                              {assumption}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actions */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Recommended Actions
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {scenario.details?.actions?.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Timeline - only for regular scenarios */}
                  {scenario.type !== 'ai_generated' && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Implementation Timeline</h4>
                      <div className="space-y-2">
                        {scenario.details?.timeline?.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 text-sm">
                            <div className="w-20 text-muted-foreground font-medium">{item.month}</div>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <div>{item.action}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <BusinessScenarioDialog 
        isOpen={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
      <EnhancedScenarioDialog
        open={enhancedDialogOpen}
        onOpenChange={setEnhancedDialogOpen}
        onScenarioGenerated={handleAiScenarioGenerated}
      />
    </div>
  );
};

export default BusinessScenarioPlanning;