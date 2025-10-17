
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBusinessProcesses } from "@/hooks/useBusinessProcesses";
import { useOrganization } from "@/context/OrganizationContext";
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ProcessVariantsAdminProps {
  selectedProcessId?: string;
}

interface VariantFormData {
  process_id: string;
  name: string;
  description: string;
  frequency_percentage: number;
  sort_order: number;
}

const ProcessVariantsAdmin: React.FC<ProcessVariantsAdminProps> = ({ selectedProcessId }) => {
  const { organizationClient } = useOrganization();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [formData, setFormData] = useState<VariantFormData>({
    process_id: selectedProcessId || "",
    name: "",
    description: "",
    frequency_percentage: 0,
    sort_order: 0
  });

  const { data: processes = [] } = useBusinessProcesses();

  const { data: variants = [], refetch, isLoading } = useQuery({
    queryKey: ['process-variants', selectedProcessId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }

      let query = organizationClient
        .from('process_variants')
        .select(`
          *,
          business_processes (
            display_name
          )
        `);

      if (selectedProcessId) {
        query = query.eq('process_id', selectedProcessId);
      }

      const { data, error } = await query.order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!organizationClient,
  });

  // Update formData when selectedProcessId changes
  useEffect(() => {
    if (selectedProcessId) {
      setFormData(prev => ({ ...prev, process_id: selectedProcessId }));
    }
  }, [selectedProcessId]);

  const resetForm = () => {
    setFormData({
      process_id: selectedProcessId || "",
      name: "",
      description: "",
      frequency_percentage: 0,
      sort_order: 0
    });
  };

  const handleCreate = async () => {
    if (!organizationClient) {
      toast.error("No organization client available");
      return;
    }

    try {
      const { error } = await organizationClient
        .from('process_variants')
        .insert([formData]);

      if (error) throw error;

      toast.success("Process variant created successfully!");
      setCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error creating variant:", error);
      toast.error("Failed to create variant");
    }
  };

  const handleEdit = (variant: any) => {
    setSelectedVariant(variant);
    setFormData({
      process_id: variant.process_id,
      name: variant.name,
      description: variant.description || "",
      frequency_percentage: variant.frequency_percentage,
      sort_order: variant.sort_order
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedVariant || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_variants')
        .update(formData)
        .eq('id', selectedVariant.id);

      if (error) throw error;

      toast.success("Process variant updated successfully!");
      setEditDialogOpen(false);
      setSelectedVariant(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error updating variant:", error);
      toast.error("Failed to update variant");
    }
  };

  const handleDelete = async (variant: any) => {
    if (!confirm(`Are you sure you want to delete "${variant.name}"?`) || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_variants')
        .delete()
        .eq('id', variant.id);

      if (error) throw error;

      toast.success("Process variant deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant");
    }
  };

  const toggleActive = async (variant: any) => {
    if (!organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_variants')
        .update({ is_active: !variant.is_active })
        .eq('id', variant.id);

      if (error) throw error;

      toast.success(`Variant ${variant.is_active ? 'deactivated' : 'activated'} successfully!`);
      refetch();
    } catch (error) {
      console.error("Error toggling variant status:", error);
      toast.error("Failed to update variant status");
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
                <CardTitle>Process Variants</CardTitle>
                <CardDescription>
                  Manage different variations of business processes
                </CardDescription>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Variant
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {showProcessColumn && <TableHead>Process</TableHead>}
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Frequency %</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant) => (
                  <TableRow key={variant.id}>
                    {showProcessColumn && (
                      <TableCell className="font-medium">
                        {variant.business_processes?.display_name}
                      </TableCell>
                    )}
                    <TableCell>{variant.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{variant.description}</TableCell>
                    <TableCell>
                      <Badge variant={variant.frequency_percentage > 15 ? "destructive" : "outline"}>
                        {variant.frequency_percentage}%
                      </Badge>
                    </TableCell>
                    <TableCell>{variant.sort_order}</TableCell>
                    <TableCell>
                      <Badge variant={variant.is_active ? "default" : "secondary"}>
                        {variant.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(variant)}
                        >
                          {variant.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(variant)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(variant)}
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
              <h3 className="text-lg font-semibold">Process Variants</h3>
              <p className="text-sm text-gray-500">Manage variants for the selected process</p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Variant
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Frequency %</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell>{variant.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{variant.description}</TableCell>
                  <TableCell>
                    <Badge variant={variant.frequency_percentage > 15 ? "destructive" : "outline"}>
                      {variant.frequency_percentage}%
                    </Badge>
                  </TableCell>
                  <TableCell>{variant.sort_order}</TableCell>
                  <TableCell>
                    <Badge variant={variant.is_active ? "default" : "secondary"}>
                      {variant.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(variant)}
                      >
                        {variant.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(variant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(variant)}
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
            <DialogTitle>Create New Process Variant</DialogTitle>
            <DialogDescription>
              Add a new variant to a business process.
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
              <Label htmlFor="name">Variant Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Express Processing"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Variant description"
              />
            </div>
            
            <div>
              <Label htmlFor="frequency_percentage">Frequency Percentage</Label>
              <Input
                id="frequency_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.frequency_percentage}
                onChange={(e) => setFormData({ ...formData, frequency_percentage: parseInt(e.target.value) || 0 })}
              />
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
                Create Variant
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Process Variant</DialogTitle>
            <DialogDescription>
              Update the variant information.
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
              <Label htmlFor="edit_name">Variant Name</Label>
              <Input
                id="edit_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Express Processing"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Variant description"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_frequency_percentage">Frequency Percentage</Label>
              <Input
                id="edit_frequency_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.frequency_percentage}
                onChange={(e) => setFormData({ ...formData, frequency_percentage: parseInt(e.target.value) || 0 })}
              />
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
                setSelectedVariant(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Variant
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessVariantsAdmin;
