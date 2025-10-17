
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useStrategicHealthPeriods } from "@/hooks/use-strategic-health-periods";
import { useStrategicObjectives } from "@/hooks/use-strategic-objectives";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X, AlertCircle, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HealthTrackingFormData {
  objective_id: string;
  period_type: string;
  year: number;
  health_score: number;
  rag_status: string;
  notes: string;
}

const ObjectiveHealthTrackingAdmin: React.FC = () => {
  const { organizationClient } = useOrganization();
  const { data: healthPeriods = [], refetch } = useStrategicHealthPeriods();
  const { data: objectives = [] } = useStrategicObjectives();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<HealthTrackingFormData>({
    objective_id: "",
    period_type: "current",
    year: new Date().getFullYear(),
    health_score: 50,
    rag_status: "amber",
    notes: ""
  });

  const periodTypes = [
    { value: "current", label: "Current Period", description: "Overall current performance" },
    { value: "q1", label: "Q1", description: "First quarter performance" },
    { value: "q2", label: "Q2", description: "Second quarter performance" },
    { value: "q3", label: "Q3", description: "Third quarter performance" },
    { value: "q4", label: "Q4", description: "Fourth quarter performance" }
  ];

  const ragStatuses = [
    { value: "green", label: "Green (On Track)", color: "bg-green-500", description: "Meeting or exceeding targets" },
    { value: "amber", label: "Amber (At Risk)", color: "bg-yellow-500", description: "Some concerns, needs attention" },
    { value: "red", label: "Red (Off Track)", color: "bg-red-500", description: "Significant issues, urgent action needed" }
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
          .from('strategic_objective_health_periods')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success("Health tracking updated successfully");
        setEditingId(null);
      } else {
        const { error } = await organizationClient
          .from('strategic_objective_health_periods')
          .insert([formData]);
        
        if (error) throw error;
        toast.success("Health tracking created successfully");
        setIsCreateDialogOpen(false);
      }
      
      setFormData({
        objective_id: "",
        period_type: "current",
        year: new Date().getFullYear(),
        health_score: 50,
        rag_status: "amber",
        notes: ""
      });
      
      refetch();
    } catch (error: any) {
      toast.error("Error saving health tracking: " + error.message);
    }
  };

  const handleEdit = (healthPeriod: any) => {
    setFormData({
      objective_id: healthPeriod.objective_id,
      period_type: healthPeriod.period_type,
      year: healthPeriod.year,
      health_score: healthPeriod.health_score,
      rag_status: healthPeriod.rag_status,
      notes: healthPeriod.notes || ""
    });
    setEditingId(healthPeriod.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this health tracking record?")) return;
    
    if (!organizationClient) {
      toast.error('Organization not available');
      return;
    }
    
    try {
      const { error } = await organizationClient
        .from('strategic_objective_health_periods')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Health tracking deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error("Error deleting health tracking: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      objective_id: "",
      period_type: "current",
      year: new Date().getFullYear(),
      health_score: 50,
      rag_status: "amber",
      notes: ""
    });
    setEditingId(null);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (objectives.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Strategic Objectives Found</h3>
        <p className="text-gray-500 mb-4">
          You need to create Strategic Objectives first before you can track their health.
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
          <h2 className="text-2xl font-bold">Objective Health Tracking</h2>
          <p className="text-gray-600 mt-1">Track performance scores and status for your strategic objectives</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Health Data
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Health Tracking Data</DialogTitle>
              <DialogDescription>
                Record health scores and status for a strategic objective in a specific time period.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="objective_id">Strategic Objective *</Label>
                <Select value={formData.objective_id} onValueChange={(value) => setFormData({...formData, objective_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select which objective to track" />
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="period_type">Time Period *</Label>
                  <Select value={formData.period_type} onValueChange={(value) => setFormData({...formData, period_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periodTypes.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          <div>
                            <div>{p.label}</div>
                            <div className="text-xs text-gray-500">{p.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="2020"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="health_score">Health Score (0-100) *</Label>
                  <Input
                    id="health_score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.health_score}
                    onChange={(e) => setFormData({...formData, health_score: parseInt(e.target.value) || 0})}
                    required
                    placeholder="e.g., 75"
                  />
                  <p className="text-xs text-gray-500 mt-1">0-59: Red, 60-79: Amber, 80-100: Green</p>
                </div>
                <div>
                  <Label htmlFor="rag_status">RAG Status *</Label>
                  <Select value={formData.rag_status} onValueChange={(value) => setFormData({...formData, rag_status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ragStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${status.color}`} />
                            <div>
                              <div>{status.label}</div>
                              <div className="text-xs text-gray-500">{status.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes & Commentary</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Explain the current status, key achievements, challenges, or action items..."
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Health Data</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {healthPeriods.map((healthPeriod) => (
          <Card key={healthPeriod.id}>
            <CardContent className="p-6">
              {editingId === healthPeriod.id ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Edit form with same structure as create form */}
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
                      <Label htmlFor="edit_period_type">Period Type</Label>
                      <Select value={formData.period_type} onValueChange={(value) => setFormData({...formData, period_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {periodTypes.map((p) => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit_year">Year</Label>
                      <Input
                        id="edit_year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_health_score">Health Score (0-100)</Label>
                      <Input
                        id="edit_health_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.health_score}
                        onChange={(e) => setFormData({...formData, health_score: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_rag_status">RAG Status</Label>
                      <Select value={formData.rag_status} onValueChange={(value) => setFormData({...formData, rag_status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ragStatuses.map((status) => (
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
                  </div>
                  <div>
                    <Label htmlFor="edit_notes">Notes</Label>
                    <Textarea
                      id="edit_notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
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
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold">
                        {healthPeriod.strategic_objectives?.display_name}
                      </h3>
                      <Badge variant="outline" className="capitalize">
                        {healthPeriod.period_type} {healthPeriod.year}
                      </Badge>
                      <Badge 
                        className={`${
                          healthPeriod.rag_status === 'green' ? 'bg-green-500' :
                          healthPeriod.rag_status === 'amber' ? 'bg-yellow-500' :
                          'bg-red-500'
                        } text-white`}
                      >
                        {healthPeriod.rag_status?.toUpperCase()}
                      </Badge>
                      <div className="text-sm text-gray-500 capitalize">
                        {healthPeriod.strategic_objectives?.perspective} Perspective
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-bold ${getHealthColor(healthPeriod.health_score)}`}>
                        {healthPeriod.health_score}%
                      </div>
                      <div className="text-sm text-gray-500">Health Score</div>
                    </div>
                    {healthPeriod.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{healthPeriod.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(healthPeriod)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(healthPeriod.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {healthPeriods.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Health Data Yet</h3>
          <p className="text-gray-500 mb-4">
            Start tracking the health of your strategic objectives by adding performance data.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Health Record
          </Button>
        </div>
      )}
    </div>
  );
};

export default ObjectiveHealthTrackingAdmin;
