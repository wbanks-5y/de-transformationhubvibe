
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CockpitKPI } from "@/types/cockpit";
import { useKPITimeSeriesData } from "@/hooks/use-kpi-time-series-data";
import { useCreateKPITimeBased, useUpdateKPITimeBased, useDeleteKPITimeBased } from "@/hooks/use-kpi-data";
import { Plus, Edit2, Trash2, Calendar, Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface KPITimeSeriesEditorProps {
  kpi: CockpitKPI;
}

const KPITimeSeriesEditor: React.FC<KPITimeSeriesEditorProps> = ({ kpi }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newValue, setNewValue] = useState({
    actual_value: '',
    period_start: '',
    period_end: ''
  });
  const [editValue, setEditValue] = useState({
    actual_value: '',
    period_start: '',
    period_end: ''
  });

  const { data: timeSeriesData, isLoading } = useKPITimeSeriesData(kpi.id);
  const createKPITimeBased = useCreateKPITimeBased();
  const updateKPITimeBased = useUpdateKPITimeBased();
  const deleteKPITimeBased = useDeleteKPITimeBased();

  const handleAddValue = async () => {
    if (!newValue.actual_value || !newValue.period_start || !newValue.period_end) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createKPITimeBased.mutateAsync({
        kpi_id: kpi.id,
        actual_value: parseFloat(newValue.actual_value),
        period_start: newValue.period_start,
        period_end: newValue.period_end,
        period_type: 'month',
        notes: ''
      });

      setIsAddingNew(false);
      setNewValue({ actual_value: '', period_start: '', period_end: '' });
      toast.success('Data point added successfully');
    } catch (error) {
      console.error('Error adding data point:', error);
      toast.error('Failed to add data point');
    }
  };

  const handleEditValue = (dataPoint: any) => {
    setEditingId(dataPoint.id);
    setEditValue({
      actual_value: dataPoint.actual_value.toString(),
      period_start: dataPoint.period_start,
      period_end: dataPoint.period_end
    });
    setIsAddingNew(false); // Close add form if open
  };

  const handleUpdateValue = async () => {
    if (!editValue.actual_value || !editValue.period_start || !editValue.period_end || !editingId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await updateKPITimeBased.mutateAsync({
        id: editingId,
        kpi_id: kpi.id,
        actual_value: parseFloat(editValue.actual_value),
        period_start: editValue.period_start,
        period_end: editValue.period_end,
        period_type: 'month'
      });

      setEditingId(null);
      setEditValue({ actual_value: '', period_start: '', period_end: '' });
      toast.success('Data point updated successfully');
    } catch (error) {
      console.error('Error updating data point:', error);
      toast.error('Failed to update data point');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue({ actual_value: '', period_start: '', period_end: '' });
  };

  const handleDeleteValue = async (id: string) => {
    try {
      await deleteKPITimeBased.mutateAsync({ id, kpi_id: kpi.id });
      toast.success('Data point deleted successfully');
    } catch (error) {
      console.error('Error deleting data point:', error);
      toast.error('Failed to delete data point');
    }
  };

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

  if (kpi.kpi_data_type !== 'time_based') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            This KPI is not configured for time series data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Time Series Data - {kpi.display_name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Monthly</Badge>
            <Button 
              size="sm" 
              onClick={() => setIsAddingNew(true)}
              disabled={isAddingNew || editingId !== null}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Value
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add New Value Form */}
        {isAddingNew && (
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="actual_value">Actual Value *</Label>
                  <Input
                    id="actual_value"
                    type="number"
                    value={newValue.actual_value}
                    onChange={(e) => setNewValue(prev => ({ ...prev, actual_value: e.target.value }))}
                    placeholder="Enter actual value"
                  />
                </div>
                <div>
                  <Label htmlFor="period_start">Period Start *</Label>
                  <Input
                    id="period_start"
                    type="date"
                    value={newValue.period_start}
                    onChange={(e) => setNewValue(prev => ({ ...prev, period_start: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="period_end">Period End *</Label>
                  <Input
                    id="period_end"
                    type="date"
                    value={newValue.period_end}
                    onChange={(e) => setNewValue(prev => ({ ...prev, period_end: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewValue({ actual_value: '', period_start: '', period_end: '' });
                  }}
                  disabled={createKPITimeBased.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddValue}
                  disabled={createKPITimeBased.isPending}
                >
                  {createKPITimeBased.isPending ? 'Adding...' : 'Add Value'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        {timeSeriesData && timeSeriesData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Period</th>
                  <th className="text-right p-3">Actual Value</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeSeriesData.map((point) => (
                  <tr key={point.id} className="border-b hover:bg-gray-50">
                    {editingId === point.id ? (
                      <>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Input
                              type="date"
                              value={editValue.period_start}
                              onChange={(e) => setEditValue(prev => ({ ...prev, period_start: e.target.value }))}
                              className="text-xs"
                            />
                            <span className="self-center text-xs">to</span>
                            <Input
                              type="date"
                              value={editValue.period_end}
                              onChange={(e) => setEditValue(prev => ({ ...prev, period_end: e.target.value }))}
                              className="text-xs"
                            />
                          </div>
                        </td>
                        <td className="text-right p-3">
                          <Input
                            type="number"
                            value={editValue.actual_value}
                            onChange={(e) => setEditValue(prev => ({ ...prev, actual_value: e.target.value }))}
                            className="w-24 ml-auto"
                          />
                        </td>
                        <td className="text-right p-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleUpdateValue}
                              disabled={updateKPITimeBased.isPending}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEdit}
                              disabled={updateKPITimeBased.isPending}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3">
                          {format(new Date(point.period_start), 'MMM dd, yyyy')} - {' '}
                          {format(new Date(point.period_end), 'MMM dd, yyyy')}
                        </td>
                        <td className="text-right p-3 font-medium">
                          {formatValue(point.actual_value)}
                        </td>
                        <td className="text-right p-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditValue(point)}
                              disabled={editingId !== null || isAddingNew}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteValue(point.id)}
                              disabled={deleteKPITimeBased.isPending || editingId !== null || isAddingNew}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No time series data available. Add the first value to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default KPITimeSeriesEditor;
