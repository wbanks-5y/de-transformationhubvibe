
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOrganization } from "@/context/OrganizationContext";
import { Loader2, Edit, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ProcessStepDurationsAdminProps {
  selectedProcessId: string;
}

interface DurationFormData {
  step_name: string;
  duration_hours: number;
  sort_order: number;
}

const ProcessStepDurationsAdmin: React.FC<ProcessStepDurationsAdminProps> = ({ selectedProcessId }) => {
  const { organizationClient } = useOrganization();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<any>(null);
  const [formData, setFormData] = useState<DurationFormData>({
    step_name: "",
    duration_hours: 0,
    sort_order: 0
  });
  const [isAutoPopulating, setIsAutoPopulating] = useState(false);

  // Fetch process steps from discovery section
  const { data: processSteps = [] } = useQuery({
    queryKey: ['process-steps-for-durations', selectedProcessId],
    queryFn: async () => {
      if (!selectedProcessId || !organizationClient) return [];
      
      const { data, error } = await organizationClient
        .from('process_steps')
        .select('*')
        .eq('process_id', selectedProcessId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedProcessId && !!organizationClient,
  });

  const { data: durations = [], refetch, isLoading } = useQuery({
    queryKey: ['process-step-durations', selectedProcessId],
    queryFn: async () => {
      if (!selectedProcessId || !organizationClient) return [];
      
      const { data, error } = await organizationClient
        .from('process_step_durations')
        .select('*')
        .eq('process_id', selectedProcessId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedProcessId && !!organizationClient,
  });

  // Auto-populate durations based on process steps
  const autoPopulateDurations = async () => {
    if (!selectedProcessId || !processSteps.length || isAutoPopulating || !organizationClient) {
      if (!processSteps.length) {
        toast.error("No process steps found to populate durations");
      }
      return;
    }

    try {
      setIsAutoPopulating(true);
      
      // Get existing duration step names to avoid duplicates
      const existingStepNames = new Set(durations.map(d => d.step_name));
      
      // Filter out steps that already have durations
      const newSteps = processSteps.filter(step => !existingStepNames.has(step.name));
      
      if (newSteps.length === 0) {
        toast.info("All process steps already have duration entries");
        return;
      }

      // Create duration entries for new steps only
      const newDurations = newSteps.map(step => ({
        process_id: selectedProcessId,
        step_name: step.name,
        duration_hours: 0,
        sort_order: step.sort_order,
        is_active: true
      }));

      const { error } = await organizationClient
        .from('process_step_durations')
        .insert(newDurations);

      if (error) throw error;

      toast.success(`Added ${newSteps.length} new step duration entries!`);
      refetch();
    } catch (error) {
      console.error("Error auto-populating durations:", error);
      toast.error("Failed to auto-populate step durations");
    } finally {
      setIsAutoPopulating(false);
    }
  };

  // Only auto-populate once when we have process steps but no durations, and not already populating
  useEffect(() => {
    if (
      processSteps.length > 0 && 
      durations.length === 0 && 
      selectedProcessId && 
      !isAutoPopulating
    ) {
      autoPopulateDurations();
    }
  }, [processSteps.length, durations.length, selectedProcessId]); // Removed autoPopulateDurations from deps to prevent infinite loop

  const resetForm = () => {
    setFormData({
      step_name: "",
      duration_hours: 0,
      sort_order: 0
    });
  };

  const handleEdit = (duration: any) => {
    setSelectedDuration(duration);
    setFormData({
      step_name: duration.step_name,
      duration_hours: duration.duration_hours,
      sort_order: duration.sort_order
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedDuration || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_step_durations')
        .update(formData)
        .eq('id', selectedDuration.id);

      if (error) throw error;

      toast.success("Step duration updated successfully!");
      setEditDialogOpen(false);
      setSelectedDuration(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error updating duration:", error);
      toast.error("Failed to update step duration");
    }
  };

  const handleDelete = async (duration: any) => {
    if (!confirm(`Are you sure you want to delete "${duration.step_name}"?`) || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_step_durations')
        .delete()
        .eq('id', duration.id);

      if (error) throw error;

      toast.success("Step duration deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting duration:", error);
      toast.error("Failed to delete step duration");
    }
  };

  const toggleActive = async (duration: any) => {
    if (!organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_step_durations')
        .update({ is_active: !duration.is_active })
        .eq('id', duration.id);

      if (error) throw error;

      toast.success(`Duration ${duration.is_active ? 'deactivated' : 'activated'} successfully!`);
      refetch();
    } catch (error) {
      console.error("Error toggling duration status:", error);
      toast.error("Failed to update duration status");
    }
  };

  if (!selectedProcessId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please select a process to manage step durations.</p>
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
          <h3 className="text-lg font-semibold">Process Step Durations</h3>
          <p className="text-sm text-gray-500">
            Manage duration data for process steps. Steps are auto-populated from Process Discovery.
          </p>
        </div>
        <Button 
          onClick={autoPopulateDurations} 
          className="flex items-center gap-2"
          disabled={isAutoPopulating}
        >
          {isAutoPopulating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Sync with Process Steps
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Step Name</TableHead>
            <TableHead>Duration (Hours)</TableHead>
            <TableHead>Sort Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {durations.map((duration) => (
            <TableRow key={duration.id}>
              <TableCell className="font-medium">{duration.step_name}</TableCell>
              <TableCell>{duration.duration_hours}</TableCell>
              <TableCell>{duration.sort_order}</TableCell>
              <TableCell>
                <Badge variant={duration.is_active ? "default" : "secondary"}>
                  {duration.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(duration)}
                  >
                    {duration.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(duration)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(duration)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {durations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No step durations found. Click "Sync with Process Steps" to auto-populate from Process Discovery.
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Step Duration</DialogTitle>
            <DialogDescription>
              Update the step duration information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_step_name">Step Name</Label>
              <Input
                id="edit_step_name"
                value={formData.step_name}
                onChange={(e) => setFormData({ ...formData, step_name: e.target.value })}
                placeholder="e.g., Create Order"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Step name is read-only. It's synchronized from Process Discovery.
              </p>
            </div>
            
            <div>
              <Label htmlFor="edit_duration_hours">Duration (Hours)</Label>
              <Input
                id="edit_duration_hours"
                type="number"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit_sort_order">Sort Order</Label>
              <Input
                id="edit_sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Sort order is synchronized from Process Discovery.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => {
                setEditDialogOpen(false);
                setSelectedDuration(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Duration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessStepDurationsAdmin;
