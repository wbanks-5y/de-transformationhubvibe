
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import { useStrategicObjectives } from "@/hooks/use-strategic-objectives";
import { useQueryClient } from "@tanstack/react-query";

interface AddResourceDialogProps {
  children?: React.ReactNode;
}

const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: objectives = [] } = useStrategicObjectives();
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();

  const [formData, setFormData] = useState({
    initiative_id: '',
    resource_type: '',
    allocated_amount: 0,
    utilized_amount: 0,
    unit: '',
    period_start: '',
    period_end: '',
    period_type: 'monthly'
  });

  // Get initiatives from objectives
  const initiatives = objectives.flatMap(obj => obj.strategic_initiatives || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.initiative_id || !formData.resource_type || !formData.unit) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!organizationClient) throw new Error('Organization client not available');
      
      const { error } = await organizationClient
        .from('strategic_resource_allocations')
        .insert([{
          initiative_id: formData.initiative_id,
          resource_type: formData.resource_type,
          allocated_amount: formData.allocated_amount,
          utilized_amount: formData.utilized_amount,
          unit: formData.unit,
          period_start: formData.period_start || new Date().toISOString().split('T')[0],
          period_end: formData.period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          period_type: formData.period_type
        }]);

      if (error) throw error;

      toast.success("Resource allocation created successfully!");

      // Reset form and close dialog
      setFormData({
        initiative_id: '',
        resource_type: '',
        allocated_amount: 0,
        utilized_amount: 0,
        unit: '',
        period_start: '',
        period_end: '',
        period_type: 'monthly'
      });
      setOpen(false);

      // Refresh the resource allocations data
      queryClient.invalidateQueries({ queryKey: ['strategic-resource-allocations'] });

    } catch (error: any) {
      toast.error(error.message || "Failed to create resource allocation");
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
            Add Resource
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Resource Allocation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="resource_type">Resource Type *</Label>
            <Select 
              value={formData.resource_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, resource_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="people">People</SelectItem>
                <SelectItem value="time">Time</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocated_amount">Allocated Amount *</Label>
            <Input
              id="allocated_amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.allocated_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, allocated_amount: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="utilized_amount">Utilized Amount</Label>
            <Input
              id="utilized_amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.utilized_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, utilized_amount: parseFloat(e.target.value) || 0 }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit *</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              placeholder="e.g., USD, Hours, FTE"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period_start">Period Start</Label>
              <Input
                id="period_start"
                type="date"
                value={formData.period_start}
                onChange={(e) => setFormData(prev => ({ ...prev, period_start: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period_end">Period End</Label>
              <Input
                id="period_end"
                type="date"
                value={formData.period_end}
                onChange={(e) => setFormData(prev => ({ ...prev, period_end: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period_type">Period Type</Label>
            <Select 
              value={formData.period_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, period_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Allocation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResourceDialog;
