
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useKPIValue } from "@/hooks/use-kpi-data";
import { useCreateKPIValue, useUpdateKPIValue } from "@/hooks/use-kpi-value-management";
import { CockpitKPI } from "@/types/cockpit";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface KPIValuesManagementProps {
  kpi: CockpitKPI;
}

const KPIValuesManagement: React.FC<KPIValuesManagementProps> = ({ kpi }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState({
    current_value: '',
    notes: ''
  });

  const { data: currentValue, isLoading } = useKPIValue(kpi.id);
  const createMutation = useCreateKPIValue();
  const updateMutation = useUpdateKPIValue();

  const formatValue = (value: number) => {
    switch (kpi.format_type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  const handleAddValue = async () => {
    if (!newValue.current_value) {
      toast.error('Please enter a value');
      return;
    }

    try {
      const valueData = {
        kpi_id: kpi.id,
        current_value: parseFloat(newValue.current_value),
        notes: newValue.notes || undefined,
        recorded_at: new Date().toISOString()
      };

      await createMutation.mutateAsync(valueData);
      
      setIsAdding(false);
      setNewValue({ current_value: '', notes: '' });
      toast.success('KPI value added successfully');
    } catch (error) {
      console.error('Error adding KPI value:', error);
      toast.error('Failed to add KPI value');
    }
  };

  const handleUpdateValue = async () => {
    if (!currentValue || !newValue.current_value) {
      toast.error('Please enter a value');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: currentValue.id,
        updates: {
          current_value: parseFloat(newValue.current_value),
          notes: newValue.notes || undefined,
          recorded_at: new Date().toISOString()
        }
      });

      setIsEditing(false);
      setNewValue({ current_value: '', notes: '' });
      toast.success('KPI value updated successfully');
    } catch (error) {
      console.error('Error updating KPI value:', error);
      toast.error('Failed to update KPI value');
    }
  };

  const startEditing = () => {
    if (currentValue) {
      setNewValue({
        current_value: currentValue.current_value.toString(),
        notes: currentValue.notes || ''
      });
      setIsEditing(true);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setIsAdding(false);
    setNewValue({ current_value: '', notes: '' });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Current Value - {kpi.display_name}</CardTitle>
          <Button 
            size="sm" 
            onClick={() => setIsAdding(true)}
            disabled={isAdding || isEditing}
          >
            <Plus className="h-4 w-4 mr-1" />
            Update Value
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Value Display */}
        {currentValue && !isEditing && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Current Value</p>
                <p className="text-2xl font-bold">{formatValue(currentValue.current_value)}</p>
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(currentValue.recorded_at).toLocaleDateString()}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={startEditing}
                disabled={isAdding}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
            {currentValue.notes && (
              <p className="text-sm text-gray-600 mt-2">{currentValue.notes}</p>
            )}
          </div>
        )}

        {/* Add/Edit Value Form */}
        {(isAdding || isEditing) && (
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current_value">Value *</Label>
                  <Input
                    id="current_value"
                    type="number"
                    value={newValue.current_value}
                    onChange={(e) => setNewValue(prev => ({ ...prev, current_value: e.target.value }))}
                    placeholder="Enter value"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={newValue.notes}
                    onChange={(e) => setNewValue(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes about this value..."
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={cancelEdit}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={isEditing ? handleUpdateValue : handleAddValue}
                    disabled={isSubmitting || !newValue.current_value}
                  >
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Value' : 'Save Value')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!currentValue && !isLoading && !isAdding && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No current value set for this KPI.
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Value
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPIValuesManagement;
