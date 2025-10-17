
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";
import { useStrategicInitiatives } from "@/hooks/use-strategic-scenarios";

interface AddInitiativeDependencyDialogProps {
  children: React.ReactNode;
}

const AddInitiativeDependencyDialog: React.FC<AddInitiativeDependencyDialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initiativeId, setInitiativeId] = useState<string>('');
  const [dependsOnInitiativeId, setDependsOnInitiativeId] = useState<string>('');
  const [dependencyType, setDependencyType] = useState<string>('finish_to_start');
  
  const { organizationClient } = useOrganization();
  const queryClient = useQueryClient();
  const { data: initiatives = [] } = useStrategicInitiatives();

  const createDependencyMutation = useMutation({
    mutationFn: async (data: {
      initiative_id: string;
      depends_on_initiative_id: string;
      dependency_type: string;
    }) => {
      if (!organizationClient) throw new Error('Organization client not available');
      
      const { error } = await organizationClient
        .from('strategic_initiative_dependencies')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-initiative-dependencies'] });
      toast.success("Initiative dependency created successfully");
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create dependency: ${error.message}`);
    },
  });

  const resetForm = () => {
    setInitiativeId('');
    setDependsOnInitiativeId('');
    setDependencyType('finish_to_start');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!initiativeId || !dependsOnInitiativeId) {
      toast.error("Please select both initiatives");
      return;
    }

    if (initiativeId === dependsOnInitiativeId) {
      toast.error("An initiative cannot depend on itself");
      return;
    }

    createDependencyMutation.mutate({
      initiative_id: initiativeId,
      depends_on_initiative_id: dependsOnInitiativeId,
      dependency_type: dependencyType,
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
          <DialogTitle>Add Initiative Dependency</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initiative">Initiative</Label>
            <Select value={initiativeId} onValueChange={setInitiativeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select initiative" />
              </SelectTrigger>
              <SelectContent>
                {initiatives.map((initiative) => (
                  <SelectItem key={initiative.id} value={initiative.id}>
                    {initiative.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependsOn">Depends On Initiative</Label>
            <Select value={dependsOnInitiativeId} onValueChange={setDependsOnInitiativeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select dependency" />
              </SelectTrigger>
              <SelectContent>
                {initiatives
                  .filter(initiative => initiative.id !== initiativeId)
                  .map((initiative) => (
                    <SelectItem key={initiative.id} value={initiative.id}>
                      {initiative.name}
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

export default AddInitiativeDependencyDialog;
