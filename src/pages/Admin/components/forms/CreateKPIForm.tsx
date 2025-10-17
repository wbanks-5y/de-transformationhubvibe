
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";

interface CreateKPIFormProps {
  cockpitTypeId: string;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CreateKPIForm: React.FC<CreateKPIFormProps> = ({ cockpitTypeId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    kpi_data_type: 'single',
    format_type: 'number',
    trend_direction: 'higher_is_better',
    size_config: 'medium',
    icon: 'TrendingUp',
    color_class: 'text-blue-600',
    sort_order: 0,
    is_active: true,
    weight: 1.0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave({
        ...formData,
        cockpit_type_id: cockpitTypeId
      });
      onCancel();
    } catch (error) {
      console.error('Error creating KPI:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New KPI</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name (ID)</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., revenue_growth"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <Input
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="e.g., Revenue Growth"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this KPI"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Data Type</label>
              <Select value={formData.kpi_data_type} onValueChange={(value) => setFormData({ ...formData, kpi_data_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Value</SelectItem>
                  <SelectItem value="time_based">Time Based</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.kpi_data_type === 'single' 
                  ? 'One current value that gets updated manually'
                  : 'Time series data with multiple historical values'
                }
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Format Type</label>
              <Select value={formData.format_type} onValueChange={(value) => setFormData({ ...formData, format_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trend Direction</label>
              <Select value={formData.trend_direction} onValueChange={(value) => setFormData({ ...formData, trend_direction: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="higher_is_better">Higher is Better</SelectItem>
                  <SelectItem value="lower_is_better">Lower is Better</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <Select value={formData.size_config} onValueChange={(value) => setFormData({ ...formData, size_config: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort Order</label>
              <NumberInput
                value={formData.sort_order || null}
                onChange={(value) => setFormData({ ...formData, sort_order: value || 0 })}
                min={0}
                allowDecimals={false}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Create KPI</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateKPIForm;
