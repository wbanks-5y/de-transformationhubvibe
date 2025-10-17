
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { CockpitInsight } from "@/types/cockpit";
import { useCockpitInsights, useCreateCockpitInsight, useUpdateCockpitInsight, useDeleteCockpitInsight } from "@/hooks/insights";
import { useGenerateAIInsights } from "@/hooks/insights/useGenerateAIInsights";
import { useGenerateOpenAIInsights } from "@/hooks/insights/useGenerateOpenAIInsights";
import { useInsightFormState } from "./forms/useInsightFormState";
import InsightsActionButtons from "./InsightsActionButtons";
import InsightForm from "./forms/InsightForm";
import InsightsList from "./InsightsList";
import GenerateInsightsDialog from "./GenerateInsightsDialog";

interface InsightsManagementProps {
  cockpitTypeId: string;
  cockpitDisplayName: string;
}

const InsightsManagement: React.FC<InsightsManagementProps> = ({
  cockpitTypeId,
  cockpitDisplayName
}) => {
  console.log('InsightsManagement props:', {
    cockpitTypeId,
    cockpitDisplayName,
    hasTypeId: !!cockpitTypeId
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingInsight, setEditingInsight] = useState<CockpitInsight | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [useOpenAI, setUseOpenAI] = useState(false);
  
  const { formData, updateFormData, resetFormData } = useInsightFormState(cockpitTypeId);
  const { data: insights, isLoading, error } = useCockpitInsights(cockpitTypeId);
  
  console.log('InsightsManagement data state:', {
    insights,
    insightsCount: insights?.length || 0,
    isLoading,
    error,
    queryEnabled: !!cockpitTypeId
  });

  const createInsight = useCreateCockpitInsight();
  const updateInsight = useUpdateCockpitInsight();
  const deleteInsight = useDeleteCockpitInsight();
  const generateAI = useGenerateAIInsights();
  const generateOpenAI = useGenerateOpenAIInsights();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingInsight) {
        await updateInsight.mutateAsync({ id: editingInsight.id, updates: formData });
        setEditingInsight(null);
      } else {
        await createInsight.mutateAsync(formData as Omit<CockpitInsight, 'id' | 'created_at' | 'updated_at'>);
        setShowCreateForm(false);
      }
      
      resetFormData(cockpitTypeId);
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const handleEdit = (insight: CockpitInsight) => {
    setEditingInsight(insight);
    updateFormData({
      title: insight.title,
      description: insight.description,
      insight_type: insight.insight_type,
      priority: insight.priority,
      is_active: insight.is_active,
    });
    setShowCreateForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this insight?')) {
      await deleteInsight.mutateAsync(id);
    }
  };

  const handleGenerateAI = () => {
    setShowGenerateDialog(true);
  };

  const handleConfirmGenerate = async (replaceExisting: boolean) => {
    setShowGenerateDialog(false);
    try {
      if (useOpenAI) {
        await generateOpenAI.mutateAsync({ 
          cockpitTypeId, 
          timeRange: '30d',
          cockpitDisplayName,
          replaceExisting 
        });
      } else {
        await generateAI.mutateAsync({ 
          cockpitTypeId, 
          timeRange: '30d',
          replaceExisting 
        });
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingInsight(null);
    resetFormData(cockpitTypeId);
  };

  const handleCreateClick = () => {
    setShowCreateForm(true);
    setEditingInsight(null);
    resetFormData(cockpitTypeId);
  };

  if (isLoading) {
    console.log('InsightsManagement is loading...');
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('InsightsManagement error:', error);
    return (
      <div className="p-8 text-red-600">
        <p>Error loading insights: {error.message}</p>
      </div>
    );
  }

  console.log('InsightsManagement rendering with insights:', insights);

  const isGenerating = generateAI.isPending || generateOpenAI.isPending;

  return (
    <div className="space-y-6">
      <InsightsActionButtons
        onCreateClick={handleCreateClick}
        onGenerateAI={handleGenerateAI}
        isGeneratingAI={isGenerating}
      />

      {(showCreateForm || editingInsight) && (
        <InsightForm
          formData={formData}
          editingInsight={editingInsight}
          isLoading={createInsight.isPending || updateInsight.isPending}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onFormDataChange={updateFormData}
        />
      )}

      <InsightsList
        insights={insights}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteInsight.isPending}
      />

      <GenerateInsightsDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
        onConfirm={handleConfirmGenerate}
        existingInsightsCount={insights?.length || 0}
        cockpitDisplayName={cockpitDisplayName}
        isLoading={isGenerating}
      />
    </div>
  );
};

export default InsightsManagement;
