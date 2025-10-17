
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";
import { useStrategicInitiativeMilestones } from "@/hooks/use-strategic-scenarios";

interface AddMilestoneDependencyDialogProps {
  children: React.ReactNode;
}

const AddMilestoneDependencyDialog: React.FC<AddMilestoneDependencyDialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [milestoneId, setMilestoneId] = useState<string>('');
  const [dependsOnMilestoneId, setDependsOnMilestoneId] = useState<string>('');
  const [dependencyType, setDependencyType] = useState<string>('finish_to_start');
  const [lagDays, setLagDays] = useState<number>(0);
  
  const { organizationClient } = useOrganization();
  const queryClient = useQueryClient();
  const { data: milestones = [] } = useStrategicInitiativeMilestones();

  const createDependencyMutation = useMutation({
    mutationFn: async (data: {
      milestone_id: string;
      depends_on_milestone_id: string;
      dependency_type: string;
      lag_days: number;
    }) => {
      if (!organizationClient) throw new Error('Organization client not available');
      
      const { error } = await organizationClient
        .from('strategic_milestone_dependencies')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-milestone-dependencies'] });
      toast.success("Milestone dependency created successfully");
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create dependency: ${error.message}`);
    },
  });

  const resetForm = () => {
    setMilestoneId('');
    setDependsOnMilestoneId('');
    setDependencyType('finish_to_start');
    setLagDays(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!milestoneId || !dependsOnMilestoneId) {
      toast.error("Please select both milestones");
      return;
    }

    if (milestoneId === dependsOnMilestoneId) {
      toast.error("A milestone cannot depend on itself");
      return;
    }

    createDependencyMutation.mutate({
      milestone_id: milestoneId,
      depends_on_milestone_id: dependsOnMilestoneId,
      dependency_type: dependencyType,
      lag_days: lagDays,
    });
  };

  const dependencyTypeOptions = [
    { value: 'finish_to_start', label: 'Finish to Start' },
    { value: 'start_to_start', label: 'Start to Start' },
    { value: 'finish_to_finish', label: 'Finish to Finish' },
    { value: 'start_to_finish', label: 'Start to Finish' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Milestone Dependency</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="milestone">Milestone</Label>
            <Select value={milestoneId} onValueChange={setMilestoneId}>
              <SelectTrigger>
                <SelectValue placeholder="Select milestone" />
              </SelectTrigger>
              <SelectContent>
                {milestones.map((milestone) => (
                  <SelectItem key={milestone.id} value={milestone.id}>
                    {milestone.milestone_name} - {milestone.strategic_initiatives?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependsOn">Depends On Milestone</Label>
            <Select value={dependsOnMilestoneId} onValueChange={setDependsOnMilestoneId}>
              <SelectTrigger>
                <SelectValue placeholder="Select dependency" />
              </SelectTrigger>
              <SelectContent>
                {milestones
                  .filter(milestone => milestone.id !== milestoneId)
                  .map((milestone) => (
                    <SelectItem key={milestone.id} value={milestone.id}>
                      {milestone.milestone_name} - {milestone.strategic_initiatives?.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependencyType">Dependency Type</Label>
            <Select value={dependencyType} onValueChange={setDependencyType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dependencyTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lagDays">Lag Days</Label>
            <Input
              type="number"
              value={lagDays}
              onChange={(e) => setLagDays(parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDependencyMutation.isPending}>
              {createDependencyMutation.isPending ? 'Creating...' : 'Create Dependency'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMilestoneDependencyDialog;
