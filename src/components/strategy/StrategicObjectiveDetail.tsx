
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStrategicObjectiveDetails, useStrategicRisksOpportunities } from "@/hooks/use-strategic-objectives";
import { ArrowLeft, Target, TrendingUp, AlertTriangle, CheckCircle, Clock, User } from "lucide-react";
import { Loader2 } from "lucide-react";

interface KPIData {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  format_type: string;
  format_options?: any;
  icon?: string;
  color_class?: string;
  kpi_data_type: string;
  trend_direction: string;
}

interface KPILink {
  id: string;
  is_primary: boolean;
  weight: number;
  cockpit_kpis: KPIData | null;
}

const StrategicObjectiveDetail: React.FC = () => {
  const { objectiveId } = useParams<{ objectiveId: string }>();
  const navigate = useNavigate();
  const { data: objective, isLoading } = useStrategicObjectiveDetails(objectiveId || '');
  const { data: risks = [] } = useStrategicRisksOpportunities(objectiveId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!objective) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Strategic objective not found</p>
        <Button onClick={() => navigate('/business-health')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Strategy Map
        </Button>
      </div>
    );
  }

  const latestHealth = objective.strategic_objective_health?.[0];
  // Safely handle KPIs - they might be empty arrays or contain objects with errors
  const kpis = Array.isArray(objective.strategic_objective_kpis) 
    ? objective.strategic_objective_kpis.filter((kpi: any) => 
        kpi && typeof kpi === 'object' && !('error' in kpi)
      ) as KPILink[]
    : [];
  const initiatives = objective.strategic_initiatives || [];
  const processes = objective.strategic_objective_processes || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'on_hold': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (impactLevel: string) => {
    switch (impactLevel) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/business-health')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Strategy Map
        </Button>
      </div>

      {/* Objective Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{objective.display_name}</CardTitle>
              <p className="text-gray-600 mt-2">{objective.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{latestHealth?.health_score || 0}%</div>
              <Badge 
                className={`mt-2 ${latestHealth?.rag_status === 'green' ? 'bg-green-500' : 
                  latestHealth?.rag_status === 'amber' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}
              >
                {latestHealth?.rag_status?.toUpperCase() || 'UNKNOWN'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Target</p>
                <p className="font-medium">{objective.target_description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Owner</p>
                <p className="font-medium">{objective.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Perspective</p>
                <p className="font-medium capitalize">{objective.perspective}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linked KPIs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Linked KPIs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kpis.length > 0 ? (
              <div className="space-y-4">
                {kpis.map((kpiLink) => {
                  const kpi = kpiLink.cockpit_kpis;
                  
                  if (!kpi) {
                    return (
                      <div key={kpiLink.id} className="p-4 border rounded-lg">
                        <p className="text-red-500 text-sm">KPI data unavailable</p>
                      </div>
                    );
                  }

                  return (
                    <div key={kpi.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{kpi.display_name || 'Unnamed KPI'}</h4>
                        {kpiLink.is_primary && (
                          <Badge variant="outline" className="text-xs">Primary</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Current: N/A</span>
                        <span>Target: N/A</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        KPI values managed separately in KPI management section
                      </div>
                      {kpi.description && (
                        <div className="text-xs text-gray-600 mt-1">
                          {kpi.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No KPIs linked to this objective</p>
                <p className="text-sm text-gray-400">
                  KPI data has been reset. You can recreate KPIs in the Admin section.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strategic Initiatives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Strategic Initiatives
            </CardTitle>
          </CardHeader>
          <CardContent>
            {initiatives.length > 0 ? (
              <div className="space-y-4">
                {initiatives.map((initiative) => (
                  <div key={initiative.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{initiative.name}</h4>
                      <Badge className={getPriorityColor(initiative.priority)}>
                        {initiative.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{initiative.description}</p>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(initiative.status)}`}></div>
                        {initiative.status.replace('_', ' ')}
                      </span>
                      <span>{initiative.progress_percentage}%</span>
                    </div>
                    <Progress value={initiative.progress_percentage} className="h-2" />
                    {initiative.target_date && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Target: {new Date(initiative.target_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No initiatives defined for this objective</p>
            )}
          </CardContent>
        </Card>

        {/* Related Business Processes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Related Business Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {processes.length > 0 ? (
              <div className="space-y-3">
                {processes.map((processLink) => {
                  const process = processLink.business_processes;
                  if (!process) return null;

                  return (
                    <div key={process.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{process.display_name}</h4>
                          <p className="text-sm text-gray-600">{process.description}</p>
                        </div>
                        <Badge variant="outline">
                          {Math.round(processLink.relevance_score * 100)}% relevant
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No business processes linked to this objective</p>
            )}
          </CardContent>
        </Card>

        {/* Risks & Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risks & Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {risks.length > 0 ? (
              <div className="space-y-3">
                {risks.map((risk) => (
                  <div key={risk.id} className={`p-3 border rounded-lg ${getRiskColor(risk.impact_level)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{risk.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant={risk.type === 'risk' ? 'destructive' : 'default'}>
                          {risk.type}
                        </Badge>
                        <Badge variant="outline">
                          {risk.impact_level}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{risk.description}</p>
                    {risk.owner && (
                      <p className="text-xs text-gray-500 mt-2">Owner: {risk.owner}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No risks or opportunities identified</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrategicObjectiveDetail;
