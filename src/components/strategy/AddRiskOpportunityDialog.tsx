
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddRiskOpportunityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  item?: any;
  defaultType?: 'risk' | 'opportunity';
}

const AddRiskOpportunityDialog: React.FC<AddRiskOpportunityDialogProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  item,
  defaultType = 'risk'
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: defaultType,
    title: '',
    description: '',
    impact_level: '',
    probability: '',
    status: 'identified',
    owner: '',
    mitigation_actions: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        type: item.type || defaultType,
        title: item.title || '',
        description: item.description || '',
        impact_level: item.impact_level || '',
        probability: item.probability || '',
        status: item.status || 'identified',
        owner: item.owner || '',
        mitigation_actions: item.mitigation_actions || ''
      });
    } else {
      setFormData({
        type: defaultType,
        title: '',
        description: '',
        impact_level: '',
        probability: '',
        status: 'identified',
        owner: '',
        mitigation_actions: ''
      });
    }
  }, [item, defaultType, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (item) {
        // Update existing item
        const { error } = await supabase
          .from('strategic_risks_opportunities')
          .update(formData)
          .eq('id', item.id);

        if (error) throw error;
        toast.success(`${formData.type} updated successfully`);
      } else {
        // Create new item
        const { error } = await supabase
          .from('strategic_risks_opportunities')
          .insert([formData]);

        if (error) throw error;
        toast.success(`${formData.type} created successfully`);
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(`Failed to save ${formData.type}`);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit' : 'Add'} {formData.type === 'risk' ? 'Risk' : 'Opportunity'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="risk">Risk</SelectItem>
                <SelectItem value="opportunity">Opportunity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Enter description"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="probability">Probability</Label>
              <Select value={formData.probability} onValueChange={(value) => updateField('probability', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="impact_level">Impact</Label>
              <Select value={formData.impact_level} onValueChange={(value) => updateField('impact_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => updateField('owner', e.target.value)}
              placeholder="Enter owner"
            />
          </div>

          {formData.type === 'risk' && (
            <div>
              <Label htmlFor="mitigation_actions">Mitigation Actions</Label>
              <Textarea
                id="mitigation_actions"
                value={formData.mitigation_actions}
                onChange={(e) => updateField('mitigation_actions', e.target.value)}
                placeholder="Enter mitigation actions"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (item ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRiskOpportunityDialog;
