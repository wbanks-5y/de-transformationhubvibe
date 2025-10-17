
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
import IconSelector from "../IconSelector";
import { getIconByName } from "@/utils/iconUtils";

interface ProcessStepsAdminProps {
  selectedProcessId?: string;
}

interface StepFormData {
  process_id: string;
  name: string;
  department: string;
  icon_name: string;
  color_class: string;
  description: string;
  sort_order: number;
}

const ProcessStepsAdmin: React.FC<ProcessStepsAdminProps> = ({ selectedProcessId }) => {
  const { organizationClient } = useOrganization();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<any>(null);
  const [formData, setFormData] = useState<StepFormData>({
    process_id: selectedProcessId || "",
    name: "",
    department: "",
    icon_name: "",
    color_class: "bg-blue-100",
    description: "",
    sort_order: 0
  });

  const { data: processes = [] } = useBusinessProcesses();

  const { data: steps = [], refetch, isLoading } = useQuery({
    queryKey: ['process-steps', selectedProcessId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }

      let query = organizationClient
        .from('process_steps')
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

  // Function to generate recommendation text for IconSelector
  const getIconRecommendationText = () => {
    const parts = [];
    if (formData.name) parts.push(formData.name);
    if (formData.department) parts.push(formData.department);
    return parts.join(' ');
  };

  const resetForm = () => {
    setFormData({
      process_id: selectedProcessId || "",
      name: "",
      department: "",
      icon_name: "",
      color_class: "bg-blue-100",
      description: "",
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
        .from('process_steps')
        .insert([formData]);

      if (error) throw error;

      toast.success("Process step created successfully!");
      setCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error creating step:", error);
      toast.error("Failed to create step");
    }
  };

  const handleEdit = (step: any) => {
    setSelectedStep(step);
    setFormData({
      process_id: step.process_id,
      name: step.name,
      department: step.department || "",
      icon_name: step.icon_name || "",
      color_class: step.color_class,
      description: step.description || "",
      sort_order: step.sort_order
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedStep || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_steps')
        .update(formData)
        .eq('id', selectedStep.id);

      if (error) throw error;

      toast.success("Process step updated successfully!");
      setEditDialogOpen(false);
      setSelectedStep(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error updating step:", error);
      toast.error("Failed to update step");
    }
  };

  const handleDelete = async (step: any) => {
    if (!confirm(`Are you sure you want to delete "${step.name}"?`) || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_steps')
        .delete()
        .eq('id', step.id);

      if (error) throw error;

      toast.success("Process step deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting step:", error);
      toast.error("Failed to delete step");
    }
  };

  const toggleActive = async (step: any) => {
    if (!organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_steps')
        .update({ is_active: !step.is_active })
        .eq('id', step.id);

      if (error) throw error;

      toast.success(`Step ${step.is_active ? 'deactivated' : 'activated'} successfully!`);
      refetch();
    } catch (error) {
      console.error("Error toggling step status:", error);
      toast.error("Failed to update step status");
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
                <CardTitle>Process Steps</CardTitle>
                <CardDescription>
                  Manage individual steps within business processes
                </CardDescription>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {showProcessColumn && <TableHead>Process</TableHead>}
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {steps.map((step) => {
                  const IconComponent = getIconByName(step.icon_name);
                  return (
                    <TableRow key={step.id}>
                      {showProcessColumn && (
                        <TableCell className="font-medium">
                          {step.business_processes?.display_name}
                        </TableCell>
                      )}
                      <TableCell>{step.name}</TableCell>
                      <TableCell>{step.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span className="text-sm text-gray-500">{step.icon_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-block w-4 h-4 rounded ${step.color_class}`}></div>
                      </TableCell>
                      <TableCell>{step.sort_order}</TableCell>
                      <TableCell>
                        <Badge variant={step.is_active ? "default" : "secondary"}>
                          {step.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActive(step)}
                          >
                            {step.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(step)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(step)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Process Steps</h3>
              <p className="text-sm text-gray-500">Manage steps for the selected process</p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Step
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {steps.map((step) => {
                const IconComponent = getIconByName(step.icon_name);
                return (
                  <TableRow key={step.id}>
                    <TableCell>{step.name}</TableCell>
                    <TableCell>{step.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm text-gray-500">{step.icon_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-block w-4 h-4 rounded ${step.color_class}`}></div>
                    </TableCell>
                    <TableCell>{step.sort_order}</TableCell>
                    <TableCell>
                      <Badge variant={step.is_active ? "default" : "secondary"}>
                        {step.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(step)}
                        >
                          {step.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(step)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(step)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Process Step</DialogTitle>
            <DialogDescription>
              Add a new step to a business process.
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
              <Label htmlFor="name">Step Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Create Order"
              />
            </div>
            
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Sales"
              />
            </div>
            
            <div>
              <Label htmlFor="icon_name">Icon</Label>
              <IconSelector
                selectedIcon={formData.icon_name}
                onIconSelect={(iconName) => setFormData({ ...formData, icon_name: iconName })}
                cockpitName={getIconRecommendationText()}
              />
            </div>
            
            <div>
              <Label htmlFor="color_class">Color Class</Label>
              <Select value={formData.color_class} onValueChange={(value) => setFormData({ ...formData, color_class: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-blue-100">Blue</SelectItem>
                  <SelectItem value="bg-green-100">Green</SelectItem>
                  <SelectItem value="bg-yellow-100">Yellow</SelectItem>
                  <SelectItem value="bg-red-100">Red</SelectItem>
                  <SelectItem value="bg-purple-100">Purple</SelectItem>
                  <SelectItem value="bg-orange-100">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Step description"
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
                Create Step
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Process Step</DialogTitle>
            <DialogDescription>
              Update the step information.
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
              <Label htmlFor="edit_name">Step Name</Label>
              <Input
                id="edit_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Create Order"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_department">Department</Label>
              <Input
                id="edit_department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Sales"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_icon_name">Icon</Label>
              <IconSelector
                selectedIcon={formData.icon_name}
                onIconSelect={(iconName) => setFormData({ ...formData, icon_name: iconName })}
                cockpitName={getIconRecommendationText()}
              />
            </div>
            
            <div>
              <Label htmlFor="edit_color_class">Color Class</Label>
              <Select value={formData.color_class} onValueChange={(value) => setFormData({ ...formData, color_class: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-blue-100">Blue</SelectItem>
                  <SelectItem value="bg-green-100">Green</SelectItem>
                  <SelectItem value="bg-yellow-100">Yellow</SelectItem>
                  <SelectItem value="bg-red-100">Red</SelectItem>
                  <SelectItem value="bg-purple-100">Purple</SelectItem>
                  <SelectItem value="bg-orange-100">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Step description"
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
                setSelectedStep(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Step
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessStepsAdmin;
