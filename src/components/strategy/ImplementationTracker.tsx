import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStrategicInitiativeMilestones, useStrategicResourceAllocations } from "@/hooks/use-strategic-scenarios";
import { useStrategicObjectives } from "@/hooks/use-strategic-objectives";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, DollarSign, Users, Clock, AlertTriangle, CheckCircle, Network } from "lucide-react";
import TimelineView from './TimelineView';
import DependencyManager from './DependencyManager';
import AddMilestoneDialog from './AddMilestoneDialog';
import AddResourceDialog from './AddResourceDialog';
import MilestoneActions from './MilestoneActions';

const ImplementationTracker: React.FC = () => {
  const { data: milestones = [] } = useStrategicInitiativeMilestones();
  const { data: resourceAllocations = [] } = useStrategicResourceAllocations();
  const { data: objectives = [] } = useStrategicObjectives();

  // Process milestones data
  const processedMilestones = React.useMemo(() => {
    return milestones.map(milestone => {
      const isOverdue = milestone.target_date && new Date(milestone.target_date) < new Date() && milestone.status !== 'completed';
      const daysUntilDue = milestone.target_date 
        ? Math.ceil((new Date(milestone.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        ...milestone,
        isOverdue,
        daysUntilDue,
        initiative: milestone.strategic_initiatives
      };
    });
  }, [milestones]);

  // Process resource allocations
  const processedResources = React.useMemo(() => {
    return resourceAllocations.map(resource => {
      const utilizationRate = resource.allocated_amount > 0 
        ? Math.round((resource.utilized_amount / resource.allocated_amount) * 100)
        : 0;

      return {
        ...resource,
        utilizationRate,
        initiative: resource.strategic_initiatives
      };
    });
  }, [resourceAllocations]);

  // Calculate summary metrics
  const summaryMetrics = React.useMemo(() => {
    const totalMilestones = processedMilestones.length;
    const completedMilestones = processedMilestones.filter(m => m.status === 'completed').length;
    const overdueMilestones = processedMilestones.filter(m => m.isOverdue).length;
    const upcomingMilestones = processedMilestones.filter(m => 
      m.daysUntilDue !== null && m.daysUntilDue <= 30 && m.daysUntilDue > 0 && m.status !== 'completed'
    ).length;

    const totalBudget = processedResources
      .filter(r => r.resource_type === 'budget')
      .reduce((sum, r) => sum + r.allocated_amount, 0);
    
    const utilizedBudget = processedResources
      .filter(r => r.resource_type === 'budget')
      .reduce((sum, r) => sum + r.utilized_amount, 0);

    const budgetUtilization = totalBudget > 0 ? Math.round((utilizedBudget / totalBudget) * 100) : 0;

    return {
      totalMilestones,
      completedMilestones,
      overdueMilestones,
      upcomingMilestones,
      completionRate: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0,
      budgetUtilization,
      totalBudget,
      utilizedBudget
    };
  }, [processedMilestones, processedResources]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue && status !== 'completed') {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    switch (status) {
      case 'completed': return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending': return <Badge variant="outline">Pending</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Implementation Tracker</h2>
          <p className="text-gray-600">Initiative progress, milestones, and resource allocation</p>
        </div>
        <div className="flex gap-2">
          <AddMilestoneDialog>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </AddMilestoneDialog>
          <AddResourceDialog>
            <Button variant="outline" size="sm">
              <DollarSign className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </AddResourceDialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Milestones</span>
            </div>
            <div className="text-2xl font-bold">{summaryMetrics.completedMilestones}/{summaryMetrics.totalMilestones}</div>
            <div className="text-xs text-gray-600">{summaryMetrics.completionRate}% completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{summaryMetrics.overdueMilestones}</div>
            <div className="text-xs text-gray-600">Require attention</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Upcoming</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{summaryMetrics.upcomingMilestones}</div>
            <div className="text-xs text-gray-600">Next 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Budget</span>
            </div>
            <div className="text-2xl font-bold">{summaryMetrics.budgetUtilization}%</div>
            <div className="text-xs text-gray-600">Utilization rate</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="milestones" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Initiative Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processedMilestones.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
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
                  processedMilestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle 
                            className={`h-5 w-5 ${milestone.status === 'completed' ? 'text-green-500' : 'text-gray-300'}`}
                          />
                          <h4 className="font-medium">{milestone.milestone_name}</h4>
                          {getStatusBadge(milestone.status, milestone.isOverdue)}
                          {milestone.is_critical_path && (
                            <Badge variant="destructive" className="text-xs">Critical Path</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Initiative: {milestone.strategic_initiatives?.name || 'Unknown'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {milestone.target_date && (
                            <span>Target: {new Date(milestone.target_date).toLocaleDateString()}</span>
                          )}
                          {milestone.completion_date && (
                            <span>Completed: {new Date(milestone.completion_date).toLocaleDateString()}</span>
                          )}
                          {milestone.daysUntilDue !== null && milestone.status !== 'completed' && (
                            <span className={milestone.isOverdue ? 'text-red-500' : ''}>
                              {milestone.isOverdue ? `${Math.abs(milestone.daysUntilDue)} days overdue` : `${milestone.daysUntilDue} days remaining`}
                            </span>
                          )}
                          {milestone.estimated_duration_days && (
                            <span>Duration: {milestone.estimated_duration_days} days</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Progress: {milestone.strategic_initiatives?.progress_percentage || 0}%
                          </div>
                          <Progress 
                            value={milestone.strategic_initiatives?.progress_percentage || 0} 
                            className="w-24 mt-1"
                          />
                        </div>
                        <MilestoneActions milestone={milestone} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Resource Allocation & Utilization</CardTitle>
                <AddResourceDialog>
                  <Button size="sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </AddResourceDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processedResources.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No resource allocations have been set yet.</p>
                    <p className="text-sm mt-2">Track budget, people, and time allocations for initiatives.</p>
                    <div className="mt-4">
                      <AddResourceDialog>
                        <Button>Add Your First Resource Allocation</Button>
                      </AddResourceDialog>
                    </div>
                  </div>
                ) : (
                  processedResources.map((resource) => (
                    <div key={resource.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{resource.initiative?.name || 'Unknown Initiative'}</h4>
                          <p className="text-sm text-gray-600 capitalize">{resource.resource_type}</p>
                          {resource.period_type && (
                            <Badge variant="outline" className="text-xs mt-1">{resource.period_type}</Badge>
                          )}
                        </div>
                        <Badge 
                          variant={resource.utilizationRate > 100 ? 'destructive' : 
                                  resource.utilizationRate > 80 ? 'default' : 'outline'}
                        >
                          {resource.utilizationRate}% utilized
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Allocated</span>
                          <div className="font-medium">
                            {resource.allocated_amount.toLocaleString()} {resource.unit}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Utilized</span>
                          <div className="font-medium">
                            {resource.utilized_amount.toLocaleString()} {resource.unit}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Remaining</span>
                          <div className="font-medium">
                            {(resource.allocated_amount - resource.utilized_amount).toLocaleString()} {resource.unit}
                          </div>
                        </div>
                      </div>
                      
                      <Progress 
                        value={Math.min(resource.utilizationRate, 100)} 
                        className="mt-3"
                      />
                      
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Period: {new Date(resource.period_start).toLocaleDateString()} - {new Date(resource.period_end).toLocaleDateString()}</span>
                        {resource.utilizationRate > 100 && (
                          <span className="text-red-500">Over budget!</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineView />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <DependencyManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImplementationTracker;
