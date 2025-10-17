import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBusinessProcesses } from "@/hooks/useBusinessProcesses";
import { useOrganization } from "@/context/OrganizationContext";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ProcessStatisticsAdminProps {
  selectedProcessId?: string;
}

interface StatisticsFormData {
  process_id: string;
  avg_duration: string;
  frequency: string;
  automation_rate: number;
  error_rate: number;
}

const ProcessStatisticsAdmin: React.FC<ProcessStatisticsAdminProps> = ({ selectedProcessId }) => {
  const { organizationClient } = useOrganization();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStatistic, setSelectedStatistic] = useState<any>(null);
  const [formData, setFormData] = useState<StatisticsFormData>({
    process_id: selectedProcessId || "",
    avg_duration: "",
    frequency: "",
    automation_rate: 0,
    error_rate: 0
  });

  const { data: processes = [] } = useBusinessProcesses();

  const { data: statisticsData = [], refetch, isLoading } = useQuery({
    queryKey: ['process-statistics', selectedProcessId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }

      console.log('Fetching statistics for processId:', selectedProcessId);
      let query = organizationClient
        .from('process_statistics')
        .select(`
          *,
          business_processes (
            display_name
          )
        `);

      if (selectedProcessId) {
        query = query.eq('process_id', selectedProcessId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching statistics:', error);
        throw error;
      }
      
      console.log('Statistics data received:', data);
      return data || [];
    },
    enabled: !!organizationClient,
  });

  // Ensure statistics is always an array
  const statistics = Array.isArray(statisticsData) ? statisticsData : [];
  console.log('Final statistics array:', statistics);

  // Update formData when selectedProcessId changes
  React.useEffect(() => {
    if (selectedProcessId) {
      setFormData(prev => ({ ...prev, process_id: selectedProcessId }));
    }
  }, [selectedProcessId]);

  const resetForm = () => {
    setFormData({
      process_id: selectedProcessId || "",
      avg_duration: "",
      frequency: "",
      automation_rate: 0,
      error_rate: 0
    });
  };

  const handleCreate = async () => {
    if (!organizationClient) {
      toast.error("No organization client available");
      return;
    }

    try {
      const { error } = await organizationClient
        .from('process_statistics')
        .insert([formData]);

      if (error) throw error;

      toast.success("Process statistics created successfully!");
      setCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error creating statistics:", error);
      toast.error("Failed to create statistics");
    }
  };

  const handleEdit = (statistic: any) => {
    setSelectedStatistic(statistic);
    setFormData({
      process_id: statistic.process_id,
      avg_duration: statistic.avg_duration,
      frequency: statistic.frequency,
      automation_rate: statistic.automation_rate,
      error_rate: statistic.error_rate
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedStatistic || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_statistics')
        .update(formData)
        .eq('id', selectedStatistic.id);

      if (error) throw error;

      toast.success("Process statistics updated successfully!");
      setEditDialogOpen(false);
      setSelectedStatistic(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error updating statistics:", error);
      toast.error("Failed to update statistics");
    }
  };

  const handleDelete = async (statistic: any) => {
    if (!confirm(`Are you sure you want to delete statistics for "${statistic.business_processes?.display_name}"?`) || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_statistics')
        .delete()
        .eq('id', statistic.id);

      if (error) throw error;

      toast.success("Process statistics deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting statistics:", error);
      toast.error("Failed to delete statistics");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const showProcessColumn = !selectedProcessId;

  return (
    <div className="space-y-6">
      {!selectedProcessId ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Process Statistics</CardTitle>
                <CardDescription>
                  Manage statistical data for business processes
                </CardDescription>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Statistics
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {showProcessColumn && <TableHead>Process</TableHead>}
                  <TableHead>Avg Duration</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Automation Rate</TableHead>
                  <TableHead>Error Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statistics.map((statistic) => (
                  <TableRow key={statistic.id}>
                    {showProcessColumn && (
                      <TableCell className="font-medium">
                        {statistic.business_processes?.display_name}
                      </TableCell>
                    )}
                    <TableCell>{statistic.avg_duration}</TableCell>
                    <TableCell>{statistic.frequency}</TableCell>
                    <TableCell>{statistic.automation_rate}%</TableCell>
                    <TableCell>{statistic.error_rate}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(statistic)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(statistic)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Process Statistics</h3>
              <p className="text-sm text-gray-500">Manage statistics for the selected process</p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Statistics
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avg Duration</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Automation Rate</TableHead>
                <TableHead>Error Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics.map((statistic) => (
                <TableRow key={statistic.id}>
                  <TableCell>{statistic.avg_duration}</TableCell>
                  <TableCell>{statistic.frequency}</TableCell>
                  <TableCell>{statistic.automation_rate}%</TableCell>
                  <TableCell>{statistic.error_rate}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(statistic)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(statistic)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Process Statistics</DialogTitle>
            <DialogDescription>
              Add statistical data for a business process.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!selectedProcessId && (
              <div>
                <Label htmlFor="process_id">Process</Label>
                <Select value={formData.process_id} onValueChange={(value) => setFormData({ ...formData, process_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a process" />
                  </SelectTrigger>
                  <SelectContent>
                    {processes.map((process) => (
                      <SelectItem key={process.id} value={process.id}>
                        {process.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label htmlFor="avg_duration">Average Duration</Label>
              <Input
                id="avg_duration"
                value={formData.avg_duration}
                onChange={(e) => setFormData({ ...formData, avg_duration: e.target.value })}
                placeholder="e.g., 3 days"
              />
            </div>
            
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="e.g., 50 times/month"
              />
            </div>
            
            <div>
              <Label htmlFor="automation_rate">Automation Rate (%)</Label>
              <Input
                id="automation_rate"
                type="number"
                min="0"
                max="100"
                value={formData.automation_rate}
                onChange={(e) => setFormData({ ...formData, automation_rate: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <Label htmlFor="error_rate">Error Rate (%)</Label>
              <Input
                id="error_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.error_rate}
                onChange={(e) => setFormData({ ...formData, error_rate: parseFloat(e.target.value) || 0 })}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                Create Statistics
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Process Statistics</DialogTitle>
            <DialogDescription>
              Update the statistical data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!selectedProcessId && (
              <div>
                <Label htmlFor="edit_process_id">Process</Label>
                <Select value={formData.process_id} onValueChange={(value) => setFormData({ ...formData, process_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a process" />
                  </SelectTrigger>
                  <SelectContent>
                    {processes.map((process) => (
                      <SelectItem key={process.id} value={process.id}>
                        {process.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label htmlFor="edit_avg_duration">Average Duration</Label>
              <Input
                id="edit_avg_duration"
                value={formData.avg_duration}
                onChange={(e) => setFormData({ ...formData, avg_duration: e.target.value })}
                placeholder="e.g., 3 days"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_frequency">Frequency</Label>
              <Input
                id="edit_frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="e.g., 50 times/month"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_automation_rate">Automation Rate (%)</Label>
              <Input
                id="edit_automation_rate"
                type="number"
                min="0"
                max="100"
                value={formData.automation_rate}
                onChange={(e) => setFormData({ ...formData, automation_rate: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit_error_rate">Error Rate (%)</Label>
              <Input
                id="edit_error_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.error_rate}
                onChange={(e) => setFormData({ ...formData, error_rate: parseFloat(e.target.value) || 0 })}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => {
                setEditDialogOpen(false);
                setSelectedStatistic(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Statistics
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessStatisticsAdmin;
