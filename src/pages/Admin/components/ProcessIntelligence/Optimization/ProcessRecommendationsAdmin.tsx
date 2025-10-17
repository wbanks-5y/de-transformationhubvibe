
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

interface ProcessRecommendationsAdminProps {
  selectedProcessId: string;
}

interface RecommendationFormData {
  title: string;
  description: string;
  impact_level: string;
  complexity_level: string;
  benefits: string[];
  risks: string[];
  sort_order: number;
}

const ProcessRecommendationsAdmin: React.FC<ProcessRecommendationsAdminProps> = ({ selectedProcessId }) => {
  const { organizationClient } = useOrganization();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [formData, setFormData] = useState<RecommendationFormData>({
    title: "",
    description: "",
    impact_level: "Medium",
    complexity_level: "Medium",
    benefits: [],
    risks: [],
    sort_order: 0
  });

  const { data: recommendations = [], refetch, isLoading } = useQuery({
    queryKey: ['process-recommendations', selectedProcessId],
    queryFn: async () => {
      if (!selectedProcessId || !organizationClient) return [];
      
      const { data, error } = await organizationClient
        .from('process_recommendations')
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
      impact_level: "Medium",
      complexity_level: "Medium",
      benefits: [],
      risks: [],
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
        .from('process_recommendations')
        .insert([{
          ...formData,
          process_id: selectedProcessId
        }]);

      if (error) throw error;

      toast.success("Recommendation created successfully!");
      setCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error creating recommendation:", error);
      toast.error("Failed to create recommendation");
    }
  };

  const handleEdit = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
    setFormData({
      title: recommendation.title,
      description: recommendation.description,
      impact_level: recommendation.impact_level,
      complexity_level: recommendation.complexity_level,
      benefits: Array.isArray(recommendation.benefits) ? recommendation.benefits : [],
      risks: Array.isArray(recommendation.risks) ? recommendation.risks : [],
      sort_order: recommendation.sort_order
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedRecommendation || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_recommendations')
        .update(formData)
        .eq('id', selectedRecommendation.id);

      if (error) throw error;

      toast.success("Recommendation updated successfully!");
      setEditDialogOpen(false);
      setSelectedRecommendation(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error updating recommendation:", error);
      toast.error("Failed to update recommendation");
    }
  };

  const handleDelete = async (recommendation: any) => {
    if (!confirm(`Are you sure you want to delete "${recommendation.title}"?`) || !organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_recommendations')
        .delete()
        .eq('id', recommendation.id);

      if (error) throw error;

      toast.success("Recommendation deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting recommendation:", error);
      toast.error("Failed to delete recommendation");
    }
  };

  const toggleActive = async (recommendation: any) => {
    if (!organizationClient) return;

    try {
      const { error } = await organizationClient
        .from('process_recommendations')
        .update({ is_active: !recommendation.is_active })
        .eq('id', recommendation.id);

      if (error) throw error;

      toast.success(`Recommendation ${recommendation.is_active ? 'deactivated' : 'activated'} successfully!`);
      refetch();
    } catch (error) {
      console.error("Error toggling recommendation status:", error);
      toast.error("Failed to update recommendation status");
    }
  };

  if (!selectedProcessId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please select a process to manage recommendations.</p>
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
          <h3 className="text-lg font-semibold">Process Recommendations</h3>
          <p className="text-sm text-gray-500">Manage optimization recommendations and improvement suggestions</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Recommendation
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Impact Level</TableHead>
            <TableHead>Complexity Level</TableHead>
            <TableHead>Sort Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recommendations.map((recommendation) => (
            <TableRow key={recommendation.id}>
              <TableCell className="font-medium">{recommendation.title}</TableCell>
              <TableCell className="max-w-xs truncate">{recommendation.description}</TableCell>
              <TableCell>
                <Badge variant={recommendation.impact_level === 'High' ? "destructive" : recommendation.impact_level === 'Medium' ? "default" : "secondary"}>
                  {recommendation.impact_level}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={recommendation.complexity_level === 'High' ? "destructive" : recommendation.complexity_level === 'Medium' ? "default" : "secondary"}>
                  {recommendation.complexity_level}
                </Badge>
              </TableCell>
              <TableCell>{recommendation.sort_order}</TableCell>
              <TableCell>
                <Badge variant={recommendation.is_active ? "default" : "secondary"}>
                  {recommendation.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(recommendation)}
                  >
                    {recommendation.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(recommendation)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(recommendation)}
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
            <DialogTitle>Create Recommendation</DialogTitle>
            <DialogDescription>
              Add an optimization recommendation for the process.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Automate Approval Process"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the recommendation"
              />
            </div>
            
            <div>
              <Label htmlFor="impact_level">Impact Level</Label>
              <select
                id="impact_level"
                value={formData.impact_level}
                onChange={(e) => setFormData({ ...formData, impact_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <Label htmlFor="complexity_level">Complexity Level</Label>
              <select
                id="complexity_level"
                value={formData.complexity_level}
                onChange={(e) => setFormData({ ...formData, complexity_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
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
                Create Recommendation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Recommendation</DialogTitle>
            <DialogDescription>
              Update the recommendation information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_title">Title</Label>
              <Input
                id="edit_title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Automate Approval Process"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the recommendation"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_impact_level">Impact Level</Label>
              <select
                id="edit_impact_level"
                value={formData.impact_level}
                onChange={(e) => setFormData({ ...formData, impact_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <Label htmlFor="edit_complexity_level">Complexity Level</Label>
              <select
                id="edit_complexity_level"
                value={formData.complexity_level}
                onChange={(e) => setFormData({ ...formData, complexity_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
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
                setSelectedRecommendation(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Recommendation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessRecommendationsAdmin;
