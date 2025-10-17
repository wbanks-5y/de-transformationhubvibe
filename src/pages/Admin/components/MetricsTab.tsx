import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen } from "lucide-react";
import { CockpitType, CockpitMetric, CockpitSection } from "@/types/cockpit";
import { useCreateCockpitMetric, useDeleteCockpitMetric } from "@/hooks/use-cockpit-metric-management";
import { useCockpitData } from "@/hooks/use-cockpit-data";
import { useCockpitSections } from "@/hooks/use-cockpit-sections";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionCard from "./SectionCard";
import MetricForm from "./forms/MetricForm";
import SectionManagement from "./SectionManagement";
import CockpitSelectorBar from "./CockpitSelectorBar";

interface MetricsTabProps {
  cockpitTypes?: CockpitType[];
  selectedCockpit: string;
  cockpitData?: {
    sections: (CockpitSection & { cockpit_metrics: CockpitMetric[] })[];
  };
  onSelectedCockpitChange: (value: string) => void;
}

const MetricsTab: React.FC<MetricsTabProps> = ({
  cockpitTypes,
  selectedCockpit,
  cockpitData,
  onSelectedCockpitChange,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [managingSections, setManagingSections] = useState<CockpitType | null>(null);
  
  const createMetric = useCreateCockpitMetric();
  const deleteMetric = useDeleteCockpitMetric();

  // Get the cockpit data for section management - use the managing sections cockpit id
  const { data: sectionManagementData } = useCockpitSections(managingSections?.id || '');
  
  // Also get fresh cockpit data for the currently selected cockpit to ensure we have up-to-date sections
  const { data: currentCockpitData, isLoading: isLoadingCurrentData } = useCockpitData(selectedCockpit);

  const selectedCockpitType = cockpitTypes?.find(c => c.name === selectedCockpit);
  
  // Use the fresh data if available, otherwise fall back to props
  const activeCockpitData = currentCockpitData || cockpitData;
  
  // More robust section checking - account for loading states and empty arrays
  const hasValidSections = activeCockpitData?.sections && activeCockpitData.sections.length > 0;
  const isDataLoading = isLoadingCurrentData && !activeCockpitData;

  console.log('MetricsTab: Data state check', {
    selectedCockpit,
    isLoadingCurrentData,
    isDataLoading,
    hasPropsData: !!cockpitData,
    propsSectionsLength: cockpitData?.sections?.length || 0,
    hasFreshData: !!currentCockpitData,
    freshSectionsLength: currentCockpitData?.sections?.length || 0,
    hasValidSections,
    finalSectionsLength: activeCockpitData?.sections?.length || 0,
    activeCockpitData: activeCockpitData,
    managingSections: managingSections?.name
  });

  const handleCreateMetric = async (data: any): Promise<CockpitMetric> => {
    console.log('MetricsTab: handleCreateMetric called with data:', data);
    
    try {
      const result = await createMetric.mutateAsync(data);
      console.log('MetricsTab: createMetric.mutateAsync completed with result:', result);
      
      setShowCreateForm(false);
      setSelectedSectionId("");
      
      // Convert the result back to CockpitMetric format
      const cockpitMetric: CockpitMetric = {
        id: result.id,
        section_id: data.base.section_id,
        name: data.base.name,
        display_name: data.base.display_name,
        description: data.base.description,
        metric_type: data.metricType === 'single_value' ? 
          (data.singleValue?.metric_type || 'number') as 'number' | 'percentage' | 'currency' : 'chart',
        metric_data_type: data.metricType === 'single_value' ? 'single' : 
          data.metricType === 'multi_value' ? 'multi_value' : 'time_based',
        current_value: data.singleValue?.actual_value?.toString(),
        target_value: data.singleValue?.target_value?.toString(),
        trend: data.singleValue?.trend,
        data_config: data.multiValue || data.timeBased || {},
        sort_order: data.base.sort_order,
        is_active: data.base.is_active,
        size_config: data.base.size_config,
        icon: data.base.icon,
        color_class: data.base.color_class,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return cockpitMetric;
    } catch (error) {
      console.error('MetricsTab: Error in handleCreateMetric:', error);
      setShowCreateForm(false);
      setSelectedSectionId("");
      throw error;
    }
  };

  const handleDeleteMetric = async (metricId: string) => {
    try {
      console.log('Deleting metric:', metricId);
      await deleteMetric.mutateAsync(metricId);
      toast.success("Metric deleted successfully");
    } catch (error) {
      console.error('Failed to delete metric:', error);
      toast.error("Failed to delete metric");
    }
  };

  const handleCreateClick = () => {
    if (!hasValidSections) {
      toast.error("This cockpit has no sections yet. Please create sections first using the 'Manage Sections' button.");
      return;
    }
    setShowCreateForm(true);
  };

  const handleManageSections = () => {
    console.log('MetricsTab: handleManageSections called', { selectedCockpitType });
    if (selectedCockpitType) {
      setManagingSections(selectedCockpitType);
      // Clear any form states when switching to section management
      setShowCreateForm(false);
      setSelectedSectionId("");
    } else {
      toast.error("Please select a cockpit first");
    }
  };

  const handleBackToMetrics = () => {
    console.log('MetricsTab: handleBackToMetrics called');
    setManagingSections(null);
  };

  return (
    <div className="space-y-6">
      {/* Section Management View */}
      {managingSections && (
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={handleBackToMetrics}
            className="mb-4"
          >
            ← Back to Metrics
          </Button>
          
          <div className="text-sm text-gray-600 mb-4">
            Managing sections for: <strong>{managingSections.display_name}</strong>
          </div>
          
          <SectionManagement
            cockpit={managingSections}
            sections={sectionManagementData || []}
          />
        </div>
      )}

      {/* Main Metrics Management View */}
      {!managingSections && (
        <>
          <div className="space-y-4">
            <CockpitSelectorBar
              cockpitTypes={cockpitTypes}
              selectedCockpit={selectedCockpit}
              onSelectCockpit={onSelectedCockpitChange}
            />

            {selectedCockpit && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleManageSections}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={!selectedCockpitType}
                >
                  <FolderOpen className="h-4 w-4" />
                  Manage Sections
                </Button>
                <Button 
                  onClick={handleCreateClick}
                  className="flex items-center gap-2"
                  disabled={isDataLoading}
                >
                  <Plus className="h-4 w-4" />
                  Add New Metric
                </Button>
              </div>
            )}
          </div>

          {selectedCockpit && (
            <div className="space-y-6">
              {/* Loading State */}
              {isDataLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading sections...</p>
                </div>
              )}

              {/* Create Form */}
              {showCreateForm && hasValidSections && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Section for New Metric
                    </label>
                    <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a section..." />
                      </SelectTrigger>
                      <SelectContent>
                        {activeCockpitData?.sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.display_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSectionId && (
                    <MetricForm
                      sectionId={selectedSectionId}
                      onSave={handleCreateMetric}
                      onCancel={() => {
                        setShowCreateForm(false);
                        setSelectedSectionId("");
                      }}
                    />
                  )}
                </div>
              )}

              {/* No Sections State - Only show when not loading and no sections exist */}
              {!isDataLoading && !hasValidSections && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-4">
                    This cockpit doesn't have any sections yet.
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Sections need to be created first before you can add metrics. 
                    Click "Manage Sections" above to create sections for this cockpit.
                  </p>
                </div>
              )}

              {/* Existing Sections */}
              {!isDataLoading && hasValidSections && (
                <>
                  {activeCockpitData.sections.map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      onDeleteMetric={handleDeleteMetric}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MetricsTab;
