
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CockpitType, CockpitKPI } from "@/types/cockpit";
import { convertMetricDisplayToCockpitMetric } from "@/pages/Admin/types/adminTypes";
import SectionManagement from "./SectionManagement";
import KPIEditForm from "./KPIEditForm";
import KPIManagementCard from "./KPIManagementCard";
import InsightsManagement from "./InsightsManagement";

interface InsightsViewProps {
  managingInsights: CockpitType;
  onBackFromInsights: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  managingInsights,
  onBackFromInsights,
}) => (
  <div className="container mx-auto p-6 space-y-6">
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBackFromInsights}>
        ← Back to Cockpits
      </Button>
      <h2 className="text-xl font-semibold">Managing Insights for {managingInsights.display_name}</h2>
    </div>
    <InsightsManagement 
      cockpitTypeId={managingInsights.id}
      cockpitDisplayName={managingInsights.display_name}
    />
  </div>
);

interface KPIManagementViewProps {
  managingKPIs: CockpitType;
  showCreateKPIForm: boolean;
  editingKPI: CockpitKPI | null;
  cockpitData: any;
  cockpitKPIs: CockpitKPI[] | undefined;
  onBackFromKPIs: () => void;
  onCreateKPI: (data: Partial<CockpitKPI>) => Promise<void>;
  onUpdateKPI: (data: Partial<CockpitKPI>) => Promise<void>;
  onEditKPI: (kpi: CockpitKPI) => void;
  onDeleteKPI: (id: string) => Promise<void>;
  onCancelKPIEdit: () => void;
  setShowCreateKPIForm: (show: boolean) => void;
}

export const KPIManagementView: React.FC<KPIManagementViewProps> = ({
  managingKPIs,
  showCreateKPIForm,
  editingKPI,
  cockpitData,
  cockpitKPIs,
  onBackFromKPIs,
  onCreateKPI,
  onUpdateKPI,
  onEditKPI,
  onDeleteKPI,
  onCancelKPIEdit,
  setShowCreateKPIForm,
}) => (
  <div className="container mx-auto p-6 space-y-6">
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBackFromKPIs}>
        ← Back to Cockpits
      </Button>
      <h2 className="text-xl font-semibold">Managing KPIs for {managingKPIs.display_name}</h2>
    </div>

    {(showCreateKPIForm || editingKPI) && cockpitData && (
      <KPIEditForm
        kpi={editingKPI || undefined}
        availableMetrics={cockpitData.sections.flatMap((s: any) => 
          s.cockpit_metrics.map((metric: any) => convertMetricDisplayToCockpitMetric(metric))
        )}
        isCreating={showCreateKPIForm}
        onSave={showCreateKPIForm ? onCreateKPI : onUpdateKPI}
        onCancel={onCancelKPIEdit}
      />
    )}

    {!showCreateKPIForm && !editingKPI && (
      <div className="mb-6">
        <Button 
          onClick={() => setShowCreateKPIForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New KPI
        </Button>
      </div>
    )}

    {cockpitKPIs && cockpitKPIs.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cockpitKPIs.map((kpi) => (
          <KPIManagementCard
            key={kpi.id}
            kpi={kpi}
            onEdit={onEditKPI}
            onDelete={onDeleteKPI}
            onManageData={() => {
              // This is a placeholder function since this view doesn't handle data management
              // The actual data management is handled in CockpitKPIsList component
              console.log('Data management for KPI:', kpi.id);
            }}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <Plus className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No KPIs configured</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create your first KPI to start tracking key performance indicators.
        </p>
      </div>
    )}
  </div>
);

interface SectionManagementViewProps {
  managingSections: CockpitType;
  sections: any[];
  onBackFromSections: () => void;
}

export const SectionManagementView: React.FC<SectionManagementViewProps> = ({
  managingSections,
  sections,
  onBackFromSections,
}) => (
  <div className="container mx-auto p-6 space-y-6">
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBackFromSections}>
        ← Back to Cockpits
      </Button>
      <h2 className="text-xl font-semibold">Managing Sections for {managingSections.display_name}</h2>
    </div>
    <SectionManagement 
      cockpit={managingSections} 
      sections={sections}
    />
  </div>
);
