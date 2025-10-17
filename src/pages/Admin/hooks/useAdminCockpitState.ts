
import { useState } from "react";
import { CockpitType, CockpitKPI } from "@/types/cockpit";

export const useAdminCockpitState = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCockpit, setEditingCockpit] = useState<CockpitType | null>(null);
  const [managingSections, setManagingSections] = useState<CockpitType | null>(null);
  const [managingKPIs, setManagingKPIs] = useState<CockpitType | null>(null);
  const [managingInsights, setManagingInsights] = useState<CockpitType | null>(null);
  const [editingKPI, setEditingKPI] = useState<CockpitKPI | null>(null);
  const [showCreateKPIForm, setShowCreateKPIForm] = useState(false);

  return {
    showCreateForm,
    setShowCreateForm,
    editingCockpit,
    setEditingCockpit,
    managingSections,
    setManagingSections,
    managingKPIs,
    setManagingKPIs,
    managingInsights,
    setManagingInsights,
    editingKPI,
    setEditingKPI,
    showCreateKPIForm,
    setShowCreateKPIForm,
  };
};
