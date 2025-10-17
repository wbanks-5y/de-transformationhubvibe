
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Plus } from "lucide-react";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import { useStrategicObjectives } from "@/hooks/use-strategic-objectives";
import { useQueryClient } from "@tanstack/react-query";

interface AddMilestoneDialogProps {
  children?: React.ReactNode;
}

const AddMilestoneDialog: React.FC<AddMilestoneDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: objectives = [] } = useStrategicObjectives();
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();

  const [formData, setFormData] = useState({
    milestone_name: '',
    initiative_id: '',
    target_date: '',
    estimated_duration_days: 1,
    status: 'pending',
    is_critical_path: false
  });

  // Get initiatives from objectives
  const initiatives = objectives.flatMap(obj => obj.strategic_initiatives || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.milestone_name || !formData.initiative_id) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!organizationClient) throw new Error('Organization client not available');
      
      const { error } = await organizationClient
        .from('strategic_initiative_milestones')
        .insert([{
          milestone_name: formData.milestone_name,
          initiative_id: formData.initiative_id,
          target_date: formData.target_date || null,
          estimated_duration_days: formData.estimated_duration_days,
          status: formData.status,
          is_critical_path: formData.is_critical_path
        }]);

      if (error) throw error;

      toast.success("Milestone created successfully!");

      // Reset form and close dialog
      setFormData({
        milestone_name: '',
        initiative_id: '',
        target_date: '',
        estimated_duration_days: 1,
        status: 'pending',
        is_critical_path: false
      });
      setOpen(false);

      // Refresh the milestones data
      queryClient.invalidateQueries({ queryKey: ['strategic-initiative-milestones'] });

    } catch (error: any) {
      toast.error(error.message || "Failed to create milestone");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Milestone</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="milestone_name">Milestone Name *</Label>
            <Input
              id="milestone_name"
              value={formData.milestone_name}
              onChange={(e) => setFormData(prev => ({ ...prev, milestone_name: e.target.value }))}
              placeholder="Enter milestone name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initiative_id">Initiative *</Label>
            <Select 
              value={formData.initiative_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, initiative_id: value }))}
            >
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
            <Label htmlFor="target_date">Target Date</Label>
            <Input
              id="target_date"
              type="date"
              value={formData.target_date}
              onChange={(e) => setFormData(prev => ({ ...prev, target_date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_duration_days">Estimated Duration (days)</Label>
            <Input
              id="estimated_duration_days"
              type="number"
              min="1"
              value={formData.estimated_duration_days}
              onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration_days: parseInt(e.target.value) || 1 }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
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
              checked={formData.is_critical_path}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_critical_path: checked as boolean }))}
            />
            <Label htmlFor="is_critical_path">Critical Path</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Milestone'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMilestoneDialog;
