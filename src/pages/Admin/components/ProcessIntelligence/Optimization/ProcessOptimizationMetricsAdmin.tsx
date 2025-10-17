
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOrganization } from "@/context/OrganizationContext";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ProcessOptimizationMetricsAdminProps {
  selectedProcessId: string;
}

interface MetricsFormData {
  potential_savings: string;
  time_reduction: string;
  quality_improvement: string;
}

const ProcessOptimizationMetricsAdmin: React.FC<ProcessOptimizationMetricsAdminProps> = ({ selectedProcessId }) => {
  const { organizationClient } = useOrganization();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<any>(null);
  const [formData, setFormData] = useState<MetricsFormData>({
    potential_savings: "",
    time_reduction: "",
    quality_improvement: ""
  });

  const { data: metrics = [], refetch, isLoading } = useQuery({
    queryKey: ['process-optimization-metrics', selectedProcessId],
    queryFn: async () => {
      if (!selectedProcessId || !organizationClient) return [];
      
      const { data, error } = await organizationClient
        .from('process_optimization_metrics')
        .select('*')
        .eq('process_id', selectedProcessId);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedProcessId && !!organizationClient,
  });

  const resetForm = () => {
    setFormData({
      potential_savings: "",
      time_reduction: "",
      quality_improvement: ""
    });
  };

  const handleCreate = async () => {
    if (!selectedProcessId || !organizationClient) {
      toast.error("Please select a process first");
      return;
    }

    try {
      const { error } = await organizationClient
        .from('process_optimization_metrics')
        .insert([{
          ...formData,
          process_id: selectedProcessId
        }]);

      if (error) throw error;

      toast.success("Optimization metrics created successfully!");
      setCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error creating metrics:", error);
      toast.error("Failed to create optimization metrics");
    }
  };

  const handleEdit = (metricsItem: any) => {
    setSelectedMetrics(metricsItem);
    setFormData({
      potential_savings: metricsItem.potential_savings,
      time_reduction: metricsItem.time_reduction,
      quality_improvement: metricsItem.quality_improvement
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedMetrics || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_optimization_metrics')
        .update(formData)
        .eq('id', selectedMetrics.id);

      if (error) throw error;

      toast.success("Optimization metrics updated successfully!");
      setEditDialogOpen(false);
      setSelectedMetrics(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error updating metrics:", error);
      toast.error("Failed to update optimization metrics");
    }
  };

  const handleDelete = async (metricsItem: any) => {
    if (!confirm("Are you sure you want to delete these optimization metrics?") || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_optimization_metrics')
        .delete()
        .eq('id', metricsItem.id);

      if (error) throw error;

      toast.success("Optimization metrics deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting metrics:", error);
      toast.error("Failed to delete optimization metrics");
    }
  };

  if (!selectedProcessId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please select a process to manage optimization metrics.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Optimization Metrics</h3>
          <p className="text-sm text-gray-500">Manage optimization potential and improvement metrics</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Metrics
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Potential Savings</TableHead>
            <TableHead>Time Reduction</TableHead>
            <TableHead>Quality Improvement</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metricsItem) => (
            <TableRow key={metricsItem.id}>
              <TableCell className="font-medium">{metricsItem.potential_savings}</TableCell>
              <TableCell>{metricsItem.time_reduction}</TableCell>
              <TableCell>{metricsItem.quality_improvement}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(metricsItem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(metricsItem)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Optimization Metrics</DialogTitle>
            <DialogDescription>
              Add optimization metrics for the selected process.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="potential_savings">Potential Savings</Label>
              <Input
                id="potential_savings"
                value={formData.potential_savings}
                onChange={(e) => setFormData({ ...formData, potential_savings: e.target.value })}
                placeholder="e.g., $50,000 annually"
              />
            </div>
            
            <div>
              <Label htmlFor="time_reduction">Time Reduction</Label>
              <Input
                id="time_reduction"
                value={formData.time_reduction}
                onChange={(e) => setFormData({ ...formData, time_reduction: e.target.value })}
                placeholder="e.g., 30% reduction in processing time"
              />
            </div>
            
            <div>
              <Label htmlFor="quality_improvement">Quality Improvement</Label>
              <Input
                id="quality_improvement"
                value={formData.quality_improvement}
                onChange={(e) => setFormData({ ...formData, quality_improvement: e.target.value })}
                placeholder="e.g., 95% accuracy rate"
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
                Create Metrics
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Optimization Metrics</DialogTitle>
            <DialogDescription>
              Update the optimization metrics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_potential_savings">Potential Savings</Label>
              <Input
                id="edit_potential_savings"
                value={formData.potential_savings}
                onChange={(e) => setFormData({ ...formData, potential_savings: e.target.value })}
                placeholder="e.g., $50,000 annually"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_time_reduction">Time Reduction</Label>
              <Input
                id="edit_time_reduction"
                value={formData.time_reduction}
                onChange={(e) => setFormData({ ...formData, time_reduction: e.target.value })}
                placeholder="e.g., 30% reduction in processing time"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_quality_improvement">Quality Improvement</Label>
              <Input
                id="edit_quality_improvement"
                value={formData.quality_improvement}
                onChange={(e) => setFormData({ ...formData, quality_improvement: e.target.value })}
                placeholder="e.g., 95% accuracy rate"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => {
                setEditDialogOpen(false);
                setSelectedMetrics(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Metrics
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessOptimizationMetricsAdmin;
