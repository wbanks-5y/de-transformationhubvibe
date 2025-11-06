
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ExternalLink, Sparkles, Loader2, Check, X, Clock } from "lucide-react";
import { useAnalystInsights } from "@/hooks/useAnalystInsights";
import { useDeleteAnalystInsight, useApproveAnalystInsight, useRejectAnalystInsight } from "@/hooks/useAnalystInsightsAdmin";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import AnalystInsightForm from "./AnalystInsightForm";

const AnalystInsightsManagement: React.FC = () => {
  const { data: insights = [], isLoading } = useAnalystInsights();
  const { organizationClient } = useOrganization();
  const queryClient = useQueryClient();
  const deleteInsight = useDeleteAnalystInsight();
  const approveInsight = useApproveAnalystInsight();
  const rejectInsight = useRejectAnalystInsight();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<string | null>(null);
  const [isGeneratingPestle, setIsGeneratingPestle] = useState(false);

  // Separate insights by approval status
  const pendingInsights = insights.filter(insight => insight.approval_status === 'pending');
  const approvedInsights = insights.filter(insight => insight.approval_status === 'approved');
  const rejectedInsights = insights.filter(insight => insight.approval_status === 'rejected');

  const handleEdit = (insightId: string) => {
    setEditingInsight(insightId);
    setIsFormOpen(true);
  };

  const handleDelete = (insightId: string) => {
    if (confirm('Are you sure you want to delete this insight?')) {
      deleteInsight.mutate(insightId);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingInsight(null);
  };

  const handleApprove = (insightId: string) => {
    approveInsight.mutate(insightId);
  };

  const handleReject = (insightId: string) => {
    if (confirm('Are you sure you want to reject this insight?')) {
      rejectInsight.mutate(insightId);
    }
  };

  const handleGeneratePestleAnalysis = async () => {
    if (!organizationClient) {
      toast.error('No organization connection available');
      return;
    }
    
    setIsGeneratingPestle(true);
    try {
      console.log('Starting PESTLE analysis generation...');
      
      const { data, error } = await organizationClient.functions.invoke('generate-pestle-insights', {
        body: { 
          analysisType: 'pestle',
          includeCompanyData: true
        }
      });

      if (error) {
        console.error('Error generating PESTLE insights:', error);
        toast.error('Failed to generate PESTLE analysis. Please try again.');
        return;
      }

      console.log('PESTLE insights generated:', data);
      queryClient.invalidateQueries({ queryKey: ['analyst-insights'] });
      toast.success(`Generated ${data?.insights?.length || 0} PESTLE insights for approval!`);
      
    } catch (error) {
      console.error('Error in PESTLE generation:', error);
      toast.error('Failed to generate PESTLE analysis. Please try again.');
    } finally {
      setIsGeneratingPestle(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading insights...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analyst Insights Management</h2>
          <p className="text-gray-600">Manage external market intelligence insights and generate PESTLE analysis</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleGeneratePestleAnalysis}
            disabled={isGeneratingPestle}
            className="gap-2 bg-amber-600 hover:bg-amber-700"
          >
            {isGeneratingPestle ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGeneratingPestle ? 'Generating...' : 'Generate PESTLE Analysis'}
          </Button>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Insight
          </Button>
        </div>
      </div>

      {/* Pending Insights Section */}
      {pendingInsights.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold">Pending Approval ({pendingInsights.length})</h3>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Requires Review
            </Badge>
          </div>
          <div className="grid gap-4">
            {pendingInsights.map((insight) => (
              <Card key={insight.id} className="border-amber-200 bg-amber-50/30">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{insight.category}</Badge>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact}
                        </Badge>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                        <span className="text-sm text-gray-500">{insight.timestamp_text}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleApprove(insight.id)}
                        disabled={approveInsight.isPending}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReject(insight.id)}
                        disabled={rejectInsight.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(insight.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Source: {insight.source || 'Unknown'}</span>
                    {insight.external_url && (
                      <a 
                        href={insight.external_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Source
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approved Insights Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">Approved Insights ({approvedInsights.length})</h3>
        </div>
        <div className="grid gap-4">
          {approvedInsights.map((insight) => (
            <Card key={insight.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{insight.category}</Badge>
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact}
                      </Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        <Check className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                      <span className="text-sm text-gray-500">{insight.timestamp_text}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(insight.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(insight.id)}
                      disabled={deleteInsight.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">{insight.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Source: {insight.source || 'Unknown'}</span>
                  {insight.external_url && (
                    <a 
                      href={insight.external_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Source
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Show message if no insights */}
      {insights.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No insights found. Generate PESTLE analysis or add insights manually.
        </div>
      )}

      <AnalystInsightForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        insightId={editingInsight}
      />
    </div>
  );
};

export default AnalystInsightsManagement;
