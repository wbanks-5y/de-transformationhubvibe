
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOrganization } from "@/context/OrganizationContext";
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ProcessInefficienciesAdminProps {
  selectedProcessId: string;
}

interface InefficiencyFormData {
  title: string;
  description: string;
  severity_level: string;
  affected_steps: string[];
  sort_order: number;
}

const ProcessInefficienciesAdmin: React.FC<ProcessInefficienciesAdminProps> = ({ selectedProcessId }) => {
  const { organizationClient } = useOrganization();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedInefficiency, setSelectedInefficiency] = useState<any>(null);
  const [formData, setFormData] = useState<InefficiencyFormData>({
    title: "",
    description: "",
    severity_level: "Major",
    affected_steps: [],
    sort_order: 0
  });

  const { data: inefficiencies = [], refetch, isLoading } = useQuery({
    queryKey: ['process-inefficiencies', selectedProcessId],
    queryFn: async () => {
      if (!selectedProcessId || !organizationClient) return [];
      
      const { data, error } = await organizationClient
        .from('process_inefficiencies')
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
      title: "",
      description: "",
      severity_level: "Major",
      affected_steps: [],
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
        .from('process_inefficiencies')
        .insert([{
          ...formData,
          process_id: selectedProcessId
        }]);

      if (error) throw error;

      toast.success("Inefficiency created successfully!");
      setCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error creating inefficiency:", error);
      toast.error("Failed to create inefficiency");
    }
  };

  const handleEdit = (inefficiency: any) => {
    setSelectedInefficiency(inefficiency);
    setFormData({
      title: inefficiency.title,
      description: inefficiency.description,
      severity_level: inefficiency.severity_level,
      affected_steps: Array.isArray(inefficiency.affected_steps) ? inefficiency.affected_steps : [],
      sort_order: inefficiency.sort_order
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedInefficiency || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_inefficiencies')
        .update(formData)
        .eq('id', selectedInefficiency.id);

      if (error) throw error;

      toast.success("Inefficiency updated successfully!");
      setEditDialogOpen(false);
      setSelectedInefficiency(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error updating inefficiency:", error);
      toast.error("Failed to update inefficiency");
    }
  };

  const handleDelete = async (inefficiency: any) => {
    if (!confirm(`Are you sure you want to delete "${inefficiency.title}"?`) || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_inefficiencies')
        .delete()
        .eq('id', inefficiency.id);

      if (error) throw error;

      toast.success("Inefficiency deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting inefficiency:", error);
      toast.error("Failed to delete inefficiency");
    }
  };

  const toggleActive = async (inefficiency: any) => {
    if (!organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_inefficiencies')
        .update({ is_active: !inefficiency.is_active })
        .eq('id', inefficiency.id);

      if (error) throw error;

      toast.success(`Inefficiency ${inefficiency.is_active ? 'deactivated' : 'activated'} successfully!`);
      refetch();
    } catch (error) {
      console.error("Error toggling inefficiency status:", error);
      toast.error("Failed to update inefficiency status");
    }
  };

  if (!selectedProcessId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please select a process to manage inefficiencies.</p>
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
          <h3 className="text-lg font-semibold">Process Inefficiencies</h3>
          <p className="text-sm text-gray-500">Manage inefficiency identification and impact analysis</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Inefficiency
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Severity Level</TableHead>
            <TableHead>Affected Steps</TableHead>
            <TableHead>Sort Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inefficiencies.map((inefficiency) => (
            <TableRow key={inefficiency.id}>
              <TableCell className="font-medium">{inefficiency.title}</TableCell>
              <TableCell className="max-w-xs truncate">{inefficiency.description}</TableCell>
              <TableCell>
                <Badge variant={inefficiency.severity_level === 'Critical' ? "destructive" : inefficiency.severity_level === 'Major' ? "default" : "secondary"}>
                  {inefficiency.severity_level}
                </Badge>
              </TableCell>
              <TableCell>
                {Array.isArray(inefficiency.affected_steps) ? inefficiency.affected_steps.length : 0} steps
              </TableCell>
              <TableCell>{inefficiency.sort_order}</TableCell>
              <TableCell>
                <Badge variant={inefficiency.is_active ? "default" : "secondary"}>
                  {inefficiency.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(inefficiency)}
                  >
                    {inefficiency.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(inefficiency)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(inefficiency)}
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
            <DialogTitle>Create Inefficiency</DialogTitle>
            <DialogDescription>
              Add an inefficiency analysis for a process.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Manual Data Entry"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the inefficiency"
              />
            </div>
            
            <div>
              <Label htmlFor="severity_level">Severity Level</Label>
              <select
                id="severity_level"
                value={formData.severity_level}
                onChange={(e) => setFormData({ ...formData, severity_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Minor">Minor</option>
                <option value="Major">Major</option>
                <option value="Critical">Critical</option>
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
                Create Inefficiency
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inefficiency</DialogTitle>
            <DialogDescription>
              Update the inefficiency information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_title">Title</Label>
              <Input
                id="edit_title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Manual Data Entry"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the inefficiency"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_severity_level">Severity Level</Label>
              <select
                id="edit_severity_level"
                value={formData.severity_level}
                onChange={(e) => setFormData({ ...formData, severity_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Minor">Minor</option>
                <option value="Major">Major</option>
                <option value="Critical">Critical</option>
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
                setSelectedInefficiency(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Inefficiency
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessInefficienciesAdmin;
