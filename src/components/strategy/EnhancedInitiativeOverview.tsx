import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, TrendingDown, AlertTriangle, Target, Users, 
  Calendar, DollarSign, CheckCircle, Clock, Activity
} from "lucide-react";
import { useInitiativeHealthScores, useInitiativeKpiLinks } from "@/hooks/use-initiative-health";
import { useStrategicInitiatives } from "@/hooks/use-strategic-scenarios";

const EnhancedInitiativeOverview: React.FC = () => {
  const { data: healthScores = [], isLoading: healthLoading } = useInitiativeHealthScores();
  const { data: initiatives = [], isLoading: initiativesLoading } = useStrategicInitiatives();
  const { data: kpiLinks = [] } = useInitiativeKpiLinks();

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4" />;
    if (score >= 60) return <Activity className="h-4 w-4" />;
    if (score >= 40) return <AlertTriangle className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  if (healthLoading || initiativesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading initiative overview...</div>
        </CardContent>
      </Card>
    );
  }

  // Calculate summary metrics
  const totalInitiatives = healthScores.length;
  const highPerformingInitiatives = healthScores.filter(h => h.health_score >= 80).length;
  const atRiskInitiatives = healthScores.filter(h => h.health_score < 40).length;
  const averageHealth = totalInitiatives > 0 
    ? Math.round(healthScores.reduce((sum, h) => sum + h.health_score, 0) / totalInitiatives)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold">{totalInitiatives}</div>
            <div className="text-xs text-gray-600">Active Initiatives</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">High Performing</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{highPerformingInitiatives}</div>
            <div className="text-xs text-gray-600">Health Score ≥ 80%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">At Risk</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{atRiskInitiatives}</div>
            <div className="text-xs text-gray-600">Health Score &lt; 40%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Average Health</span>
            </div>
            <div className="text-2xl font-bold">{averageHealth}%</div>
            <div className="text-xs text-gray-600">Overall Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Initiative Health Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Initiative Health Dashboard
            <Badge variant="outline" className="text-xs">
              Updated: {new Date().toLocaleDateString()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthScores.map((health) => {
              const initiative = initiatives.find(i => i.id === health.id);
              const linkedKpis = kpiLinks.filter(link => link.initiative_id === health.id);
              
              return (
                <div key={health.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{health.name}</h4>
                        <Badge className={`text-xs ${getHealthColor(health.health_score)}`}>
                          {getHealthIcon(health.health_score)}
                          <span className="ml-1">{Math.round(health.health_score)}% Health</span>
                        </Badge>
                        {health.overdue_milestones > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {health.overdue_milestones} Overdue
                          </Badge>
                        )}
                      </div>
                      
                      {linkedKpis.length > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-gray-600">
                            Linked to {linkedKpis.length} KPI{linkedKpis.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <div>
                            <div className="font-medium">{health.progress_percentage}%</div>
                            <div className="text-xs text-gray-500">Overall Progress</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Target className="h-3 w-3 text-blue-500" />
                          <div>
                            <div className="font-medium">{health.milestone_progress_percentage}%</div>
                            <div className="text-xs text-gray-500">Milestone Progress</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-purple-500" />
                          <div>
                            <div className="font-medium">{health.resource_utilization_percentage}%</div>
                            <div className="text-xs text-gray-500">Resource Utilization</div>
                          </div>
                        </div>
                        
                        {initiative && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-orange-500" />
                            <div>
                              <div className="font-medium">{initiative.status}</div>
                              <div className="text-xs text-gray-500">Status</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="mb-2">
                        <Progress value={health.health_score} className="w-24" />
                      </div>
                      <div className="text-xs text-gray-500">Health Score</div>
                    </div>
                  </div>

                  {/* Progress Breakdown */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Overall Progress</div>
                      <Progress value={health.progress_percentage} className="h-2" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Milestone Progress</div>
                      <Progress value={health.milestone_progress_percentage} className="h-2" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Resource Efficiency</div>
                      <Progress value={health.resource_utilization_percentage} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {healthScores.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No initiative health data available.</p>
                <p className="text-sm mt-2">Create initiatives and milestones to see health metrics.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedInitiativeOverview;