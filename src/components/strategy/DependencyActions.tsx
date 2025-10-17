
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";

interface InitiativeDependencyActionsProps {
  dependency: {
    id: string;
    dependency_type: string;
    initiative?: { id: string; name: string };
    depends_on?: { id: string; name: string };
  };
}

interface MilestoneDependencyActionsProps {
  dependency: {
    id: string;
    dependency_type: string;
    lag_days?: number;
    milestone?: { id: string; milestone_name: string };
    depends_on?: { id: string; milestone_name: string };
  };
}

export const InitiativeDependencyActions: React.FC<InitiativeDependencyActionsProps> = ({ dependency }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [dependencyType, setDependencyType] = useState(dependency.dependency_type);
  
  const { organizationClient } = useOrganization();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: { dependency_type: string }) => {
      if (!organizationClient) throw new Error('Organization client not available');
      
      const { error } = await organizationClient
        .from('strategic_initiative_dependencies')
        .update(data)
        .eq('id', dependency.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-initiative-dependencies'] });
      toast.success("Dependency updated successfully");
      setIsEditOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update dependency: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!organizationClient) throw new Error('Organization client not available');
      
      const { error } = await organizationClient
        .from('strategic_initiative_dependencies')
        .delete()
        .eq('id', dependency.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-initiative-dependencies'] });
      toast.success("Dependency deleted successfully");
      setIsDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to delete dependency: ${error.message}`);
    },
  });

  const dependencyTypeOptions = [
    { value: 'finish_to_start', label: 'Finish to Start' },
    { value: 'start_to_start', label: 'Start to Start' },
    { value: 'finish_to_finish', label: 'Finish to Finish' },
    { value: 'start_to_finish', label: 'Start to Finish' },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Initiative Dependency</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate({ dependency_type: dependencyType });
          }} className="space-y-4">
            <div className="space-y-2">
              <Label>From: {dependency.initiative?.name}</Label>
              <Label>To: {dependency.depends_on?.name}</Label>
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
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dependency</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this dependency? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const MilestoneDependencyActions: React.FC<MilestoneDependencyActionsProps> = ({ dependency }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [dependencyType, setDependencyType] = useState(dependency.dependency_type);
  const [lagDays, setLagDays] = useState(dependency.lag_days || 0);
  
  const { organizationClient } = useOrganization();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: { dependency_type: string; lag_days: number }) => {
      if (!organizationClient) throw new Error('Organization client not available');
      
      const { error } = await organizationClient
        .from('strategic_milestone_dependencies')
        .update(data)
        .eq('id', dependency.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-milestone-dependencies'] });
      toast.success("Dependency updated successfully");
      setIsEditOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update dependency: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!organizationClient) throw new Error('Organization client not available');
      
      const { error } = await organizationClient
        .from('strategic_milestone_dependencies')
        .delete()
        .eq('id', dependency.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-milestone-dependencies'] });
      toast.success("Dependency deleted successfully");
      setIsDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to delete dependency: ${error.message}`);
    },
  });

  const dependencyTypeOptions = [
    { value: 'finish_to_start', label: 'Finish to Start' },
    { value: 'start_to_start', label: 'Start to Start' },
    { value: 'finish_to_finish', label: 'Finish to Finish' },
    { value: 'start_to_finish', label: 'Start to Finish' },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Milestone Dependency</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate({ dependency_type: dependencyType, lag_days: lagDays });
          }} className="space-y-4">
            <div className="space-y-2">
              <Label>From: {dependency.milestone?.milestone_name}</Label>
              <Label>To: {dependency.depends_on?.milestone_name}</Label>
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
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dependency</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this dependency? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
