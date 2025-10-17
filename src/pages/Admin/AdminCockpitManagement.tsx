
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useCreateCockpitType, useUpdateCockpitType, useDeleteCockpitType, useToggleCockpitStatus } from "@/hooks/use-cockpit-management";
import { useCockpitData } from "@/hooks/use-cockpit-data";
import { useCockpitSections } from "@/hooks/use-cockpit-sections";
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { useAdminCockpitState } from "./hooks/useAdminCockpitState";
import { useAdminCockpitHandlers } from "./hooks/useAdminCockpitHandlers";
import { convertMetricDisplayToCockpitMetric } from "./types/adminTypes";

import CockpitTypeCard from "./components/CockpitTypeCard";
import CreateCockpitForm from "./components/forms/CreateCockpitForm";
import CockpitTypeEditForm from "./components/CockpitTypeEditForm";
import SectionManagement from "./components/SectionManagement";
import InsightsTab from "./components/InsightsTab";
import MetricsTab from "./components/MetricsTab";
import CockpitKPIsList from "./components/CockpitKPIsList";
import CreateKPIForm from "./components/forms/CreateKPIForm";
import KPIEditForm from "./components/KPIEditForm";
import CockpitSelectorBar from "./components/CockpitSelectorBar";

const AdminCockpitManagement: React.FC = () => {
  const { organizationClient } = useOrganization();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCockpitForMetrics, setSelectedCockpitForMetrics] = useState("");
  const [selectedCockpitForInsights, setSelectedCockpitForInsights] = useState("");
  const [selectedCockpitForSections, setSelectedCockpitForSections] = useState("");
  const [selectedCockpitForKPIs, setSelectedCockpitForKPIs] = useState("");
  const [showCreateKPIForm, setShowCreateKPIForm] = useState(false);

  // Fetch cockpit types
  const { data: cockpitTypes, isLoading } = useQuery({
    queryKey: ['cockpit-types'],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      
      const { data, error } = await organizationClient
        .from('cockpit_types')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!organizationClient,
  });

  const { data: metricsData } = useCockpitData(selectedCockpitForMetrics);
  
  // Fetch sections for the selected cockpit
  const { data: sectionsData } = useCockpitSections(selectedCockpitForSections);
  
  const state = useAdminCockpitState();
  const handlers = useAdminCockpitHandlers(state);

  const createCockpit = useCreateCockpitType();
  const updateCockpit = useUpdateCockpitType();

  const handleEditMetrics = (cockpit: any) => {
    console.log('AdminCockpitManagement: Edit metrics clicked for cockpit:', cockpit);
    setSelectedCockpitForMetrics(cockpit.id);
    setActiveTab("metrics");
  };

  const handleEditKPIs = (cockpit: any) => {
    console.log('AdminCockpitManagement: Edit KPIs clicked for cockpit:', cockpit);
    setSelectedCockpitForKPIs(cockpit.id);
    setActiveTab("kpis");
  };

  const handleEditInsights = (cockpit: any) => {
    console.log('AdminCockpitManagement: Edit insights clicked for cockpit:', cockpit);
    setSelectedCockpitForInsights(cockpit.id);
    setActiveTab("insights");
  };

  const handleManageSections = (cockpit: any) => {
    console.log('AdminCockpitManagement: Manage sections clicked for cockpit:', cockpit);
    setSelectedCockpitForSections(cockpit.id);
    setActiveTab("sections");
  };

  const handleEditCockpit = (cockpit: any) => {
    state.setEditingCockpit(cockpit);
    // Scroll to top when editing a cockpit
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fixed create handler - only handle UI state updates, not mutations
  const handleCreateSuccess = (data: any) => {
    console.log('AdminCockpitManagement: handleCreateSuccess called - managing UI state only');
    state.setShowCreateForm(false);
    // The mutation is handled by the CreateCockpitForm component
  };

  const handleEditSuccess = async (data: any) => {
    if (!state.editingCockpit) return;
    
    console.log('AdminCockpitManagement: handleEditSuccess called with data:', data);
    try {
      await updateCockpit.mutateAsync({
        id: state.editingCockpit.id,
        updates: data
      });
      console.log('AdminCockpitManagement: Cockpit updated successfully, clearing editing state');
      state.setEditingCockpit(null);
      toast.success("Cockpit type updated successfully");
    } catch (error) {
      console.error('AdminCockpitManagement: Error updating cockpit:', error);
    }
  };

  const handleEditKPI = (kpi: any) => {
    state.setEditingKPI(kpi);
    setShowCreateKPIForm(false);
  };

  const handleKPICockpitChange = (cockpitId: string) => {
    setSelectedCockpitForKPIs(cockpitId);
    state.setEditingKPI(null);
    setShowCreateKPIForm(false);
  };

  // Enhanced delete handler that properly manages UI state
  const handleDeleteCockpit = async (id: string) => {
    console.log('AdminCockpitManagement: handleDeleteCockpit called with ID:', id);
    try {
      await handlers.handleDeleteCockpit(id);
      console.log('AdminCockpitManagement: Cockpit deleted successfully');
      toast.success("Cockpit and all related data deleted successfully");
    } catch (error) {
      console.error('AdminCockpitManagement: Error in handleDeleteCockpit:', error);
      // Error toast is already handled in the mutation
    }
  };

  // Convert MetricDisplay sections to CockpitMetric sections for MetricsTab
  const convertedMetricsData = metricsData ? {
    ...metricsData,
    sections: metricsData.sections.map(section => ({
      ...section,
      cockpit_metrics: section.cockpit_metrics.map(convertMetricDisplayToCockpitMetric)
    }))
  } : undefined;

  // Get selected cockpit types for insights and sections
  const selectedInsightsCockpitType = cockpitTypes?.find(c => c.id === selectedCockpitForInsights);
  const selectedSectionsCockpitType = cockpitTypes?.find(c => c.id === selectedCockpitForSections);

  // Get selected cockpit type for KPIs
  const selectedKPIsCockpitType = cockpitTypes?.find(c => c.id === selectedCockpitForKPIs);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading cockpit types...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cockpit Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Cockpit Types</h2>
            <Button 
              onClick={() => state.setShowCreateForm(true)}
              disabled={createCockpit.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              {createCockpit.isPending ? 'Creating...' : 'Create New Cockpit'}
            </Button>
          </div>

          {state.showCreateForm && (
            <CreateCockpitForm
              onSave={handleCreateSuccess}
              onCancel={() => state.setShowCreateForm(false)}
            />
          )}

          {state.editingCockpit && (
            <CockpitTypeEditForm
              cockpit={state.editingCockpit}
              onSave={handleEditSuccess}
              onCancel={() => state.setEditingCockpit(null)}
            />
          )}

          {/* Loading state during delete operations */}
          {handlers.isDeleting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-lg font-semibold">Deleting cockpit...</div>
                <div className="text-sm text-gray-600 mt-2">This may take a few moments</div>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cockpitTypes?.map((cockpit) => (
              <CockpitTypeCard
                key={cockpit.id}
                cockpit={cockpit}
                onEditMetrics={handleEditMetrics}
                onEditInsights={handleEditInsights}
                onEditKPIs={handleEditKPIs}
                onEditCockpit={handleEditCockpit}
                onToggleStatus={handlers.handleToggleStatus}
                onDeleteCockpit={handleDeleteCockpit}
                onManageSections={handleManageSections}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <MetricsTab
            cockpitTypes={cockpitTypes}
            selectedCockpit={selectedCockpitForMetrics}
            cockpitData={convertedMetricsData}
            onSelectedCockpitChange={setSelectedCockpitForMetrics}
          />
        </TabsContent>

        <TabsContent value="kpis" className="space-y-6">
          <div className="space-y-6">
            <CockpitSelectorBar
              cockpitTypes={cockpitTypes}
              selectedCockpit={selectedCockpitForKPIs}
              onSelectCockpit={handleKPICockpitChange}
            />

            {!selectedCockpitForKPIs || !selectedKPIsCockpitType ? (
              <div className="text-center py-8 text-gray-500">
                Select a cockpit to manage its KPIs
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">KPI Management for: {selectedKPIsCockpitType.display_name}</h2>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowCreateKPIForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create KPI
                    </Button>
                  </div>
                </div>

                {showCreateKPIForm && (
                  <CreateKPIForm
                    cockpitTypeId={selectedKPIsCockpitType.id}
                    onSave={handlers.handleCreateKPI}
                    onCancel={() => setShowCreateKPIForm(false)}
                  />
                )}

                {state.editingKPI && (
                  <KPIEditForm
                    kpi={state.editingKPI}
                    availableMetrics={[]}
                    isCreating={false}
                    onSave={handlers.handleUpdateKPI}
                    onCancel={() => state.setEditingKPI(null)}
                  />
                )}

                <CockpitKPIsList 
                  cockpitTypeId={selectedKPIsCockpitType.id} 
                  cockpitTypeName={selectedKPIsCockpitType.display_name}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <InsightsTab
            cockpitTypes={cockpitTypes}
            selectedCockpit={selectedCockpitForInsights}
            selectedCockpitType={selectedInsightsCockpitType}
            onSelectedCockpitChange={setSelectedCockpitForInsights}
          />
        </TabsContent>

        <TabsContent value="sections" className="space-y-6">
          <div className="space-y-6">
            <CockpitSelectorBar
              cockpitTypes={cockpitTypes}
              selectedCockpit={selectedCockpitForSections}
              onSelectCockpit={setSelectedCockpitForSections}
            />

            {!selectedCockpitForSections || !selectedSectionsCockpitType ? (
              <div className="text-center py-8 text-gray-500">
                Select a cockpit to manage its sections
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Managing sections for: {selectedSectionsCockpitType.display_name}
                </div>
                <SectionManagement
                  cockpit={selectedSectionsCockpitType}
                  sections={sectionsData || []} 
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCockpitManagement;
