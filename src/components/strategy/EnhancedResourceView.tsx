import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, DollarSign, Calendar, TrendingUp, AlertTriangle, 
  Clock, Activity, Target, CheckCircle 
} from "lucide-react";
import { useStrategicResourceAllocations, useStrategicInitiativeMilestones } from "@/hooks/use-strategic-scenarios";
import AddResourceDialog from './AddResourceDialog';

const EnhancedResourceView: React.FC = () => {
  const { data: resources = [], isLoading: resourcesLoading } = useStrategicResourceAllocations();
  const { data: milestones = [], isLoading: milestonesLoading } = useStrategicInitiativeMilestones();

  // Process resources with timeline and milestone context
  const processedResources = React.useMemo(() => {
    return resources.map(resource => {
      const utilizationRate = resource.allocated_amount > 0 
        ? Math.round((resource.utilized_amount / resource.allocated_amount) * 100)
        : 0;

      // Find related milestones in the resource period
      const relatedMilestones = milestones.filter(milestone => 
        milestone.initiative_id === resource.initiative_id &&
        milestone.target_date &&
        new Date(milestone.target_date) >= new Date(resource.period_start || new Date()) &&
        new Date(milestone.target_date) <= new Date(resource.period_end || new Date())
      );

      // Calculate efficiency score
      const efficiencyScore = (resource.efficiency_percentage || 100) * (utilizationRate / 100);
      
      return {
        ...resource,
        utilizationRate,
        relatedMilestones,
        efficiencyScore: Math.round(efficiencyScore),
        isOverAllocated: utilizationRate > 100,
        isUnderUtilized: utilizationRate < 50,
        initiative: resource.strategic_initiatives
      };
    });
  }, [resources, milestones]);

  // Group resources by initiative and time period
  const resourcesByInitiative = React.useMemo(() => {
    const grouped = new Map();
    
    processedResources.forEach(resource => {
      const initiativeId = resource.initiative_id;
      if (!grouped.has(initiativeId)) {
        grouped.set(initiativeId, {
          initiative: resource.initiative,
          resources: []
        });
      }
      grouped.get(initiativeId).resources.push(resource);
    });

    return Array.from(grouped.values()).map(group => ({
      ...group,
      totalAllocated: group.resources.reduce((sum, r) => sum + (r.allocated_amount || 0), 0),
      totalUtilized: group.resources.reduce((sum, r) => sum + (r.utilized_amount || 0), 0),
      avgEfficiency: group.resources.length > 0 
        ? Math.round(group.resources.reduce((sum, r) => sum + r.efficiencyScore, 0) / group.resources.length)
        : 0
    }));
  }, [processedResources]);

  const getResourceCategoryIcon = (category: string) => {
    switch (category) {
      case 'human_resources': return <Users className="h-4 w-4" />;
      case 'budget': return <DollarSign className="h-4 w-4" />;
      case 'equipment': return <Activity className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getUtilizationColor = (rate: number) => {
    if (rate > 100) return 'text-red-600 bg-red-100';
    if (rate > 90) return 'text-orange-600 bg-orange-100';
    if (rate > 70) return 'text-green-600 bg-green-100';
    if (rate > 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (resourcesLoading || milestonesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading resource data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Resource Allocation & Timeline
          </CardTitle>
          <AddResourceDialog>
            <Button size="sm">
              <Users className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </AddResourceDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {resourcesByInitiative.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No resource allocations found.</p>
              <p className="text-sm mt-2">Add resources to track utilization and timeline impact.</p>
              <div className="mt-4">
                <AddResourceDialog>
                  <Button>Add Your First Resource</Button>
                </AddResourceDialog>
              </div>
            </div>
          ) : (
            resourcesByInitiative.map((group) => {
              const overallUtilization = group.totalAllocated > 0 
                ? Math.round((group.totalUtilized / group.totalAllocated) * 100)
                : 0;

              return (
                <div key={group.initiative?.id || 'unknown'} className="border rounded-lg p-4">
                  {/* Initiative Header - More prominent like milestones */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        {group.initiative?.name || 'Unknown Initiative'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${group.totalAllocated.toLocaleString()} allocated
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          ${group.totalUtilized.toLocaleString()} utilized
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {group.avgEfficiency}% avg efficiency
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {group.resources.length} resource{group.resources.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Progress value={overallUtilization} className="w-24 mb-1" />
                      <div className="text-xs text-gray-500">{overallUtilization}% Utilization</div>
                    </div>
                  </div>

                  {/* Resource Allocations */}
                  <div className="space-y-3">
                    {group.resources.map((resource) => (
                      <div key={resource.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getResourceCategoryIcon(resource.resource_category)}
                            <div>
                              <h4 className="font-medium">{resource.resource_type}</h4>
                              <div className="text-sm text-gray-600">
                                {resource.period_start && resource.period_end && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(resource.period_start).toLocaleDateString()} - {new Date(resource.period_end).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge className={`text-xs ${getUtilizationColor(resource.utilizationRate)}`}>
                              {resource.utilizationRate}% utilized
                            </Badge>
                            {resource.isOverAllocated && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Over-allocated
                              </Badge>
                            )}
                            {resource.isUnderUtilized && (
                              <Badge variant="outline" className="text-xs text-yellow-600">
                                Under-utilized
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <div className="text-xs text-gray-500">Allocated</div>
                            <div className="font-medium">
                              {resource.allocated_amount} {resource.unit || 'units'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Utilized</div>
                            <div className="font-medium">
                              {resource.utilized_amount} {resource.unit || 'units'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Efficiency</div>
                            <div className="font-medium">{resource.efficiencyScore}%</div>
                          </div>
                          {resource.hourly_rate && (
                            <div>
                              <div className="text-xs text-gray-500">Rate</div>
                              <div className="font-medium">${resource.hourly_rate}/hr</div>
                            </div>
                          )}
                        </div>

                        {/* Related Milestones */}
                        {resource.relatedMilestones.length > 0 && (
                          <div className="border-t pt-3">
                            <div className="text-xs text-gray-500 mb-2">
                              Milestones in this period:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {resource.relatedMilestones.map((milestone) => (
                                <Badge key={milestone.id} variant="outline" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {milestone.milestone_name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-2">
                          <Progress value={resource.utilizationRate} className="h-2" />
                        </div>
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

export default EnhancedResourceView;