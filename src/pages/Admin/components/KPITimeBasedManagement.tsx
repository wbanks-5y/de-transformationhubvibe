
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useKPITimeBased, useCreateKPITimeBased, useUpdateKPITimeBased, useDeleteKPITimeBased } from "@/hooks/use-kpi-data";
import { CockpitKPI } from "@/types/cockpit";
import { Plus, Edit, Trash2, Calendar, Check, X } from "lucide-react";
import { format } from "date-fns";
import { calculatePeriodDates, formatPeriodDisplay } from "@/utils/periodDateCalculator";
import { toast } from "sonner";

interface KPITimeBasedManagementProps {
  kpi: CockpitKPI;
}

const KPITimeBasedManagement: React.FC<KPITimeBasedManagementProps> = ({ kpi }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newValue, setNewValue] = useState({
    actual_value: '',
    year: new Date().getFullYear(),
    quarter: 1,
    month: new Date().getMonth() + 1,
    week: 1,
    period_type: 'month',
    notes: ''
  });
  const [editValue, setEditValue] = useState({
    actual_value: '',
    year: new Date().getFullYear(),
    quarter: 1,
    month: new Date().getMonth() + 1,
    week: 1,
    period_type: 'month',
    notes: ''
  });

  const { data: timeBasedData = [], isLoading } = useKPITimeBased(kpi.id);
  const createMutation = useCreateKPITimeBased();
  const updateMutation = useUpdateKPITimeBased();
  const deleteMutation = useDeleteKPITimeBased();

  // Auto-calculate period dates when time fields change
  const [periodDates, setPeriodDates] = useState({ start: '', end: '' });
  const [editPeriodDates, setEditPeriodDates] = useState({ start: '', end: '' });

  useEffect(() => {
    try {
      const dates = calculatePeriodDates(
        newValue.year,
        newValue.period_type as 'year' | 'quarter' | 'month' | 'week',
        newValue.quarter,
        newValue.month,
        newValue.week
      );
      setPeriodDates(dates);
    } catch (error) {
      console.error('Error calculating period dates:', error);
      setPeriodDates({ start: '', end: '' });
    }
  }, [newValue.year, newValue.quarter, newValue.month, newValue.week, newValue.period_type]);

  useEffect(() => {
    if (editingId) {
      try {
        const dates = calculatePeriodDates(
          editValue.year,
          editValue.period_type as 'year' | 'quarter' | 'month' | 'week',
          editValue.quarter,
          editValue.month,
          editValue.week
        );
        setEditPeriodDates(dates);
      } catch (error) {
        console.error('Error calculating edit period dates:', error);
        setEditPeriodDates({ start: '', end: '' });
      }
    }
  }, [editValue.year, editValue.quarter, editValue.month, editValue.week, editValue.period_type, editingId]);

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
    if (!newValue.actual_value || !periodDates.start || !periodDates.end) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createMutation.mutateAsync({
        kpi_id: kpi.id,
        actual_value: parseFloat(newValue.actual_value),
        period_start: periodDates.start,
        period_end: periodDates.end,
        period_type: newValue.period_type,
        notes: newValue.notes || undefined
      });

      toast.success('Data point added successfully');
      setIsAdding(false);
      setNewValue({
        actual_value: '',
        year: new Date().getFullYear(),
        quarter: 1,
        month: new Date().getMonth() + 1,
        week: 1,
        period_type: 'month',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding data point:', error);
      toast.error('Failed to add data point');
    }
  };

  const handleEditValue = (dataPoint: any) => {
    const existingDate = dataPoint.period_start ? new Date(dataPoint.period_start) : new Date();
    
    setEditValue({
      actual_value: dataPoint.actual_value.toString(),
      year: existingDate.getFullYear(),
      quarter: Math.ceil((existingDate.getMonth() + 1) / 3),
      month: existingDate.getMonth() + 1,
      week: 1, // Default week
      period_type: dataPoint.period_type || 'month',
      notes: dataPoint.notes || ''
    });
    setEditingId(dataPoint.id);
    setIsAdding(false); // Close add form if open
  };

  const handleUpdateValue = async () => {
    if (!editValue.actual_value || !editPeriodDates.start || !editPeriodDates.end || !editingId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingId,
        kpi_id: kpi.id,
        actual_value: parseFloat(editValue.actual_value),
        period_start: editPeriodDates.start,
        period_end: editPeriodDates.end,
        period_type: editValue.period_type,
        notes: editValue.notes || undefined
      });

      toast.success('Data point updated successfully');
      setEditingId(null);
      setEditValue({
        actual_value: '',
        year: new Date().getFullYear(),
        quarter: 1,
        month: new Date().getMonth() + 1,
        week: 1,
        period_type: 'month',
        notes: ''
      });
    } catch (error) {
      console.error('Error updating data point:', error);
      toast.error('Failed to update data point');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue({
      actual_value: '',
      year: new Date().getFullYear(),
      quarter: 1,
      month: new Date().getMonth() + 1,
      week: 1,
      period_type: 'month',
      notes: ''
    });
  };

  const handleDeleteValue = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id, kpi_id: kpi.id });
      toast.success('Data point deleted successfully');
    } catch (error) {
      console.error('Error deleting data point:', error);
      toast.error('Failed to delete data point');
    }
  };

  const renderPeriodSelector = (formData: typeof newValue, setFormData: (data: any) => void) => {
    switch (formData.period_type) {
      case 'quarter':
        return (
          <div>
            <Label htmlFor="quarter">Quarter</Label>
            <Select
              value={formData.quarter.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, quarter: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Q1</SelectItem>
                <SelectItem value="2">Q2</SelectItem>
                <SelectItem value="3">Q3</SelectItem>
                <SelectItem value="4">Q4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'month':
        return (
          <div>
            <Label htmlFor="month">Month</Label>
            <Select
              value={formData.month.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, month: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const monthNum = i + 1;
                  const monthName = new Date(2024, i, 1).toLocaleString('default', { month: 'long' });
                  return (
                    <SelectItem key={monthNum} value={monthNum.toString()}>
                      {monthNum} - {monthName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );
      case 'week':
        return (
          <div>
            <Label htmlFor="week">Week</Label>
            <Select
              value={formData.week.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, week: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 53 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Week {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Time Series Data - {kpi.display_name}
          </CardTitle>
          <Button 
            size="sm" 
            onClick={() => setIsAdding(true)}
            disabled={isAdding || editingId !== null}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Data Point
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add New Value Form */}
        {isAdding && (
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
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
                  <Label htmlFor="period_type">Period Type</Label>
                  <Select
                    value={newValue.period_type}
                    onValueChange={(value) => setNewValue(prev => ({ ...prev, period_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year">Year</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newValue.year}
                      onChange={(e) => setNewValue(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                      min="2020"
                      max="2030"
                    />
                  </div>
                  {renderPeriodSelector(newValue, setNewValue)}
                </div>

                {/* Show calculated period dates */}
                {periodDates.start && periodDates.end && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Period:</strong> {formatPeriodDisplay(
                        newValue.year,
                        newValue.period_type as 'year' | 'quarter' | 'month' | 'week',
                        newValue.quarter,
                        newValue.month,
                        newValue.week
                      )}
                    </p>
                    <p className="text-xs text-blue-600">
                      {format(new Date(periodDates.start), 'MMM dd, yyyy')} - {format(new Date(periodDates.end), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={newValue.notes}
                    onChange={(e) => setNewValue(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes about this data point..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAdding(false);
                      setNewValue({
                        actual_value: '',
                        year: new Date().getFullYear(),
                        quarter: 1,
                        month: new Date().getMonth() + 1,
                        week: 1,
                        period_type: 'month',
                        notes: ''
                      });
                    }}
                    disabled={createMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddValue}
                    disabled={createMutation.isPending || !newValue.actual_value}
                  >
                    {createMutation.isPending ? 'Saving...' : 'Save Data Point'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Time Series Data */}
        {timeBasedData && timeBasedData.length > 0 ? (
          <div className="space-y-4">
            {timeBasedData.map((point) => (
              <div key={point.id} className="p-4 border rounded-lg">
                {editingId === point.id ? (
                  /* Edit Form */
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit_actual_value">Actual Value *</Label>
                      <Input
                        id="edit_actual_value"
                        type="number"
                        value={editValue.actual_value}
                        onChange={(e) => setEditValue(prev => ({ ...prev, actual_value: e.target.value }))}
                        placeholder="Enter actual value"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit_period_type">Period Type</Label>
                      <Select
                        value={editValue.period_type}
                        onValueChange={(value) => setEditValue(prev => ({ ...prev, period_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="year">Year</SelectItem>
                          <SelectItem value="quarter">Quarter</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit_year">Year</Label>
                        <Input
                          id="edit_year"
                          type="number"
                          value={editValue.year}
                          onChange={(e) => setEditValue(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                          min="2020"
                          max="2030"
                        />
                      </div>
                      {renderPeriodSelector(editValue, setEditValue)}
                    </div>

                    {/* Show calculated period dates for edit */}
                    {editPeriodDates.start && editPeriodDates.end && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Period:</strong> {formatPeriodDisplay(
                            editValue.year,
                            editValue.period_type as 'year' | 'quarter' | 'month' | 'week',
                            editValue.quarter,
                            editValue.month,
                            editValue.week
                          )}
                        </p>
                        <p className="text-xs text-blue-600">
                          {format(new Date(editPeriodDates.start), 'MMM dd, yyyy')} - {format(new Date(editPeriodDates.end), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="edit_notes">Notes (Optional)</Label>
                      <Textarea
                        id="edit_notes"
                        value={editValue.notes}
                        onChange={(e) => setEditValue(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add any notes about this data point..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleCancelEdit}
                        disabled={updateMutation.isPending}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleUpdateValue}
                        disabled={updateMutation.isPending || !editValue.actual_value}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {updateMutation.isPending ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Value: {formatValue(point.actual_value)}</span>
                        {point.period_type && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {point.period_type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Period: {format(new Date(point.period_start), 'MMM dd, yyyy')} - {format(new Date(point.period_end), 'MMM dd, yyyy')}
                      </p>
                      {point.notes && (
                        <p className="text-sm text-gray-600 mt-1">{point.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditValue(point)}
                        disabled={editingId !== null || isAdding}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteValue(point.id)}
                        disabled={deleteMutation.isPending || editingId !== null || isAdding}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No time series data available. Add the first data point to get started.
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Data Point
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPITimeBasedManagement;
