
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Save, Target, X, Flag, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface MetricGoalSettingProps {
  metricId: string;
  metricName: string;
  currentValue: string;
}

interface Goal {
  target: string;
  deadline: string;
  notes: string;
}

const MetricGoalSetting: React.FC<MetricGoalSettingProps> = ({ 
  metricId, 
  metricName,
  currentValue 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasGoal, setHasGoal] = useState(false);
  const [goal, setGoal] = useState<Goal>({
    target: "",
    deadline: "",
    notes: ""
  });
  const isMobile = useIsMobile();

  // Parse the current value to number for progress calculation
  const currentValueNumber = parseFloat(currentValue.replace(/[+%]/g, ''));
  
  // Calculate progress percentage for the progress bar
  const calculateProgress = (): number => {
    if (!goal.target) return 0;
    
    const targetValue = parseFloat(goal.target.replace(/[+%]/g, ''));
    if (isNaN(targetValue) || targetValue === 0) return 0;
    
    // Calculate percentage of current value relative to target
    const percentage = (currentValueNumber / targetValue) * 100;
    
    // Cap at 100%
    return Math.min(Math.max(percentage, 0), 100);
  };
  
  // Get goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('metricGoals');
    if (savedGoals) {
      const goalsObj = JSON.parse(savedGoals);
      if (goalsObj[metricId]) {
        setGoal(goalsObj[metricId]);
        setHasGoal(true);
      }
    }
  }, [metricId]);

  const handleSaveGoal = () => {
    // Validation
    if (!goal.target.trim() || !goal.deadline.trim()) {
      toast.error("Please provide both target and deadline");
      return;
    }

    // Save to localStorage
    const savedGoals = localStorage.getItem('metricGoals') || '{}';
    const goalsObj = JSON.parse(savedGoals);
    goalsObj[metricId] = goal;
    localStorage.setItem('metricGoals', JSON.stringify(goalsObj));
    
    setHasGoal(true);
    setIsEditing(false);
    
    toast.success(`Target set for ${metricName}`);
  };

  const handleRemoveGoal = () => {
    // Remove from localStorage
    const savedGoals = localStorage.getItem('metricGoals') || '{}';
    const goalsObj = JSON.parse(savedGoals);
    delete goalsObj[metricId];
    localStorage.setItem('metricGoals', JSON.stringify(goalsObj));
    
    setHasGoal(false);
    setGoal({
      target: "",
      deadline: "",
      notes: ""
    });
    
    toast.success(`Target for ${metricName} has been removed`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-amber-600" />
            Goal Setting
          </CardTitle>
          <CardDescription>Set and track performance targets</CardDescription>
        </div>
        {!isEditing && (
          <Button 
            variant={hasGoal ? "outline" : "default"} 
            size="sm" 
            onClick={() => setIsEditing(true)}
          >
            {hasGoal ? (
              <>
                <Edit className="h-4 w-4 mr-1" />
                Edit Goal
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Set Goal
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target Value</label>
                <Input 
                  type="text" 
                  placeholder="e.g. 25%" 
                  value={goal.target}
                  onChange={(e) => setGoal({...goal, target: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Date</label>
                <Input 
                  type="date" 
                  value={goal.deadline}
                  onChange={(e) => setGoal({...goal, deadline: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <Input 
                placeholder="Additional notes" 
                value={goal.notes}
                onChange={(e) => setGoal({...goal, notes: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSaveGoal}
              >
                <Save className="h-4 w-4 mr-1" />
                Save Goal
              </Button>
            </div>
          </div>
        ) : hasGoal ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Current</span>
                  <span className="text-sm text-gray-500">Target</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold">{currentValue}</span>
                  <span className="flex items-center">
                    <Flag className="h-4 w-4 text-amber-600 mr-1" />
                    <span className="text-2xl font-bold">{goal.target}</span>
                  </span>
                </div>
                <div className="mt-2">
                  <Progress value={calculateProgress()} className="h-2" />
                </div>
              </div>
              
              <div className="flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Target Date:</span>
                    <span className="font-medium">{formatDate(goal.deadline)}</span>
                  </div>
                  {goal.notes && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                      {goal.notes}
                    </div>
                  )}
                </div>
                
                {!isMobile && (
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleRemoveGoal}
                    >
                      Remove Goal
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {isMobile && (
              <div className="flex justify-end mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleRemoveGoal}
                >
                  Remove Goal
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Target className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Goal Set</h3>
            <p className="text-gray-500 mb-4 max-w-md">
              Set targets for this metric to track progress and drive performance improvement
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricGoalSetting;
