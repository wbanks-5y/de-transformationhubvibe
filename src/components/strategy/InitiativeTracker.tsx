
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useStrategicInitiativeMilestones, 
  useStrategicResourceAllocations,
  useStrategicInitiatives 
} from "@/hooks/use-strategic-scenarios";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, Target, DollarSign, Users, Clock, AlertTriangle, CheckCircle, 
  Network, Lightbulb, TrendingUp, FileText, User, MapPin, Activity 
} from "lucide-react";
import TimelineView from './TimelineView';
import DependencyManager from './DependencyManager';
import AddMilestoneDialog from './AddMilestoneDialog';
import AddResourceDialog from './AddResourceDialog';
import AddInitiativeDialog from './AddInitiativeDialog';
import MilestoneActions from './MilestoneActions';
import InitiativeActions from './InitiativeActions';
import EnhancedInitiativeOverview from './EnhancedInitiativeOverview';
import EnhancedMilestoneView from './EnhancedMilestoneView';
import EnhancedResourceView from './EnhancedResourceView';
import PredictiveAnalyticsDashboard from './PredictiveAnalyticsDashboard';

const InitiativeTracker: React.FC = () => {
  const { data: milestones = [], isLoading: milestonesLoading, error: milestonesError } = useStrategicInitiativeMilestones();
  const { data: resourceAllocations = [], isLoading: resourcesLoading, error: resourcesError } = useStrategicResourceAllocations();
  const { data: initiatives = [], isLoading: initiativesLoading, error: initiativesError } = useStrategicInitiatives();

  console.log('InitiativeTracker data:', {
    initiatives: initiatives.length,
    milestones: milestones.length,
    resourceAllocations: resourceAllocations.length,
    loading: { initiatives: initiativesLoading, milestones: milestonesLoading, resources: resourcesLoading },
    errors: { initiatives: initiativesError, milestones: milestonesError, resources: resourcesError }
  });

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

  // Note: processedResources removed since EnhancedResourceView handles its own data processing

  // Calculate summary metrics
  const summaryMetrics = React.useMemo(() => {
    const totalInitiatives = initiatives.length;
    const completedInitiatives = initiatives.filter(i => i.status === 'completed').length;
    const inProgressInitiatives = initiatives.filter(i => i.status === 'in_progress').length;
    const overBudgetInitiatives = initiatives.filter(i => {
      const budgetAllocated = i.budget_allocated || 0;
      const budgetUtilized = i.budget_utilized || 0;
      return budgetAllocated > 0 && budgetUtilized > budgetAllocated;
    }).length;

    const totalMilestones = processedMilestones.length;
    const completedMilestones = processedMilestones.filter(m => m.status === 'completed').length;
    const overdueMilestones = processedMilestones.filter(m => m.isOverdue).length;

    const totalBudget = initiatives.reduce((sum, i) => sum + (i.budget_allocated || 0), 0);
    const utilizedBudget = initiatives.reduce((sum, i) => sum + (i.budget_utilized || 0), 0);
    const budgetUtilization = totalBudget > 0 ? Math.round((utilizedBudget / totalBudget) * 100) : 0;

    return {
      totalInitiatives,
      completedInitiatives,
      inProgressInitiatives,
      overBudgetInitiatives,
      totalMilestones,
      completedMilestones,
      overdueMilestones,
      budgetUtilization,
      totalBudget,
      utilizedBudget
    };
  }, [initiatives, processedMilestones]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'on_hold': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const colorMap = {
      'completed': 'bg-green-500',
      'in_progress': 'bg-blue-500', 
      'on_hold': 'bg-yellow-500',
      'cancelled': 'bg-red-500',
      'planning': 'bg-gray-500'
    };
    
    return <Badge className={colorMap[status] || 'bg-gray-500'}>{status.replace('_', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colorMap = {
      'critical': 'bg-red-500',
      'high': 'bg-orange-500',
      'medium': 'bg-yellow-500',
      'low': 'bg-green-500'
    };
    
    return <Badge variant="outline" className={`border-${colorMap[priority]?.replace('bg-', '')} text-${colorMap[priority]?.replace('bg-', '')}`}>{priority}</Badge>;
  };

  // Show loading state
  if (initiativesLoading || milestonesLoading || resourcesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading initiative data...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (initiativesError || milestonesError || resourcesError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-600">
            Error loading data: {initiativesError?.message || milestonesError?.message || resourcesError?.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Initiative Tracker</h2>
          <p className="text-gray-600">Strategic initiative management, milestones, and resource tracking</p>
        </div>
        <div className="flex gap-2">
          <AddInitiativeDialog>
            <Button>
              <Lightbulb className="h-4 w-4 mr-2" />
              Add Initiative
            </Button>
          </AddInitiativeDialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Initiatives</span>
            </div>
            <div className="text-2xl font-bold">{summaryMetrics.inProgressInitiatives}/{summaryMetrics.totalInitiatives}</div>
            <div className="text-xs text-gray-600">In Progress</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Milestones</span>
            </div>
            <div className="text-2xl font-bold">{summaryMetrics.completedMilestones}/{summaryMetrics.totalMilestones}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{summaryMetrics.overdueMilestones}</div>
            <div className="text-xs text-gray-600">Need attention</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Budget</span>
            </div>
            <div className="text-2xl font-bold">{summaryMetrics.budgetUtilization}%</div>
            <div className="text-xs text-gray-600">Utilization</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <EnhancedInitiativeOverview />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <PredictiveAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="initiatives" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Strategic Initiatives</CardTitle>
                <AddInitiativeDialog>
                  <Button size="sm">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Add Initiative
                  </Button>
                </AddInitiativeDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {initiatives.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No initiatives have been created yet.</p>
                    <p className="text-sm mt-2">Start by adding your first strategic initiative.</p>
                    <div className="mt-4">
                      <AddInitiativeDialog>
                        <Button>Add Your First Initiative</Button>
                      </AddInitiativeDialog>
                    </div>
                  </div>
                ) : (
                  initiatives.map((initiative) => {
                    const budgetAllocated = initiative.budget_allocated || 0;
                    return (
                      <div key={initiative.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{initiative.name}</h4>
                              {getStatusBadge(initiative.status)}
                              {getPriorityBadge(initiative.priority)}
                            </div>
                            {initiative.description && (
                              <p className="text-gray-600 mb-3">{initiative.description}</p>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              {initiative.owner && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{initiative.owner}</span>
                                </div>
                              )}
                              {initiative.target_date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(initiative.target_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {budgetAllocated > 0 && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  <span>${budgetAllocated.toLocaleString()}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{initiative.progress_percentage || 0}% complete</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <Progress value={initiative.progress_percentage || 0} className="w-24" />
                            </div>
                            <InitiativeActions initiative={initiative} />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <EnhancedMilestoneView />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <EnhancedResourceView />
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

export default InitiativeTracker;
