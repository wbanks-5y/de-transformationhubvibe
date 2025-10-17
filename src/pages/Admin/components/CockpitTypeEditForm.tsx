
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CockpitType } from "@/types/cockpit";
import { X, Save } from "lucide-react";
import IconSelector from "./IconSelector";
import ColorPicker from "@/components/ui/color-picker";

interface CockpitTypeEditFormProps {
  cockpit?: CockpitType;
  onSave: (data: Partial<CockpitType>) => Promise<void>;
  onCancel: () => void;
  isCreating?: boolean;
}

const CockpitTypeEditForm: React.FC<CockpitTypeEditFormProps> = ({
  cockpit,
  onSave,
  onCancel,
  isCreating = false
}) => {
  const [formData, setFormData] = useState({
    name: cockpit?.name || '',
    display_name: cockpit?.display_name || '',
    description: cockpit?.description || '',
    cockpit_description: cockpit?.cockpit_description || 'provides real-time operational metrics and analytics for day-to-day decision making. Unlike the Health dashboards which focus on strategic indicators and long-term trends, this cockpit gives you immediate visibility into current operations and performance.',
    route_path: cockpit?.route_path || '',
    color_class: cockpit?.color_class || '#4F46E5',
    icon: cockpit?.icon || 'Gauge',
    sort_order: cockpit?.sort_order || 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.name.trim()) {
      newErrors.push('Name is required');
    }
    
    if (!formData.display_name.trim()) {
      newErrors.push('Display name is required');
    }
    
    if (!isCreating && !formData.route_path.trim()) {
      newErrors.push('Route path is required');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('CockpitTypeEditForm: handleSubmit called with data:', formData);
    
    if (!validateForm()) {
      console.log('CockpitTypeEditForm: Validation failed with errors:', errors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors([]);

    try {
      // Generate route_path from name if creating new cockpit
      const routePath = isCreating ? 
        `/cockpit/${formData.name.toLowerCase().replace(/\s+/g, '-')}` : 
        formData.route_path;
      
      const submitData = {
        ...formData,
        route_path: routePath
      };
      
      console.log('CockpitTypeEditForm: Calling onSave with data:', submitData);
      await onSave(submitData);
      console.log('CockpitTypeEditForm: onSave completed successfully');
      
    } catch (error) {
      console.error('CockpitTypeEditForm: Error in handleSubmit:', error);
      
      // Show user-friendly error message
      if (error instanceof Error) {
        setErrors([error.message]);
      } else {
        setErrors(['An unexpected error occurred. Please try again.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user makes changes
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {isCreating ? 'Create New Cockpit' : 'Edit Cockpit'}
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Name (Internal) *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., sales, finance, hr"
                required
                disabled={!isCreating || isSubmitting}
              />
              {!isCreating && (
                <p className="text-xs text-gray-500 mt-1">
                  Name cannot be changed for existing cockpits
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Display Name *
              </label>
              <Input
                value={formData.display_name}
                onChange={(e) => handleChange('display_name', e.target.value)}
                placeholder="e.g., Sales Dashboard, Finance Cockpit"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of what this cockpit shows..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cockpit Description (shown in the cockpit page)
            </label>
            <Textarea
              value={formData.cockpit_description}
              onChange={(e) => handleChange('cockpit_description', e.target.value)}
              placeholder="Detailed description shown in the cockpit explaining its purpose..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Icon
              </label>
              <IconSelector
                selectedIcon={formData.icon}
                onIconSelect={(icon) => handleChange('icon', icon)}
                cockpitName={formData.name || formData.display_name}
              />
            </div>

            <div>
              <ColorPicker
                value={formData.color_class}
                onChange={(color) => handleChange('color_class', color)}
                label="Color"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Sort Order
              </label>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                min="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {isCreating && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Route Path (Auto-generated)
              </label>
              <Input
                value={`/cockpit/${formData.name.toLowerCase().replace(/\s+/g, '-')}`}
                disabled
                className="bg-gray-100"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : (isCreating ? 'Create Cockpit' : 'Save Changes')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CockpitTypeEditForm;
