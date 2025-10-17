import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOrganization } from "@/context/OrganizationContext";
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, Settings } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface BusinessProcessesAdminProps {
  onManageProcess?: (processId: string) => void;
}

interface ProcessFormData {
  name: string;
  display_name: string;
  description: string;
}

const BusinessProcessesAdmin: React.FC<BusinessProcessesAdminProps> = ({ onManageProcess }) => {
  const { organizationClient } = useOrganization();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [formData, setFormData] = useState<ProcessFormData>({
    name: "",
    display_name: "",
    description: ""
  });

  const { data: processes = [], refetch, isLoading } = useQuery({
    queryKey: ['business-processes-admin'],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }

      const { data, error } = await organizationClient
        .from('business_processes')
        .select('*')
        .order('display_name', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!organizationClient,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      display_name: "",
      description: ""
    });
  };

  const handleCreate = async () => {
    if (!organizationClient) {
      toast.error("No organization client available");
      return;
    }

    try {
      // Generate route_path from the name
      const route_path = `/${formData.name.toLowerCase().replace(/\s+/g, '-')}`;
      
      const processData = {
        ...formData,
        route_path
      };

      const { error } = await organizationClient
        .from('business_processes')
        .insert([processData]);

      if (error) throw error;

      toast.success("Business process created successfully!");
      setCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error creating process:", error);
      toast.error("Failed to create business process");
    }
  };

  const handleEdit = (process: any) => {
    setSelectedProcess(process);
    setFormData({
      name: process.name,
      display_name: process.display_name,
      description: process.description || ""
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedProcess || !organizationClient) return;

    try {
      // Generate route_path from the name
      const route_path = `/${formData.name.toLowerCase().replace(/\s+/g, '-')}`;
      
      const processData = {
        ...formData,
        route_path
      };

      const { error } = await organizationClient
        .from('business_processes')
        .update(processData)
        .eq('id', selectedProcess.id);

      if (error) throw error;

      toast.success("Business process updated successfully!");
      setEditDialogOpen(false);
      setSelectedProcess(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error updating process:", error);
      toast.error("Failed to update business process");
    }
  };

  const handleDelete = async (process: any) => {
    if (!confirm(`Are you sure you want to delete "${process.display_name}"?`) || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('business_processes')
        .delete()
        .eq('id', process.id);

      if (error) throw error;

      toast.success("Business process deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting process:", error);
      toast.error("Failed to delete business process");
    }
  };

  const toggleActive = async (process: any) => {
    if (!organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('business_processes')
        .update({ is_active: !process.is_active })
        .eq('id', process.id);

      if (error) throw error;

      toast.success(`Process ${process.is_active ? 'deactivated' : 'activated'} successfully!`);
      refetch();
    } catch (error) {
      console.error("Error toggling process status:", error);
      toast.error("Failed to update process status");
    }
  };

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
          <h3 className="text-lg font-semibold">Business Processes</h3>
          <p className="text-sm text-gray-500">Manage your business process definitions</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Process
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Display Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((process) => (
            <TableRow key={process.id}>
              <TableCell className="font-mono text-sm">{process.name}</TableCell>
              <TableCell className="font-medium">{process.display_name}</TableCell>
              <TableCell className="max-w-xs truncate">{process.description}</TableCell>
              <TableCell>
                <Badge variant={process.is_active ? "default" : "secondary"}>
                  {process.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {onManageProcess && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onManageProcess(process.id)}
                      className="flex items-center gap-1"
                    >
                      <Settings className="h-4 w-4" />
                      Manage
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(process)}
                  >
                    {process.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(process)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(process)}
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
            <DialogTitle>Create Business Process</DialogTitle>
            <DialogDescription>
              Add a new business process to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Process Name (ID)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., order-to-cash"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use lowercase with hyphens. This will be used as the internal identifier.
              </p>
            </div>
            
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="e.g., Order to Cash"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this business process..."
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
                Create Process
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Business Process</DialogTitle>
            <DialogDescription>
              Update the business process information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_name">Process Name (ID)</Label>
              <Input
                id="edit_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., order-to-cash"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use lowercase with hyphens. This will be used as the internal identifier.
              </p>
            </div>
            
            <div>
              <Label htmlFor="edit_display_name">Display Name</Label>
              <Input
                id="edit_display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="e.g., Order to Cash"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this business process..."
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => {
                setEditDialogOpen(false);
                setSelectedProcess(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Process
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessProcessesAdmin;
