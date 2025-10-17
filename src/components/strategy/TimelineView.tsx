
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Clock, ArrowRight, AlertTriangle } from "lucide-react";
import { useStrategicInitiativeMilestones, useStrategicMilestoneDependencies } from "@/hooks/use-strategic-scenarios";

const TimelineView: React.FC = () => {
  const { data: milestones = [] } = useStrategicInitiativeMilestones();
  const { data: dependencies = [] } = useStrategicMilestoneDependencies();

  const timelineData = useMemo(() => {
    // Create a timeline with milestones grouped by month
    const timeline = new Map();
    
    milestones.forEach(milestone => {
      if (!milestone.target_date) return;
      
      const date = new Date(milestone.target_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!timeline.has(monthKey)) {
        timeline.set(monthKey, {
          monthKey,
          displayName: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          milestones: []
        });
      }
      
      const isOverdue = new Date(milestone.target_date) < new Date() && milestone.status !== 'completed';
      const daysUntilDue = Math.ceil((new Date(milestone.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      timeline.get(monthKey).milestones.push({
        ...milestone,
        isOverdue,
        daysUntilDue,
        hasDependencies: dependencies.some(dep => dep.milestone_id === milestone.id || dep.depends_on_milestone_id === milestone.id)
      });
    });
    
    // Sort timeline by month and milestones by date
    return Array.from(timeline.values())
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .map(month => ({
        ...month,
        milestones: month.milestones.sort((a, b) => 
          new Date(a.target_date).getTime() - new Date(b.target_date).getTime()
        )
      }));
  }, [milestones, dependencies]);

  const getStatusColor = (status: string, isOverdue: boolean) => {
    if (isOverdue && status !== 'completed') return 'border-l-red-500 bg-red-50';
    switch (status) {
      case 'completed': return 'border-l-green-500 bg-green-50';
      case 'in_progress': return 'border-l-blue-500 bg-blue-50';
      case 'pending': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getCriticalPathIndicator = (milestone: any) => {
    if (milestone.is_critical_path) {
      return (
        <Badge variant="destructive" className="text-xs">
          Critical Path
        </Badge>
      );
    }
    return null;
  };

  if (timelineData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No milestones with target dates found.</p>
        <p className="text-sm mt-2">Add milestones with target dates to see the timeline view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {timelineData.map((month, monthIndex) => (
          <div key={month.monthKey} className="relative">
            {/* Month header */}
            <div className="flex items-center mb-4">
              <div className="relative z-10 bg-white border-2 border-blue-500 rounded-full w-12 h-12 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{month.displayName}</h3>
                <p className="text-sm text-gray-500">{month.milestones.length} milestones</p>
              </div>
            </div>
            
            {/* Milestones for this month */}
            <div className="ml-16 space-y-3 mb-8">
              {month.milestones.map((milestone) => (
                <Card 
                  key={milestone.id} 
                  className={`border-l-4 ${getStatusColor(milestone.status, milestone.isOverdue)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{milestone.milestone_name}</h4>
                          {getCriticalPathIndicator(milestone)}
                          {milestone.hasDependencies && (
                            <Badge variant="outline" className="text-xs">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              Has Dependencies
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          Initiative: {milestone.strategic_initiatives?.name || 'Unknown'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {new Date(milestone.target_date).toLocaleDateString()}
                          </span>
                          
                          {milestone.estimated_duration_days && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {milestone.estimated_duration_days} days
                            </span>
                          )}
                          
                          {milestone.isOverdue && (
                            <span className="flex items-center gap-1 text-red-500">
                              <AlertTriangle className="h-3 w-3" />
                              {Math.abs(milestone.daysUntilDue)} days overdue
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge 
                          variant={milestone.status === 'completed' ? 'default' : 'outline'}
                          className="mb-2"
                        >
                          {milestone.status.replace('_', ' ')}
                        </Badge>
                        
                        {milestone.strategic_initiatives?.progress_percentage !== undefined && (
                          <div className="text-xs text-gray-500">
                            <div>Progress: {milestone.strategic_initiatives.progress_percentage}%</div>
                            <Progress 
                              value={milestone.strategic_initiatives.progress_percentage} 
                              className="w-16 mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
