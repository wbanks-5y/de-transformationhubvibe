
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import { normalizeStatus, normalizeImpactLevel, normalizeProbability } from "@/lib/normalizers/risks";
import { z } from "zod";

const riskOpportunitySchema = z.object({
  type: z.enum(['risk', 'opportunity']),
  title: z.string().trim().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().trim().min(1, "Description is required"),
  impact_level: z.enum(['low', 'medium', 'high', 'critical'], {
    required_error: "Impact level is required"
  }),
  probability: z.enum(['low', 'medium', 'high'], {
    required_error: "Probability is required"
  }),
  status: z.enum(['identified', 'assessed', 'mitigated', 'closed']),
  owner: z.string().trim().max(100, "Owner name too long"),
  mitigation_actions: z.string().trim()
});

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
  const { organizationClient } = useOrganization();
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

  // Normalize legacy status values to current valid enum values
  const normalizeStatusValue = (status: string | undefined): string => {
    if (!status) return 'identified';
    
    const statusMap: Record<string, string> = {
      'identified': 'identified',
      'assessed': 'assessed',
      'assessing': 'assessed',     // Legacy 5-value → 4-value
      'mitigated': 'mitigated',
      'mitigating': 'mitigated',   // Legacy 5-value → 4-value
      'monitoring': 'mitigated',   // Legacy 5-value → 4-value (closest match)
      'closed': 'closed'
    };
    
    return statusMap[status.toLowerCase()] || 'identified';
  };

  useEffect(() => {
    if (item) {
      setFormData({
        type: item.type || defaultType,
        title: item.title || '',
        description: item.description || '',
        impact_level: item.impact_level || '',
        probability: item.probability || '',
        status: normalizeStatusValue(item.status),
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
      if (!organizationClient) throw new Error('Organization client not available');
      
      // Validate form data
      const validatedData = riskOpportunitySchema.parse(formData);
      
      // Normalize values for database
      const submitData: any = {
        type: validatedData.type,
        title: validatedData.title,
        description: validatedData.description,
        status: normalizeStatus(validatedData.status),
        impact_level: normalizeImpactLevel(validatedData.impact_level),
        probability: normalizeProbability(validatedData.probability),
        owner: validatedData.owner || null,
        mitigation_actions: validatedData.mitigation_actions || null
      };
      
      // Force lowercase at the final step to avoid any case mismatch
      submitData.status = String(submitData.status).trim().toLowerCase();
      submitData.impact_level = String(submitData.impact_level).trim().toLowerCase();
      submitData.probability = String(submitData.probability).trim().toLowerCase();

      console.log('📤 Final submit (forced lower):', {
        status: `[${submitData.status}]`, statusLen: submitData.status.length,
        impact_level: `[${submitData.impact_level}]`, impactLen: submitData.impact_level.length,
        probability: `[${submitData.probability}]`, probLen: submitData.probability.length,
        raw: submitData
      });
      
      if (item) {
        // Update existing item
        const { error } = await organizationClient
          .from('strategic_risks_opportunities')
          .update(submitData)
          .eq('id', item.id);

        if (error) throw error;
        toast.success(`${formData.type} updated successfully`);
      } else {
        // Create new item
        const { error } = await organizationClient
          .from('strategic_risks_opportunities')
          .insert([submitData]);

        if (error) throw error;
        toast.success(`${formData.type} created successfully`);
      }

      onSave();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving item:', error);
      if (error.name === 'ZodError') {
        toast.error('Please check all required fields');
      } else {
        toast.error(`Failed to save ${formData.type}: ${error.message || 'Unknown error'}`);
      }
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="identified">Identified</SelectItem>
                  <SelectItem value="assessed">Assessed</SelectItem>
                  <SelectItem value="mitigated">Mitigated</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
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
