
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useStrategicObjectives } from "@/hooks/use-strategic-objectives";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X, Calendar, AlertCircle, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

interface InitiativeFormData {
  objective_id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  owner: string;
  start_date: string;
  target_date: string;
  progress_percentage: number;
  budget_allocated: number;
  notes: string;
}

const StrategicInitiativesAdmin: React.FC = () => {
  const { organizationClient, currentOrganization } = useOrganization();
  const { data: objectives = [] } = useStrategicObjectives();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<InitiativeFormData>({
    objective_id: "",
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    owner: "",
    start_date: "",
    target_date: "",
    progress_percentage: 0,
    budget_allocated: 0,
    notes: ""
  });

  const { data: initiatives = [], refetch } = useQuery({
    queryKey: ['strategic-initiatives', currentOrganization?.slug],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('Organization client not available');
      }

      const { data, error } = await organizationClient
        .from('strategic_initiatives')
        .select(`
          *,
          strategic_objectives (
            id,
            display_name,
            perspective
          )
        `)
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const statusOptions = [
    { value: "planning", label: "Planning", color: "bg-gray-500" },
    { value: "in_progress", label: "In Progress", color: "bg-blue-500" },
    { value: "on_hold", label: "On Hold", color: "bg-yellow-500" },
    { value: "completed", label: "Completed", color: "bg-green-500" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-gray-500" },
    { value: "medium", label: "Medium", color: "bg-blue-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "critical", label: "Critical", color: "bg-red-500" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organizationClient) {
      toast.error("Organization client not available");
      return;
    }

    try {
      const submitData = {
        ...formData,
        start_date: formData.start_date || null,
        target_date: formData.target_date || null,
        budget_allocated: formData.budget_allocated || 0,
        notes: formData.notes || null
      };

      if (editingId) {
        const { error } = await organizationClient
          .from('strategic_initiatives')
          .update(submitData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success("Initiative updated successfully");
        setEditingId(null);
      } else {
        const { error } = await organizationClient
          .from('strategic_initiatives')
          .insert([submitData]);
        
        if (error) throw error;
        toast.success("Initiative created successfully");
        setIsCreateDialogOpen(false);
      }
      
      setFormData({
        objective_id: "",
        name: "",
        description: "",
        status: "planning",
        priority: "medium",
        owner: "",
        start_date: "",
        target_date: "",
        progress_percentage: 0,
        budget_allocated: 0,
        notes: ""
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error saving initiative:', error);
      const errorMessage = error?.message || "Failed to save initiative";
      const errorDetails = error?.details ? ` - ${error.details}` : '';
      const errorHint = error?.hint ? ` (${error.hint})` : '';
      toast.error(`${errorMessage}${errorDetails}${errorHint}`);
    }
  };

  const handleEdit = (initiative: any) => {
    setFormData({
      objective_id: initiative.objective_id,
      name: initiative.name,
      description: initiative.description || "",
      status: initiative.status,
      priority: initiative.priority,
      owner: initiative.owner || "",
      start_date: initiative.start_date || "",
      target_date: initiative.target_date || "",
      progress_percentage: initiative.progress_percentage || 0,
      budget_allocated: initiative.budget_allocated || 0,
      notes: initiative.notes || ""
    });
    setEditingId(initiative.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this initiative?")) return;
    
    if (!organizationClient) {
      toast.error("Organization client not available");
      return;
    }

    try {
      const { error } = await organizationClient
        .from('strategic_initiatives')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Initiative deleted successfully");
      refetch();
    } catch (error: any) {
      console.error('Error deleting initiative:', error);
      const errorMessage = error?.message || "Failed to delete initiative";
      const errorDetails = error?.details ? ` - ${error.details}` : '';
      const errorHint = error?.hint ? ` (${error.hint})` : '';
      toast.error(`${errorMessage}${errorDetails}${errorHint}`);
    }
  };

  const resetForm = () => {
    setFormData({
      objective_id: "",
      name: "",
      description: "",
      status: "planning",
      priority: "medium",
      owner: "",
      start_date: "",
      target_date: "",
      progress_percentage: 0,
      budget_allocated: 0,
      notes: ""
    });
    setEditingId(null);
  };

  const getStatusColor = (status: string) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorityOptions.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-500';
  };

  if (objectives.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Strategic Objectives Found</h3>
        <p className="text-gray-500 mb-4">
          You need to create Strategic Objectives first before you can add initiatives.
        </p>
        <p className="text-sm text-blue-600">
          Switch to the "Strategic Objectives" tab to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Strategic Initiatives</h2>
          <p className="text-gray-600 mt-1">Manage projects and actions that drive progress toward your strategic objectives</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Initiative
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Strategic Initiative</DialogTitle>
              <DialogDescription>
                Add a specific project or action that will help achieve a strategic objective.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="objective_id">Strategic Objective *</Label>
                <Select value={formData.objective_id} onValueChange={(value) => setFormData({...formData, objective_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select which objective this initiative supports" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectives.map((obj) => (
                      <SelectItem key={obj.id} value={obj.id}>
                        <div>
                          <div className="font-medium">{obj.display_name}</div>
                          <div className="text-sm text-gray-500 capitalize">{obj.perspective} Perspective</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Initiative Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Implement new CRM system"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what this initiative involves and what it aims to achieve..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${status.color}`} />
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="owner">Owner / Lead</Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => setFormData({...formData, owner: e.target.value})}
                    placeholder="Who is responsible for this initiative?"
                  />
                </div>
                <div>
                  <Label htmlFor="progress_percentage">Progress (%)</Label>
                  <Input
                    id="progress_percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress_percentage}
                    onChange={(e) => setFormData({...formData, progress_percentage: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="target_date">Target Completion Date</Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="budget_allocated">Budget Allocated</Label>
                <Input
                  id="budget_allocated"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budget_allocated}
                  onChange={(e) => setFormData({...formData, budget_allocated: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes, updates, or comments..."
                  rows={2}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Initiative</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {initiatives.map((initiative) => (
          <Card key={initiative.id}>
            <CardContent className="p-6">
              {editingId === initiative.id ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Edit form - abbreviated for space */}
                  <div>
                    <Label htmlFor="edit_objective_id">Strategic Objective</Label>
                    <Select value={formData.objective_id} onValueChange={(value) => setFormData({...formData, objective_id: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {objectives.map((obj) => (
                          <SelectItem key={obj.id} value={obj.id}>{obj.display_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_name">Initiative Name</Label>
                    <Input
                      id="edit_name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_description">Description</Label>
                    <Textarea
                      id="edit_description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Target className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">{initiative.name}</h3>
                      <Badge className={`${getStatusColor(initiative.status)} text-white`}>
                        {initiative.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={`${getPriorityColor(initiative.priority)} text-white`}>
                        {initiative.priority.toUpperCase()} Priority
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <strong>Supports:</strong> {initiative.strategic_objectives?.display_name}
                      <span className="text-gray-400 ml-2 capitalize">
                        ({initiative.strategic_objectives?.perspective} Perspective)
                      </span>
                    </div>
                    
                    {initiative.description && (
                      <p className="text-gray-700">{initiative.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {initiative.owner && (
                        <div>
                          <span className="text-gray-500">Owner:</span>
                          <div className="font-medium">{initiative.owner}</div>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Progress:</span>
                        <div className="font-medium">{initiative.progress_percentage}%</div>
                      </div>
                      {initiative.target_date && (
                        <div>
                          <span className="text-gray-500">Target Date:</span>
                          <div className="font-medium">{new Date(initiative.target_date).toLocaleDateString()}</div>
                        </div>
                      )}
                      {initiative.budget_allocated > 0 && (
                        <div>
                          <span className="text-gray-500">Budget:</span>
                          <div className="font-medium">${initiative.budget_allocated.toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                    
                    {initiative.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{initiative.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(initiative)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(initiative.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {initiatives.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Initiatives Yet</h3>
          <p className="text-gray-500 mb-4">
            Create initiatives to track the specific projects and actions that will help achieve your strategic objectives.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Initiative
          </Button>
        </div>
      )}
    </div>
  );
};

export default StrategicInitiativesAdmin;
