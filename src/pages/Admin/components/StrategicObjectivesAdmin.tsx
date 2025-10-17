
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useStrategicObjectives } from "@/hooks/use-strategic-objectives";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ObjectiveFormData {
  name: string;
  display_name: string;
  description: string;
  perspective: string;
  target_description: string;
  owner: string;
  sort_order: number;
  is_active: boolean;
}

const StrategicObjectivesAdmin: React.FC = () => {
  const { organizationClient } = useOrganization();
  const { data: objectives = [], refetch } = useStrategicObjectives();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ObjectiveFormData>({
    name: "",
    display_name: "",
    description: "",
    perspective: "financial",
    target_description: "",
    owner: "",
    sort_order: 0,
    is_active: true
  });

  const perspectives = [
    { value: "financial", label: "Financial" },
    { value: "customer", label: "Customer" },
    { value: "internal", label: "Internal Processes" },
    { value: "learning", label: "Learning & Growth" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organizationClient) {
      toast.error('Organization not available');
      return;
    }
    
    try {
      if (editingId) {
        const { error } = await organizationClient
          .from('strategic_objectives')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success("Objective updated successfully");
        setEditingId(null);
      } else {
        const { error } = await organizationClient
          .from('strategic_objectives')
          .insert([formData]);
        
        if (error) throw error;
        toast.success("Objective created successfully");
        setIsCreateDialogOpen(false);
      }
      
      setFormData({
        name: "",
        display_name: "",
        description: "",
        perspective: "financial",
        target_description: "",
        owner: "",
        sort_order: 0,
        is_active: true
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error saving objective:', error);
      const errorMessage = error?.message || "Failed to save objective";
      const errorDetails = error?.details ? ` - ${error.details}` : '';
      const errorHint = error?.hint ? ` (${error.hint})` : '';
      toast.error(`${errorMessage}${errorDetails}${errorHint}`);
    }
  };

  const handleEdit = (objective: any) => {
    setFormData({
      name: objective.name,
      display_name: objective.display_name,
      description: objective.description || "",
      perspective: objective.perspective,
      target_description: objective.target_description || "",
      owner: objective.owner || "",
      sort_order: objective.sort_order,
      is_active: objective.is_active
    });
    setEditingId(objective.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this objective?")) return;
    
    if (!organizationClient) {
      toast.error('Organization not available');
      return;
    }
    
    try {
      const { error } = await organizationClient
        .from('strategic_objectives')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Objective deleted successfully");
      refetch();
    } catch (error: any) {
      console.error('Error deleting objective:', error);
      const errorMessage = error?.message || "Failed to delete objective";
      const errorDetails = error?.details ? ` - ${error.details}` : '';
      const errorHint = error?.hint ? ` (${error.hint})` : '';
      toast.error(`${errorMessage}${errorDetails}${errorHint}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      display_name: "",
      description: "",
      perspective: "financial",
      target_description: "",
      owner: "",
      sort_order: 0,
      is_active: true
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Strategic Objectives Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Objective
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Strategic Objective</DialogTitle>
              <DialogDescription>
                Add a new strategic objective to track organisational goals.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="perspective">Perspective</Label>
                  <Select value={formData.perspective} onValueChange={(value) => setFormData({...formData, perspective: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {perspectives.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="owner">Owner</Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => setFormData({...formData, owner: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="target_description">Target Description</Label>
                <Textarea
                  id="target_description"
                  value={formData.target_description}
                  onChange={(e) => setFormData({...formData, target_description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Objective</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {objectives.map((objective) => (
          <Card key={objective.id}>
            <CardContent className="p-6">
              {editingId === objective.id ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_name">Name</Label>
                      <Input
                        id="edit_name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_display_name">Display Name</Label>
                      <Input
                        id="edit_display_name"
                        value={formData.display_name}
                        onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit_description">Description</Label>
                    <Textarea
                      id="edit_description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_perspective">Perspective</Label>
                      <Select value={formData.perspective} onValueChange={(value) => setFormData({...formData, perspective: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {perspectives.map((p) => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit_owner">Owner</Label>
                      <Input
                        id="edit_owner"
                        value={formData.owner}
                        onChange={(e) => setFormData({...formData, owner: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit_target_description">Target Description</Label>
                    <Textarea
                      id="edit_target_description"
                      value={formData.target_description}
                      onChange={(e) => setFormData({...formData, target_description: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{objective.display_name}</h3>
                      <Badge variant="outline" className="capitalize">
                        {objective.perspective}
                      </Badge>
                      {!objective.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-gray-600">{objective.description}</p>
                    <p className="text-sm text-gray-500">Target: {objective.target_description}</p>
                    <p className="text-sm text-gray-500">Owner: {objective.owner}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(objective)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(objective.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StrategicObjectivesAdmin;
