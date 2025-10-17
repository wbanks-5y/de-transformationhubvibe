import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useStrategicObjectives, useStrategicRisksOpportunities } from "@/hooks/use-strategic-objectives";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import { normalizeStatus, normalizeImpactLevel, normalizeProbability } from "@/lib/normalizers/risks";
import { z } from "zod";
import { Plus, Edit, Trash2, Save, X, AlertTriangle, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RiskOpportunityFormData {
  objective_id: string;
  title: string;
  description: string;
  type: string;
  impact_level: string;
  probability: string;
  status: string;
  owner: string;
  mitigation_actions: string;
  review_date: string;
}

const riskOpportunitySchema = z.object({
  objective_id: z.string().optional(),
  title: z.string().trim().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().trim().min(1, "Description is required"),
  type: z.enum(['risk', 'opportunity']),
  impact_level: z.enum(['low', 'medium', 'high', 'critical'], {
    required_error: "Impact level is required"
  }),
  probability: z.enum(['low', 'medium', 'high'], {
    required_error: "Probability is required"
  }),
  status: z.enum(['identified', 'assessed', 'mitigated', 'closed']),
  owner: z.string().trim().max(100, "Owner name too long"),
  mitigation_actions: z.string().trim(),
  review_date: z.string()
});

const RisksOpportunitiesAdmin: React.FC = () => {
  const { organizationClient, currentOrganization } = useOrganization();
  const { data: objectives = [] } = useStrategicObjectives();
  const { data: risksOpportunities = [], refetch } = useStrategicRisksOpportunities();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<RiskOpportunityFormData>({
    objective_id: "none",
    title: "",
    description: "",
    type: "risk",
    impact_level: "medium",
    probability: "medium",
    status: "identified",
    owner: "",
    mitigation_actions: "",
    review_date: ""
  });

  const typeOptions = [
    { value: "risk", label: "Risk", icon: AlertTriangle, color: "text-red-600" },
    { value: "opportunity", label: "Opportunity", icon: TrendingUp, color: "text-green-600" }
  ];

  const impactLevels = [
    { value: "low", label: "Low", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-red-500" },
    { value: "critical", label: "Critical", color: "bg-purple-600" }
  ];

  const probabilityLevels = [
    { value: "low", label: "Low (0-33%)", color: "bg-green-500" },
    { value: "medium", label: "Medium (34-66%)", color: "bg-yellow-500" },
    { value: "high", label: "High (67-100%)", color: "bg-red-500" }
  ];

  const statusOptions = [
    { value: "identified", label: "Identified" },
    { value: "assessed", label: "Assessed" },
    { value: "mitigated", label: "Mitigated" },
    { value: "closed", label: "Closed" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organizationClient) {
      toast.error('Organization client not available. Please select an organization.');
      return;
    }
    
    try {
      // Validate form data
      const validatedData = riskOpportunitySchema.parse(formData);
      
      // Normalize values for database
      const submitData: any = {
        type: validatedData.type,
        title: validatedData.title,
        description: validatedData.description,
        status: normalizeStatus(validatedData.status),
        impact_level: normalizeImpactLevel(validatedData.impact_level),
        probability: normalizeProbability(validatedData.probability),
        objective_id: validatedData.objective_id === "none" ? null : validatedData.objective_id,
        owner: validatedData.owner || null,
        mitigation_actions: validatedData.mitigation_actions || null,
        review_date: validatedData.review_date || null
      };

      // Force lowercase at the final step to avoid any case mismatch
      submitData.status = String(submitData.status).trim().toLowerCase();
      submitData.impact_level = String(submitData.impact_level).trim().toLowerCase();
      submitData.probability = String(submitData.probability).trim().toLowerCase();

      console.log('📤 Final submit (forced lower):', {
        status: `[${submitData.status}]`, statusLen: submitData.status.length,
        impact_level: `[${submitData.impact_level}]`, impactLen: submitData.impact_level.length,
        probability: `[${submitData.probability}]`, probLen: submitData.probability.length,
        raw: submitData
      });

      if (editingId) {
        const { error } = await organizationClient
          .from('strategic_risks_opportunities')
          .update(submitData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success(`${formData.type === 'risk' ? 'Risk' : 'Opportunity'} updated successfully`);
        setEditingId(null);
      } else {
        const { error } = await organizationClient
          .from('strategic_risks_opportunities')
          .insert([submitData]);
        
        if (error) throw error;
        toast.success(`${formData.type === 'risk' ? 'Risk' : 'Opportunity'} created successfully`);
        setIsCreateDialogOpen(false);
      }
      
      setFormData({
        objective_id: "none",
        title: "",
        description: "",
        type: "risk",
        impact_level: "medium",
        probability: "medium",
        status: "identified",
        owner: "",
        mitigation_actions: "",
        review_date: ""
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error saving risk/opportunity:', error);
      if (error.name === 'ZodError') {
        toast.error('Please check all required fields are filled correctly');
      } else {
        toast.error(`Error saving: ${error.message}${error.details ? ` - ${error.details}` : ''}${error.hint ? ` (${error.hint})` : ''}`);
      }
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      objective_id: item.objective_id || "none",
      title: item.title,
      description: item.description,
      type: item.type,
      impact_level: item.impact_level,
      probability: item.probability,
      status: item.status,
      owner: item.owner || "",
      mitigation_actions: item.mitigation_actions || "",
      review_date: item.review_date || ""
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    if (!organizationClient) {
      toast.error('Organization client not available. Please select an organization.');
      return;
    }
    
    try {
      const { error } = await organizationClient
        .from('strategic_risks_opportunities')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Item deleted successfully");
      refetch();
    } catch (error: any) {
      console.error('Error deleting risk/opportunity:', error);
      toast.error(`Error deleting: ${error.message}${error.details ? ` - ${error.details}` : ''}${error.hint ? ` (${error.hint})` : ''}`);
    }
  };

  const resetForm = () => {
    setFormData({
      objective_id: "none",
      title: "",
      description: "",
      type: "risk",
      impact_level: "medium",
      probability: "medium",
      status: "identified",
      owner: "",
      mitigation_actions: "",
      review_date: ""
    });
    setEditingId(null);
  };

  const getImpactColor = (level: string) => {
    const levelObj = impactLevels.find(l => l.value === level);
    return levelObj?.color || 'bg-gray-500';
  };

  const getTypeIcon = (type: string) => {
    const typeObj = typeOptions.find(t => t.value === type);
    return typeObj?.icon || AlertTriangle;
  };

  const getTypeColor = (type: string) => {
    const typeObj = typeOptions.find(t => t.value === type);
    return typeObj?.color || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Risks & Opportunities Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Risk/Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Risk or Opportunity</DialogTitle>
              <DialogDescription>
                Add a new risk or opportunity to track and manage.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <div className="flex items-center gap-2">
                            <t.icon className={`h-4 w-4 ${t.color}`} />
                            {t.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="objective_id">Strategic Objective (Optional)</Label>
                  <Select value={formData.objective_id} onValueChange={(value) => setFormData({...formData, objective_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select objective" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific objective</SelectItem>
                      {objectives.map((obj) => (
                        <SelectItem key={obj.id} value={obj.id}>{obj.display_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="impact_level">Impact Level</Label>
                  <Select value={formData.impact_level} onValueChange={(value) => setFormData({...formData, impact_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {impactLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${level.color}`} />
                            {level.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="probability">Probability</Label>
                  <Select value={formData.probability} onValueChange={(value) => setFormData({...formData, probability: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {probabilityLevels.map((prob) => (
                        <SelectItem key={prob.value} value={prob.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${prob.color}`} />
                            {prob.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="owner">Owner</Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => setFormData({...formData, owner: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="review_date">Review Date</Label>
                  <Input
                    id="review_date"
                    type="date"
                    value={formData.review_date}
                    onChange={(e) => setFormData({...formData, review_date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="mitigation_actions">
                  {formData.type === 'risk' ? 'Mitigation Actions' : 'Realisation Actions'}
                </Label>
                <Textarea
                  id="mitigation_actions"
                  value={formData.mitigation_actions}
                  onChange={(e) => setFormData({...formData, mitigation_actions: e.target.value})}
                  placeholder={formData.type === 'risk' ? 'Actions to mitigate this risk...' : 'Actions to realise this opportunity...'}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create {formData.type === 'risk' ? 'Risk' : 'Opportunity'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {risksOpportunities.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          return (
            <Card key={item.id}>
              <CardContent className="p-6">
                {editingId === item.id ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Edit form - similar structure to create form */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit_type">Type</Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {typeOptions.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                <div className="flex items-center gap-2">
                                  <t.icon className={`h-4 w-4 ${t.color}`} />
                                  {t.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit_objective_id">Strategic Objective (Optional)</Label>
                        <Select value={formData.objective_id} onValueChange={(value) => setFormData({...formData, objective_id: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No specific objective</SelectItem>
                            {objectives.map((obj) => (
                              <SelectItem key={obj.id} value={obj.id}>{obj.display_name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit_title">Title</Label>
                      <Input
                        id="edit_title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_description">Description</Label>
                      <Textarea
                        id="edit_description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
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
                        <TypeIcon className={`h-5 w-5 ${getTypeColor(item.type)}`} />
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <Badge variant="outline" className="capitalize">
                          {item.type}
                        </Badge>
                        <Badge className={`${getImpactColor(item.impact_level)} text-white`}>
                          {item.impact_level.toUpperCase()} Impact
                        </Badge>
                        <Badge className={`${getImpactColor(item.probability)} text-white`}>
                          {item.probability.toUpperCase()} Probability
                        </Badge>
                        <Badge variant="secondary">
                          {item.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {item.owner && <span>Owner: {item.owner}</span>}
                        {item.review_date && (
                          <span>Review: {new Date(item.review_date).toLocaleDateString()}</span>
                        )}
                      </div>
                      {item.mitigation_actions && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">
                            {item.type === 'risk' ? 'Mitigation Actions:' : 'Realisation Actions:'}
                          </p>
                          <p className="text-sm text-gray-600">{item.mitigation_actions}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RisksOpportunitiesAdmin;
