
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import { useStrategicObjectives } from "@/hooks/use-strategic-objectives";
import { useQueryClient } from "@tanstack/react-query";

interface AddInitiativeDialogProps {
  children?: React.ReactNode;
}

const AddInitiativeDialog: React.FC<AddInitiativeDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: objectives = [] } = useStrategicObjectives();
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    objective_id: '',
    status: 'planning',
    priority: 'medium',
    owner: '',
    start_date: '',
    target_date: '',
    estimated_effort_hours: 0,
    budget_allocated: 0,
    risk_level: 'medium',
    success_criteria: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.objective_id) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!organizationClient) throw new Error('Organization client not available');
      
      const { error } = await organizationClient
        .from('strategic_initiatives')
        .insert([{
          name: formData.name,
          description: formData.description,
          objective_id: formData.objective_id,
          status: formData.status,
          priority: formData.priority,
          owner: formData.owner || null,
          start_date: formData.start_date || null,
          target_date: formData.target_date || null,
          estimated_effort_hours: formData.estimated_effort_hours,
          budget_allocated: formData.budget_allocated,
          risk_level: formData.risk_level,
          success_criteria: formData.success_criteria,
          notes: formData.notes
        }]);

      if (error) throw error;

      toast.success("Initiative created successfully!");

      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        objective_id: '',
        status: 'planning',
        priority: 'medium',
        owner: '',
        start_date: '',
        target_date: '',
        estimated_effort_hours: 0,
        budget_allocated: 0,
        risk_level: 'medium',
        success_criteria: '',
        notes: ''
      });
      setOpen(false);

      // Refresh the initiatives data
      queryClient.invalidateQueries({ queryKey: ['strategic-objectives'] });

    } catch (error: any) {
      toast.error(error.message || "Failed to create initiative");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Initiative
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Initiative</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Initiative Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter initiative name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective_id">Strategic Objective *</Label>
              <Select 
                value={formData.objective_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, objective_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  {objectives.map((objective) => (
                    <SelectItem key={objective.id} value={objective.id}>
                      {objective.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the initiative"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk_level">Risk Level</Label>
              <Select 
                value={formData.risk_level} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, risk_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                placeholder="Initiative owner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_effort_hours">Estimated Effort (hours)</Label>
              <Input
                id="estimated_effort_hours"
                type="number"
                min="0"
                value={formData.estimated_effort_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_effort_hours: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              />
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
              <Label htmlFor="budget_allocated">Budget Allocated</Label>
              <Input
                id="budget_allocated"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget_allocated}
                onChange={(e) => setFormData(prev => ({ ...prev, budget_allocated: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="success_criteria">Success Criteria</Label>
            <Textarea
              id="success_criteria"
              value={formData.success_criteria}
              onChange={(e) => setFormData(prev => ({ ...prev, success_criteria: e.target.value }))}
              placeholder="Define what success looks like for this initiative"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or comments"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Initiative'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInitiativeDialog;
