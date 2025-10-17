
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStrategicObjectives, useStrategicRisksOpportunities } from "@/hooks/use-strategic-objectives";
import EnhancedStrategyMap from './EnhancedStrategyMap';
import { TrendingUp, AlertTriangle, Target, Users, Calendar, BarChart3, Lightbulb, Activity, Shield, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";

const NewBusinessHealthDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: objectives = [] } = useStrategicObjectives();
  const { data: risks = [] } = useStrategicRisksOpportunities();

  // Calculate overall health metrics
  const overallHealth = objectives.length > 0 
    ? Math.round(objectives.reduce((sum, obj) => 
        sum + (obj.strategic_objective_health?.[0]?.health_score || 0), 0
      ) / objectives.length)
    : 0;

  const perspectiveHealth = {
    financial: objectives.filter(o => o.perspective === 'financial'),
    customer: objectives.filter(o => o.perspective === 'customer'),
    internal: objectives.filter(o => o.perspective === 'internal'),
    learning: objectives.filter(o => o.perspective === 'learning')
  };

  const criticalRisks = risks.filter(r => r.type === 'risk' && r.impact_level === 'critical').length;
  const opportunities = risks.filter(r => r.type === 'opportunity').length;

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Navigation cards - removed Strategy Map card
  const navigationCards = [
    {
      id: 'heatmap',
      icon: BarChart3,
      title: 'Execution Heatmap',
      description: 'Performance visualization',
      color: 'text-orange-500',
      path: '/business-health/heatmap'
    },
    {
      id: 'tracker',
      icon: Calendar,
      title: 'Implementation Tracker',
      description: 'Initiative progress',
      color: 'text-green-500',
      path: '/business-health/tracker'
    },
    {
      id: 'scenarios',
      icon: Lightbulb,
      title: 'Scenario Planning',
      description: 'Future analysis',
      color: 'text-purple-500',
      path: '/business-health/scenarios'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Business Health</h1>
        <p className="text-gray-600">
          Strategic alignment, diagnostic scanning, and prioritized action for executive decision-making
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {navigationCards.map((card) => (
          <Card key={card.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(card.path)}>
            <CardContent className="p-6 text-center">
              <card.icon className={`h-8 w-8 mx-auto mb-3 ${card.color}`} />
              <h3 className="font-semibold mb-1">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Phase 3 Advanced Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/business-health/risk-matrix')}>
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 mx-auto mb-3 text-red-500" />
            <h3 className="font-semibold mb-1">Risk Assessment</h3>
            <p className="text-sm text-gray-600">Risk matrix and analysis</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/business-health/trends')}>
          <CardContent className="p-6 text-center">
            <TrendingDown className="h-8 w-8 mx-auto mb-3 text-teal-500" />
            <h3 className="font-semibold mb-1">Performance Trends</h3>
            <p className="text-sm text-gray-600">Historical analysis & forecasting</p>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Health</p>
                <p className={`text-2xl font-bold ${getHealthColor(overallHealth)}`}>
                  {overallHealth}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Objectives</p>
                <p className="text-2xl font-bold">{objectives.length}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Risks</p>
                <p className="text-2xl font-bold text-red-600">{criticalRisks}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Opportunities</p>
                <p className="text-2xl font-bold text-blue-600">{opportunities}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Perspective Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Balanced Scorecard Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(perspectiveHealth).map(([perspective, objs]) => {
              const avgHealth = objs.length > 0 
                ? Math.round(objs.reduce((sum, obj) => 
                    sum + (obj.strategic_objective_health?.[0]?.health_score || 0), 0
                  ) / objs.length)
                : 0;

              return (
                <div key={perspective} className="text-center p-4 border rounded-lg">
                  <h3 className="font-semibold capitalize mb-2">{perspective}</h3>
                  <div className={`text-2xl font-bold mb-1 ${getHealthColor(avgHealth)}`}>
                    {avgHealth}%
                  </div>
                  <p className="text-sm text-gray-500">{objs.length} objectives</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Strategy Map */}
      <EnhancedStrategyMap />

      {/* Quick Risk Assessment */}
      {risks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Strategic Risk & Opportunity Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Top Risks</h4>
                <div className="space-y-2">
                  {risks
                    .filter(r => r.type === 'risk')
                    .slice(0, 3)
                    .map(risk => (
                      <div key={risk.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{risk.title}</span>
                        <Badge variant={risk.impact_level === 'critical' ? 'destructive' : 'outline'}>
                          {risk.impact_level}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Key Opportunities</h4>
                <div className="space-y-2">
                  {risks
                    .filter(r => r.type === 'opportunity')
                    .slice(0, 3)
                    .map(opportunity => (
                      <div key={opportunity.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{opportunity.title}</span>
                        <Badge variant="default">
                          {opportunity.impact_level}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewBusinessHealthDashboard;
