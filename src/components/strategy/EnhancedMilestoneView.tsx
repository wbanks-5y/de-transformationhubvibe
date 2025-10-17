import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, Calendar, Clock, AlertTriangle, Target, 
  TrendingUp, Users, DollarSign, ArrowRight, Lightbulb
} from "lucide-react";
import { useStrategicInitiativeMilestones } from "@/hooks/use-strategic-scenarios";
import { useInitiativeKpiLinks } from "@/hooks/use-initiative-health";
import AddMilestoneDialog from './AddMilestoneDialog';
import MilestoneActions from './MilestoneActions';

const EnhancedMilestoneView: React.FC = () => {
  const { data: milestones = [], isLoading } = useStrategicInitiativeMilestones();
  const { data: kpiLinks = [] } = useInitiativeKpiLinks();

  // Process milestones with enhanced data
  const processedMilestones = React.useMemo(() => {
    return milestones.map(milestone => {
      const isOverdue = milestone.target_date && new Date(milestone.target_date) < new Date() && milestone.status !== 'completed';
      const daysUntilDue = milestone.target_date 
        ? Math.ceil((new Date(milestone.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

      // Find linked KPIs for this milestone's initiative
      const initiativeKpis = kpiLinks.filter(link => 
        link.initiative_id === milestone.initiative_id
      );

      return {
        ...milestone,
        isOverdue,
        daysUntilDue,
        initiative: milestone.strategic_initiatives,
        linkedKpis: initiativeKpis.length,
        completionPercentage: milestone.completion_percentage || 0,
        deliverables: milestone.deliverables || []
      };
    });
  }, [milestones, kpiLinks]);

  // Group milestones by initiative
  const milestonesByInitiative = React.useMemo(() => {
    const grouped = new Map();
    
    processedMilestones.forEach(milestone => {
      const initiativeId = milestone.initiative_id;
      if (!grouped.has(initiativeId)) {
        grouped.set(initiativeId, {
          initiative: milestone.initiative,
          milestones: []
        });
      }
      grouped.get(initiativeId).milestones.push(milestone);
    });

    return Array.from(grouped.values()).map(group => ({
      ...group,
      milestones: group.milestones.sort((a, b) => {
        if (a.target_date && b.target_date) {
          return new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
        }
        return 0;
      })
    }));
  }, [processedMilestones]);

  const getStatusColor = (status: string, isOverdue: boolean) => {
    if (isOverdue && status !== 'completed') return 'destructive';
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getMilestoneProgress = (milestones: any[]) => {
    if (milestones.length === 0) return 0;
    const totalWeight = milestones.reduce((sum, m) => sum + (m.milestone_weight || 1), 0);
    const completedWeight = milestones
      .filter(m => m.status === 'completed')
      .reduce((sum, m) => sum + (m.milestone_weight || 1), 0);
    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading milestones...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Enhanced Milestone Tracking
          </CardTitle>
          <AddMilestoneDialog>
            <Button size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </AddMilestoneDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestonesByInitiative.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No milestones have been set yet.</p>
              <p className="text-sm mt-2">Add milestones to track initiative progress.</p>
              <div className="mt-4">
                <AddMilestoneDialog>
                  <Button>Add Your First Milestone</Button>
                </AddMilestoneDialog>
              </div>
            </div>
          ) : (
            milestonesByInitiative.map((group) => {
              const initiativeProgress = getMilestoneProgress(group.milestones);
              const overdueCount = group.milestones.filter(m => m.isOverdue).length;
              const completedCount = group.milestones.filter(m => m.status === 'completed').length;

              return (
                <div key={group.initiative?.id || 'unknown'} className="border rounded-lg p-4">
                  {/* Initiative Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-500" />
                        {group.initiative?.name || 'Unknown Initiative'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {completedCount}/{group.milestones.length} completed
                        </span>
                        {overdueCount > 0 && (
                          <span className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            {overdueCount} overdue
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {initiativeProgress}% milestone progress
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Progress value={initiativeProgress} className="w-24 mb-1" />
                      <div className="text-xs text-gray-500">Initiative Progress</div>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-3">
                    {group.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                        {/* Timeline Connector */}
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            milestone.status === 'completed' 
                              ? 'bg-green-500 border-green-500' 
                              : milestone.isOverdue 
                                ? 'bg-red-500 border-red-500'
                                : 'bg-white border-gray-300'
                          }`} />
                          {index < group.milestones.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{milestone.milestone_name}</h4>
                            <Badge variant={getStatusColor(milestone.status, milestone.isOverdue)}>
                              {milestone.isOverdue && milestone.status !== 'completed' ? 'Overdue' : milestone.status}
                            </Badge>
                            {milestone.is_critical_path && (
                              <Badge variant="destructive" className="text-xs">Critical Path</Badge>
                            )}
                            {milestone.linkedKpis > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Target className="h-3 w-3 mr-1" />
                                {milestone.linkedKpis} KPIs
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600">
                            {milestone.target_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(milestone.target_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            {milestone.estimated_duration_days && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{milestone.estimated_duration_days} days</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>{milestone.completionPercentage}% complete</span>
                            </div>
                            {milestone.daysUntilDue !== null && milestone.status !== 'completed' && (
                              <div className={`flex items-center gap-1 ${milestone.isOverdue ? 'text-red-600' : ''}`}>
                                <AlertTriangle className="h-3 w-3" />
                                <span>
                                  {milestone.isOverdue 
                                    ? `${Math.abs(milestone.daysUntilDue)} days overdue` 
                                    : `${milestone.daysUntilDue} days remaining`
                                  }
                                </span>
                              </div>
                            )}
                          </div>

                          {milestone.deliverables.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-500 mb-1">Deliverables:</div>
                              <div className="flex flex-wrap gap-1">
                                {milestone.deliverables.slice(0, 3).map((deliverable: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {deliverable}
                                  </Badge>
                                ))}
                                {milestone.deliverables.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{milestone.deliverables.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {milestone.completionPercentage > 0 && milestone.status !== 'completed' && (
                            <div className="mt-2">
                              <Progress value={milestone.completionPercentage} className="h-1.5" />
                            </div>
                          )}
                        </div>

                        <MilestoneActions milestone={milestone} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMilestoneView;