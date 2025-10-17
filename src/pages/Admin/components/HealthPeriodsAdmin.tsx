
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
import { supabase } from "@/integrations/supabase/client";
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

interface HealthPeriodFormData {
  objective_id: string;
  period_type: string;
  year: number;
  health_score: number;
  rag_status: string;
  notes: string;
}

const HealthPeriodsAdmin: React.FC = () => {
  const { data: healthPeriods = [], refetch } = useStrategicHealthPeriods();
  const { data: objectives = [] } = useStrategicObjectives();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<HealthPeriodFormData>({
    objective_id: "",
    period_type: "current",
    year: new Date().getFullYear(),
    health_score: 50,
    rag_status: "amber",
    notes: ""
  });

  const periodTypes = [
    { value: "current", label: "Current Period" },
    { value: "q1", label: "Q1" },
    { value: "q2", label: "Q2" },
    { value: "q3", label: "Q3" },
    { value: "q4", label: "Q4" }
  ];

  const ragStatuses = [
    { value: "green", label: "Green (On Track)", color: "bg-green-500" },
    { value: "amber", label: "Amber (At Risk)", color: "bg-yellow-500" },
    { value: "red", label: "Red (Off Track)", color: "bg-red-500" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('strategic_objective_health_periods')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success("Health period updated successfully");
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('strategic_objective_health_periods')
          .insert([formData]);
        
        if (error) throw error;
        toast.success("Health period created successfully");
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
      toast.error("Error saving health period: " + error.message);
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
    if (!confirm("Are you sure you want to delete this health period?")) return;
    
    try {
      const { error } = await supabase
        .from('strategic_objective_health_periods')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Health period deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error("Error deleting health period: " + error.message);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Periods Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Health Period
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Health Period</DialogTitle>
              <DialogDescription>
                Add health tracking data for a strategic objective.
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
                  <Label htmlFor="period_type">Period Type</Label>
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
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="health_score">Health Score (0-100)</Label>
                  <Input
                    id="health_score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.health_score}
                    onChange={(e) => setFormData({...formData, health_score: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rag_status">RAG Status</Label>
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
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes about this health period..."
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Health Period</Button>
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
                    </div>
                    <div className={`text-2xl font-bold ${getHealthColor(healthPeriod.health_score)}`}>
                      {healthPeriod.health_score}%
                    </div>
                    {healthPeriod.notes && (
                      <p className="text-gray-600 text-sm">{healthPeriod.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
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
    </div>
  );
};

export default HealthPeriodsAdmin;
