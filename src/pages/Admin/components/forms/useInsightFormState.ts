
import { useState } from "react";
import { CockpitInsight } from "@/types/cockpit";

export const useInsightFormState = (cockpitTypeId: string) => {
  const [formData, setFormData] = useState<Partial<CockpitInsight>>({
    cockpit_type_id: cockpitTypeId,
    title: '',
    description: '',
    insight_type: 'positive',
    priority: 'medium',
    is_active: true,
  });

  const updateFormData = (updates: Partial<CockpitInsight>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetFormData = (cockpitTypeId: string) => {
    setFormData({
      cockpit_type_id: cockpitTypeId,
      title: '',
      description: '',
      insight_type: 'positive',
      priority: 'medium',
      is_active: true,
    });
  };

  return {
    formData,
    updateFormData,
    resetFormData
  };
};
