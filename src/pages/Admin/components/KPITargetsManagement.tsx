
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useKPITargets, useCreateKPITarget, useUpdateKPITarget, useDeleteKPITarget } from "@/hooks/use-kpi-data";
import { CockpitKPI, CockpitKPITarget } from "@/types/cockpit";
import { Plus, Edit, Trash2, Target, Check, X } from "lucide-react";
import { format } from "date-fns";
import { calculatePeriodDates, formatPeriodDisplay } from "@/utils/periodDateCalculator";
import { toast } from "sonner";

interface KPITargetsManagementProps {
  kpi: CockpitKPI;
}

const KPITargetsManagement: React.FC<KPITargetsManagementProps> = ({ kpi }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [newTarget, setNewTarget] = useState({
    target_type: kpi.kpi_data_type === 'single' ? 'single' : 'time_based',
    target_value: '',
    year: new Date().getFullYear(),
    quarter: 1,
    month: new Date().getMonth() + 1,
    week: 1,
    period_type: 'month',
    notes: ''
  });
  const [editTarget, setEditTarget] = useState({
    target_type: kpi.kpi_data_type === 'single' ? 'single' : 'time_based',
    target_value: '',
    year: new Date().getFullYear(),
    quarter: 1,
    month: new Date().getMonth() + 1,
    week: 1,
    period_type: 'month',
    notes: ''
  });

  const { data: targets = [], isLoading } = useKPITargets(kpi.id);
  const createMutation = useCreateKPITarget();
  const updateMutation = useUpdateKPITarget();
  const deleteMutation = useDeleteKPITarget();

  // Auto-calculate period dates when time fields change (for new targets)
  const [periodDates, setPeriodDates] = useState({ start: '', end: '' });
  // Auto-calculate period dates when edit time fields change
  const [editPeriodDates, setEditPeriodDates] = useState({ start: '', end: '' });

  useEffect(() => {
    if (kpi.kpi_data_type === 'time_based') {
      try {
        const dates = calculatePeriodDates(
          newTarget.year,
          newTarget.period_type as 'year' | 'quarter' | 'month' | 'week',
          newTarget.quarter,
          newTarget.month,
          newTarget.week
        );
        setPeriodDates(dates);
      } catch (error) {
        console.error('Error calculating period dates:', error);
        setPeriodDates({ start: '', end: '' });
      }
    }
  }, [newTarget.year, newTarget.quarter, newTarget.month, newTarget.week, newTarget.period_type, kpi.kpi_data_type]);

  useEffect(() => {
    if (kpi.kpi_data_type === 'time_based' && editingTargetId) {
      try {
        const dates = calculatePeriodDates(
          editTarget.year,
          editTarget.period_type as 'year' | 'quarter' | 'month' | 'week',
          editTarget.quarter,
          editTarget.month,
          editTarget.week
        );
        setEditPeriodDates(dates);
      } catch (error) {
        console.error('Error calculating edit period dates:', error);
        setEditPeriodDates({ start: '', end: '' });
      }
    }
  }, [editTarget.year, editTarget.quarter, editTarget.month, editTarget.week, editTarget.period_type, kpi.kpi_data_type, editingTargetId]);

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

  const handleAddTarget = async () => {
    if (!newTarget.target_value) {
      toast.error('Please enter a target value');
      return;
    }

    try {
      const targetData: any = {
        kpi_id: kpi.id,
        target_value: parseFloat(newTarget.target_value),
        target_type: newTarget.target_type,
        notes: newTarget.notes || undefined
      };

      // Add period dates for time-based KPIs
      if (kpi.kpi_data_type === 'time_based' && periodDates.start && periodDates.end) {
        targetData.period_start = periodDates.start;
        targetData.period_end = periodDates.end;
        targetData.period_type = newTarget.period_type;
      }

      await createMutation.mutateAsync(targetData);

      toast.success('Target added successfully');
      setIsAdding(false);
      setNewTarget({
        target_type: kpi.kpi_data_type === 'single' ? 'single' : 'time_based',
        target_value: '',
        year: new Date().getFullYear(),
        quarter: 1,
        month: new Date().getMonth() + 1,
        week: 1,
        period_type: 'month',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding target:', error);
      toast.error('Failed to add target');
    }
  };

  const handleEditTarget = (target: CockpitKPITarget) => {
    const existingDate = target.period_start ? new Date(target.period_start) : new Date();
    
    setEditTarget({
      target_type: target.target_type || 'single',
      target_value: target.target_value.toString(),
      year: existingDate.getFullYear(),
      quarter: Math.ceil((existingDate.getMonth() + 1) / 3),
      month: existingDate.getMonth() + 1,
      week: 1, // Default week
      period_type: target.period_type || 'month',
      notes: target.notes || ''
    });
    setEditingTargetId(target.id);
    setIsAdding(false); // Close add form if open
  };

  const handleUpdateTarget = async () => {
    if (!editTarget.target_value || !editingTargetId) {
      toast.error('Please enter a target value');
      return;
    }

    try {
      const updateData: any = {
        id: editingTargetId,
        kpi_id: kpi.id,
        target_value: parseFloat(editTarget.target_value),
        target_type: editTarget.target_type,
        notes: editTarget.notes || undefined
      };

      // Add period dates for time-based KPIs
      if (kpi.kpi_data_type === 'time_based' && editPeriodDates.start && editPeriodDates.end) {
        updateData.period_start = editPeriodDates.start;
        updateData.period_end = editPeriodDates.end;
        updateData.period_type = editTarget.period_type;
      }

      await updateMutation.mutateAsync(updateData);

      toast.success('Target updated successfully');
      setEditingTargetId(null);
      setEditTarget({
        target_type: kpi.kpi_data_type === 'single' ? 'single' : 'time_based',
        target_value: '',
        year: new Date().getFullYear(),
        quarter: 1,
        month: new Date().getMonth() + 1,
        week: 1,
        period_type: 'month',
        notes: ''
      });
    } catch (error) {
      console.error('Error updating target:', error);
      toast.error('Failed to update target');
    }
  };

  const handleCancelEdit = () => {
    setEditingTargetId(null);
    setEditTarget({
      target_type: kpi.kpi_data_type === 'single' ? 'single' : 'time_based',
      target_value: '',
      year: new Date().getFullYear(),
      quarter: 1,
      month: new Date().getMonth() + 1,
      week: 1,
      period_type: 'month',
      notes: ''
    });
  };

  const handleDeleteTarget = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id, kpi_id: kpi.id });
      toast.success('Target deleted successfully');
    } catch (error) {
      console.error('Error deleting target:', error);
      toast.error('Failed to delete target');
    }
  };

  const renderPeriodSelector = (formData: typeof newTarget, setFormData: (data: any) => void) => {
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
            <Target className="h-5 w-5" />
            Targets - {kpi.display_name}
          </CardTitle>
          <Button 
            size="sm" 
            onClick={() => setIsAdding(true)}
            disabled={isAdding || editingTargetId !== null}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Target
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add New Target Form */}
        {isAdding && (
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="target_value">Target Value *</Label>
                  <Input
                    id="target_value"
                    type="number"
                    value={newTarget.target_value}
                    onChange={(e) => setNewTarget(prev => ({ ...prev, target_value: e.target.value }))}
                    placeholder="Enter target value"
                  />
                </div>

                {kpi.kpi_data_type === 'time_based' && (
                  <>
                    <div>
                      <Label htmlFor="period_type">Period Type</Label>
                      <Select
                        value={newTarget.period_type}
                        onValueChange={(value) => setNewTarget(prev => ({ ...prev, period_type: value }))}
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
                          value={newTarget.year}
                          onChange={(e) => setNewTarget(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                          min="2020"
                          max="2030"
                        />
                      </div>
                      {renderPeriodSelector(newTarget, setNewTarget)}
                    </div>

                    {/* Show calculated period dates */}
                    {periodDates.start && periodDates.end && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Period:</strong> {formatPeriodDisplay(
                            newTarget.year,
                            newTarget.period_type as 'year' | 'quarter' | 'month' | 'week',
                            newTarget.quarter,
                            newTarget.month,
                            newTarget.week
                          )}
                        </p>
                        <p className="text-xs text-blue-600">
                          {format(new Date(periodDates.start), 'MMM dd, yyyy')} - {format(new Date(periodDates.end), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={newTarget.notes}
                    onChange={(e) => setNewTarget(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes about this target..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAdding(false);
                      setNewTarget({
                        target_type: kpi.kpi_data_type === 'single' ? 'single' : 'time_based',
                        target_value: '',
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
                    onClick={handleAddTarget}
                    disabled={createMutation.isPending || !newTarget.target_value}
                  >
                    {createMutation.isPending ? 'Saving...' : 'Save Target'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Targets */}
        {targets && targets.length > 0 ? (
          <div className="space-y-4">
            {targets.map((target) => (
              <div key={target.id} className="p-4 border rounded-lg">
                {editingTargetId === target.id ? (
                  /* Edit Form */
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit_target_value">Target Value *</Label>
                      <Input
                        id="edit_target_value"
                        type="number"
                        value={editTarget.target_value}
                        onChange={(e) => setEditTarget(prev => ({ ...prev, target_value: e.target.value }))}
                        placeholder="Enter target value"
                      />
                    </div>

                    {kpi.kpi_data_type === 'time_based' && (
                      <>
                        <div>
                          <Label htmlFor="edit_period_type">Period Type</Label>
                          <Select
                            value={editTarget.period_type}
                            onValueChange={(value) => setEditTarget(prev => ({ ...prev, period_type: value }))}
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
                              value={editTarget.year}
                              onChange={(e) => setEditTarget(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                              min="2020"
                              max="2030"
                            />
                          </div>
                          {renderPeriodSelector(editTarget, setEditTarget)}
                        </div>

                        {/* Show calculated period dates for edit */}
                        {editPeriodDates.start && editPeriodDates.end && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              <strong>Period:</strong> {formatPeriodDisplay(
                                editTarget.year,
                                editTarget.period_type as 'year' | 'quarter' | 'month' | 'week',
                                editTarget.quarter,
                                editTarget.month,
                                editTarget.week
                              )}
                            </p>
                            <p className="text-xs text-blue-600">
                              {format(new Date(editPeriodDates.start), 'MMM dd, yyyy')} - {format(new Date(editPeriodDates.end), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    <div>
                      <Label htmlFor="edit_notes">Notes (Optional)</Label>
                      <Textarea
                        id="edit_notes"
                        value={editTarget.notes}
                        onChange={(e) => setEditTarget(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add any notes about this target..."
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
                        onClick={handleUpdateTarget}
                        disabled={updateMutation.isPending || !editTarget.target_value}
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
                        <span className="font-medium">Target: {formatValue(target.target_value)}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {target.target_type}
                        </span>
                      </div>
                      {target.period_start && target.period_end && (
                        <p className="text-sm text-gray-600">
                          Period: {new Date(target.period_start).toLocaleDateString()} - {new Date(target.period_end).toLocaleDateString()}
                        </p>
                      )}
                      {target.notes && (
                        <p className="text-sm text-gray-600 mt-1">{target.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditTarget(target)}
                        disabled={editingTargetId !== null || isAdding}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteTarget(target.id)}
                        disabled={deleteMutation.isPending || editingTargetId !== null || isAdding}
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
              No targets defined for this KPI.
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Target
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPITargetsManagement;
