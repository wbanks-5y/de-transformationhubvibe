
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
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InitiativeFormData {
  objective_id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress_percentage: number;
  owner: string;
  start_date: string;
  target_date: string;
  budget_allocated: number;
  risk_level: string;
  success_criteria: string;
}

const InitiativesAdmin: React.FC = () => {
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
    progress_percentage: 0,
    owner: "",
    start_date: "",
    target_date: "",
    budget_allocated: 0,
    risk_level: "medium",
    success_criteria: ""
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
          strategic_objectives!strategic_initiatives_objective_id_fkey(
            id,
            display_name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const statusOptions = [
    { value: "planning", label: "Planning" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
  ];

  const riskLevels = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
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
        budget_allocated: formData.budget_allocated || null,
        start_date: formData.start_date || null,
        target_date: formData.target_date || null
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
        progress_percentage: 0,
        owner: "",
        start_date: "",
        target_date: "",
        budget_allocated: 0,
        risk_level: "medium",
        success_criteria: ""
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
      progress_percentage: initiative.progress_percentage,
      owner: initiative.owner || "",
      start_date: initiative.start_date || "",
      target_date: initiative.target_date || "",
      budget_allocated: initiative.budget_allocated || 0,
      risk_level: initiative.risk_level || "medium",
      success_criteria: initiative.success_criteria || ""
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
      progress_percentage: 0,
      owner: "",
      start_date: "",
      target_date: "",
      budget_allocated: 0,
      risk_level: "medium",
      success_criteria: ""
    });
    setEditingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'on_hold': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Strategic Initiatives Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Initiative
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Strategic Initiative</DialogTitle>
              <DialogDescription>
                Add a new initiative to support strategic objectives.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="objective_id">Strategic Objective</Label>
                <Select value={formData.objective_id} onValueChange={(value) => setFormData({...formData, objective_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectives.map((obj) => (
                      <SelectItem key={obj.id} value={obj.id}>{obj.display_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Initiative Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
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
                      {priorityOptions.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="target_date">Target Date</Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget_allocated">Budget Allocated</Label>
                  <Input
                    id="budget_allocated"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget_allocated}
                    onChange={(e) => setFormData({...formData, budget_allocated: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="risk_level">Risk Level</Label>
                  <Select value={formData.risk_level} onValueChange={(value) => setFormData({...formData, risk_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {riskLevels.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="success_criteria">Success Criteria</Label>
                <Textarea
                  id="success_criteria"
                  value={formData.success_criteria}
                  onChange={(e) => setFormData({...formData, success_criteria: e.target.value})}
                  placeholder="Define what success looks like for this initiative..."
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
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label htmlFor="edit_owner">Owner</Label>
                      <Input
                        id="edit_owner"
                        value={formData.owner}
                        onChange={(e) => setFormData({...formData, owner: e.target.value})}
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
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit_status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit_priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map((p) => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit_progress_percentage">Progress (%)</Label>
                      <Input
                        id="edit_progress_percentage"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.progress_percentage}
                        onChange={(e) => setFormData({...formData, progress_percentage: parseInt(e.target.value) || 0})}
                      />
                    </div>
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
                      <h3 className="text-lg font-semibold">{initiative.name}</h3>
                      <Badge className={`${getStatusColor(initiative.status)} text-white`}>
                        {initiative.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={`${getPriorityColor(initiative.priority)} text-white`}>
                        {initiative.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {initiative.progress_percentage}% Complete
                      </Badge>
                    </div>
                    <p className="text-gray-600">{initiative.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Objective: {initiative.strategic_objectives?.display_name}</span>
                      {initiative.owner && <span>Owner: {initiative.owner}</span>}
                      {initiative.start_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(initiative.start_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {initiative.success_criteria && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Success Criteria:</p>
                        <p className="text-sm text-gray-600">{initiative.success_criteria}</p>
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
    </div>
  );
};

export default InitiativesAdmin;
