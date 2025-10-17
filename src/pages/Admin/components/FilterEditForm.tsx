
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateCockpitFilter, useUpdateCockpitFilter } from "@/hooks/use-cockpit-filter-management";

interface FilterEditFormProps {
  filter?: any;
  cockpitTypeId?: string;
  isCreating: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const FilterEditForm: React.FC<FilterEditFormProps> = ({
  filter,
  cockpitTypeId,
  isCreating,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    filter_type: 'time_period',
    filter_config: {
      type: 'relative',
      label: '',
      description: '',
      period: ''
    },
    is_default: false,
    sort_order: 1,
    is_active: true
  });

  const createFilter = useCreateCockpitFilter();
  const updateFilter = useUpdateCockpitFilter();

  useEffect(() => {
    if (filter) {
      setFormData({
        name: filter.name || '',
        filter_type: filter.filter_type || 'time_period',
        filter_config: {
          type: filter.filter_config?.type || 'relative',
          label: filter.filter_config?.label || '',
          description: filter.filter_config?.description || '',
          period: filter.filter_config?.period || ''
        },
        is_default: filter.is_default || false,
        sort_order: filter.sort_order || 1,
        is_active: filter.is_active !== false
      });
    }
  }, [filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isCreating) {
        await createFilter.mutateAsync({
          ...formData,
          cockpit_type_id: cockpitTypeId!,
        });
      } else {
        await updateFilter.mutateAsync({
          id: filter.id,
          updates: formData
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving filter:', error);
    }
  };

  const updateFilterConfig = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      filter_config: {
        ...prev.filter_config,
        [key]: value
      }
    }));
  };

  const periodOptions = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '3m', label: '3 months' },
    { value: '6m', label: '6 months' },
    { value: '1y', label: '1 year' },
    { value: '2y', label: '2 years' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isCreating ? 'Create Time Period Filter' : 'Edit Time Period Filter'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Filter Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., last_30_days"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="label">Display Label</Label>
              <Input
                id="label"
                value={formData.filter_config.label}
                onChange={(e) => updateFilterConfig('label', e.target.value)}
                placeholder="e.g., Last 30 Days"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.filter_config.description}
              onChange={(e) => updateFilterConfig('description', e.target.value)}
              placeholder="e.g., Data from the last 30 days"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Filter Type</Label>
              <Select
                value={formData.filter_config.type}
                onValueChange={(value) => updateFilterConfig('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relative">Relative Period</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.filter_config.type === 'relative' && (
              <div className="space-y-2">
                <Label htmlFor="period">Time Period</Label>
                <Select
                  value={formData.filter_config.period}
                  onValueChange={(value) => updateFilterConfig('period', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))}
                min="1"
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
              />
              <Label htmlFor="is_default">Default Filter</Label>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createFilter.isPending || updateFilter.isPending}
            >
              {isCreating ? 'Create Filter' : 'Update Filter'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FilterEditForm;
