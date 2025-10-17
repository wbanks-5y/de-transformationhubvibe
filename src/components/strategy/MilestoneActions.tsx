
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface MilestoneActionsProps {
  milestone: any;
}

const MilestoneActions: React.FC<MilestoneActionsProps> = ({ milestone }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();

  const [editData, setEditData] = useState({
    milestone_name: milestone.milestone_name || '',
    target_date: milestone.target_date || '',
    estimated_duration_days: milestone.estimated_duration_days || 1,
    status: milestone.status || 'pending',
    is_critical_path: milestone.is_critical_path || false
  });

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!organizationClient) throw new Error('Organization client not available');
      
      const { error } = await organizationClient
        .from('strategic_initiative_milestones')
        .update({
          milestone_name: editData.milestone_name,
          target_date: editData.target_date || null,
          estimated_duration_days: editData.estimated_duration_days,
          status: editData.status,
          is_critical_path: editData.is_critical_path
        })
        .eq('id', milestone.id);

      if (error) throw error;

      toast.success("Milestone updated successfully!");

      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ['strategic-initiative-milestones'] });

    } catch (error: any) {
      toast.error(error.message || "Failed to update milestone");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    
    try {
      if (!organizationClient) throw new Error('Organization client not available');
      
      const { error } = await organizationClient
        .from('strategic_initiative_milestones')
        .delete()
        .eq('id', milestone.id);

      if (error) throw error;

      toast.success("Milestone deleted successfully!");

      setDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ['strategic-initiative-milestones'] });

    } catch (error: any) {
      toast.error(error.message || "Failed to delete milestone");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Milestone</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="milestone_name">Milestone Name</Label>
              <Input
                id="milestone_name"
                value={editData.milestone_name}
                onChange={(e) => setEditData(prev => ({ ...prev, milestone_name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_date">Target Date</Label>
              <Input
                id="target_date"
                type="date"
                value={editData.target_date}
                onChange={(e) => setEditData(prev => ({ ...prev, target_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_duration_days">Estimated Duration (days)</Label>
              <Input
                id="estimated_duration_days"
                type="number"
                min="1"
                value={editData.estimated_duration_days}
                onChange={(e) => setEditData(prev => ({ ...prev, estimated_duration_days: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={editData.status} 
                onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_critical_path"
                checked={editData.is_critical_path}
                onCheckedChange={(checked) => setEditData(prev => ({ ...prev, is_critical_path: checked as boolean }))}
              />
              <Label htmlFor="is_critical_path">Critical Path</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Milestone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete "{milestone.milestone_name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MilestoneActions;
