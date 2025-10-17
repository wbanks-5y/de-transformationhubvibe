
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOrganization } from "@/context/OrganizationContext";
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ProcessBottlenecksAdminProps {
  selectedProcessId: string;
}

interface BottleneckFormData {
  step_name: string;
  wait_time_hours: number;
  impact_level: string;
  sort_order: number;
}

const ProcessBottlenecksAdmin: React.FC<ProcessBottlenecksAdminProps> = ({ selectedProcessId }) => {
  const { organizationClient } = useOrganization();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBottleneck, setSelectedBottleneck] = useState<any>(null);
  const [formData, setFormData] = useState<BottleneckFormData>({
    step_name: "",
    wait_time_hours: 0,
    impact_level: "Medium",
    sort_order: 0
  });

  const { data: bottlenecks = [], refetch, isLoading } = useQuery({
    queryKey: ['process-bottlenecks', selectedProcessId],
    queryFn: async () => {
      if (!selectedProcessId || !organizationClient) return [];
      
      const { data, error } = await organizationClient
        .from('process_bottlenecks')
        .select('*')
        .eq('process_id', selectedProcessId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedProcessId && !!organizationClient,
  });

  const resetForm = () => {
    setFormData({
      step_name: "",
      wait_time_hours: 0,
      impact_level: "Medium",
      sort_order: 0
    });
  };

  const handleCreate = async () => {
    if (!selectedProcessId || !organizationClient) {
      toast.error("Please select a process first");
      return;
    }

    try {
      const { error } = await organizationClient
        .from('process_bottlenecks')
        .insert([{
          ...formData,
          process_id: selectedProcessId
        }]);

      if (error) throw error;

      toast.success("Bottleneck created successfully!");
      setCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error creating bottleneck:", error);
      toast.error("Failed to create bottleneck");
    }
  };

  const handleEdit = (bottleneck: any) => {
    setSelectedBottleneck(bottleneck);
    setFormData({
      step_name: bottleneck.step_name,
      wait_time_hours: bottleneck.wait_time_hours,
      impact_level: bottleneck.impact_level,
      sort_order: bottleneck.sort_order
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedBottleneck || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_bottlenecks')
        .update(formData)
        .eq('id', selectedBottleneck.id);

      if (error) throw error;

      toast.success("Bottleneck updated successfully!");
      setEditDialogOpen(false);
      setSelectedBottleneck(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error updating bottleneck:", error);
      toast.error("Failed to update bottleneck");
    }
  };

  const handleDelete = async (bottleneck: any) => {
    if (!confirm(`Are you sure you want to delete "${bottleneck.step_name}"?`) || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_bottlenecks')
        .delete()
        .eq('id', bottleneck.id);

      if (error) throw error;

      toast.success("Bottleneck deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting bottleneck:", error);
      toast.error("Failed to delete bottleneck");
    }
  };

  const toggleActive = async (bottleneck: any) => {
    if (!organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_bottlenecks')
        .update({ is_active: !bottleneck.is_active })
        .eq('id', bottleneck.id);

      if (error) throw error;

      toast.success(`Bottleneck ${bottleneck.is_active ? 'deactivated' : 'activated'} successfully!`);
      refetch();
    } catch (error) {
      console.error("Error toggling bottleneck status:", error);
      toast.error("Failed to update bottleneck status");
    }
  };

  if (!selectedProcessId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please select a process to manage bottlenecks.</p>
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
          <h3 className="text-lg font-semibold">Process Bottlenecks</h3>
          <p className="text-sm text-gray-500">Manage bottleneck identification and analysis</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Bottleneck
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Step Name</TableHead>
            <TableHead>Wait Time (Hours)</TableHead>
            <TableHead>Impact Level</TableHead>
            <TableHead>Sort Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bottlenecks.map((bottleneck) => (
            <TableRow key={bottleneck.id}>
              <TableCell className="font-medium">{bottleneck.step_name}</TableCell>
              <TableCell>{bottleneck.wait_time_hours}</TableCell>
              <TableCell>
                <Badge variant={bottleneck.impact_level === 'High' ? "destructive" : bottleneck.impact_level === 'Medium' ? "default" : "secondary"}>
                  {bottleneck.impact_level}
                </Badge>
              </TableCell>
              <TableCell>{bottleneck.sort_order}</TableCell>
              <TableCell>
                <Badge variant={bottleneck.is_active ? "default" : "secondary"}>
                  {bottleneck.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(bottleneck)}
                  >
                    {bottleneck.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(bottleneck)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(bottleneck)}
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
            <DialogTitle>Create Bottleneck</DialogTitle>
            <DialogDescription>
              Add a bottleneck analysis for a process step.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="step_name">Step Name</Label>
              <Input
                id="step_name"
                value={formData.step_name}
                onChange={(e) => setFormData({ ...formData, step_name: e.target.value })}
                placeholder="e.g., Approval Process"
              />
            </div>
            
            <div>
              <Label htmlFor="wait_time_hours">Wait Time (Hours)</Label>
              <Input
                id="wait_time_hours"
                type="number"
                min="0"
                value={formData.wait_time_hours}
                onChange={(e) => setFormData({ ...formData, wait_time_hours: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <Label htmlFor="impact_level">Impact Level</Label>
              <select
                id="impact_level"
                value={formData.impact_level}
                onChange={(e) => setFormData({ ...formData, impact_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
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
                Create Bottleneck
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bottleneck</DialogTitle>
            <DialogDescription>
              Update the bottleneck information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_step_name">Step Name</Label>
              <Input
                id="edit_step_name"
                value={formData.step_name}
                onChange={(e) => setFormData({ ...formData, step_name: e.target.value })}
                placeholder="e.g., Approval Process"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_wait_time_hours">Wait Time (Hours)</Label>
              <Input
                id="edit_wait_time_hours"
                type="number"
                min="0"
                value={formData.wait_time_hours}
                onChange={(e) => setFormData({ ...formData, wait_time_hours: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit_impact_level">Impact Level</Label>
              <select
                id="edit_impact_level"
                value={formData.impact_level}
                onChange={(e) => setFormData({ ...formData, impact_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="edit_sort_order">Sort Order</Label>
              <Input
                id="edit_sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => {
                setEditDialogOpen(false);
                setSelectedBottleneck(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Bottleneck
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessBottlenecksAdmin;
