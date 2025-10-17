
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateCockpitType } from '@/hooks/use-cockpit-management';
import { toast } from 'sonner';
import IconSelector from '../IconSelector';
import { generateCockpitFields } from '@/utils/cockpitFormUtils';

interface CreateCockpitFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const CreateCockpitForm: React.FC<CreateCockpitFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    route_path: '',
    icon: 'BarChart3',
    color_class: 'bg-blue-500',
    sort_order: 0,
    is_active: true
  });

  const createCockpit = useCreateCockpitType();

  // Auto-generate name and route_path when display_name changes
  useEffect(() => {
    if (formData.display_name.trim()) {
      const { internalName, routePath } = generateCockpitFields(formData.display_name);
      setFormData(prev => ({
        ...prev,
        name: internalName,
        route_path: routePath
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        name: '',
        route_path: ''
      }));
    }
  }, [formData.display_name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('CreateCockpitForm: Submitting form data:', formData);
      await createCockpit.mutateAsync(formData);
      console.log('CreateCockpitForm: Cockpit created successfully');
      onSave(formData); // This will just manage UI state now
    } catch (error) {
      console.error('CreateCockpitForm: Error creating cockpit:', error);
      // Error handling is done in the mutation
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Cockpit Type</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="display_name">Display Name *</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              placeholder="e.g., Sales Dashboard, Finance Cockpit"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name (Internal) - Auto-generated</Label>
              <Input
                id="name"
                value={formData.name}
                placeholder="Generated from display name"
                disabled
                className="bg-muted text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be used internally and cannot be changed later
              </p>
            </div>
            
            <div>
              <Label htmlFor="route_path">Route Path - Auto-generated</Label>
              <Input
                id="route_path"
                value={formData.route_path}
                placeholder="Generated from display name"
                disabled
                className="bg-muted text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be the URL path for the cockpit
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the cockpit's purpose"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Icon</Label>
              <IconSelector
                selectedIcon={formData.icon}
                onIconSelect={(icon) => handleInputChange('icon', icon)}
              />
            </div>
            
            <div>
              <Label htmlFor="color_class">Color</Label>
              <Select
                value={formData.color_class}
                onValueChange={(value) => handleInputChange('color_class', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-blue-500">Blue</SelectItem>
                  <SelectItem value="bg-green-500">Green</SelectItem>
                  <SelectItem value="bg-purple-500">Purple</SelectItem>
                  <SelectItem value="bg-orange-500">Orange</SelectItem>
                  <SelectItem value="bg-teal-500">Teal</SelectItem>
                  <SelectItem value="bg-pink-500">Pink</SelectItem>
                  <SelectItem value="bg-indigo-500">Indigo</SelectItem>
                  <SelectItem value="bg-red-500">Red</SelectItem>
                  <SelectItem value="bg-yellow-500">Yellow</SelectItem>
                  <SelectItem value="bg-gray-500">Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCockpit.isPending}>
              {createCockpit.isPending ? 'Creating...' : 'Create Cockpit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCockpitForm;
