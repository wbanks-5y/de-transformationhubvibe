
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CockpitSection, CockpitMetric } from "@/types/cockpit";
import MetricCard from "./MetricCard";
import MetricForm from "./forms/MetricForm";
import { useMetricDetails } from "@/hooks/use-metric-details";
import { 
  useUpdateMetricBase,
  useUpdateSingleValueMetric,
  useUpdateMultiValueMetric,
  useUpdateTimeBasedMetric
} from "@/hooks/use-metric-update-hooks";

interface SectionCardProps {
  section: CockpitSection & { cockpit_metrics: CockpitMetric[] };
  onDeleteMetric: (metricId: string) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  section,
  onDeleteMetric,
}) => {
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  
  const updateBase = useUpdateMetricBase();
  const updateSingleValue = useUpdateSingleValueMetric();
  const updateMultiValue = useUpdateMultiValueMetric();
  const updateTimeBased = useUpdateTimeBasedMetric();
  
  const { data: metricDetails, isLoading: isLoadingDetails } = useMetricDetails(editingMetricId);

  const handleEditMetric = (metric: CockpitMetric) => {
    console.log('SectionCard: Starting edit for metric:', metric);
    setEditingMetricId(metric.id);
  };

  const handleCancelEdit = () => {
    setEditingMetricId(null);
  };

  const handleSaveEdit = async (data: any) => {
    if (!editingMetricId || !metricDetails) {
      console.error('SectionCard: No editing metric or details found');
      return;
    }

    console.log('SectionCard: Saving edit with data:', data);

    try {
      // Update base metric data
      await updateBase.mutateAsync({
        id: editingMetricId,
        updates: data.base
      });

      // Update type-specific data based on metric type
      switch (data.metricType) {
        case 'single_value':
          if (data.singleValue) {
            await updateSingleValue.mutateAsync({
              baseMetricId: editingMetricId,
              updates: data.singleValue
            });
          }
          break;

        case 'multi_value':
          if (data.multiValue) {
            await updateMultiValue.mutateAsync({
              baseMetricId: editingMetricId,
              config: data.multiValue,
              dataPoints: data.dataPoints
            });
          }
          break;

        case 'time_based':
          if (data.timeBased) {
            await updateTimeBased.mutateAsync({
              baseMetricId: editingMetricId,
              config: data.timeBased,
              dataPoints: data.dataPoints
            });
          }
          break;
      }

      setEditingMetricId(null);
    } catch (error) {
      console.error('SectionCard: Error saving metric edit:', error);
    }
  };

  // Helper function to ensure size_config is a valid value
  const getSafeSize = (size: string): 'small' | 'medium' | 'large' | 'xl' => {
    const validSizes = ['small', 'medium', 'large', 'xl'] as const;
    return validSizes.includes(size as any) ? (size as 'small' | 'medium' | 'large' | 'xl') : 'medium';
  };

  // Convert metric details to form format
  const getInitialFormData = () => {
    if (!metricDetails) {
      console.log('SectionCard: No metric details available for form initialization');
      return undefined;
    }

    console.log('SectionCard: Converting metric details to form data:', {
      metricType: metricDetails.metricType,
      dataPointsLength: metricDetails.dataPoints?.length || 0,
      dataPoints: metricDetails.dataPoints
    });

    const formData = {
      name: metricDetails.base.name,
      display_name: metricDetails.base.display_name,
      description: metricDetails.base.description,
      size_config: getSafeSize(metricDetails.base.size_config),
      sort_order: metricDetails.base.sort_order,
      is_active: metricDetails.base.is_active,
      metric_type: metricDetails.metricType,
      single_value: metricDetails.metricType === 'single_value' ? metricDetails.typeSpecificData : undefined,
      multi_value: metricDetails.metricType === 'multi_value' ? metricDetails.typeSpecificData : undefined,
      time_based: metricDetails.metricType === 'time_based' ? metricDetails.typeSpecificData : undefined,
      data_points: metricDetails.dataPoints || []
    };

    console.log('SectionCard: Form data prepared:', {
      metricType: formData.metric_type,
      dataPointsCount: formData.data_points.length,
      timeBasedConfig: formData.time_based
    });

    return formData;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{section.display_name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={section.is_active ? "default" : "secondary"}>
              {section.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline">
              {section.cockpit_metrics.length} metrics
            </Badge>
          </div>
        </div>
        {section.description && (
          <p className="text-sm text-gray-600">{section.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Show edit form if editing */}
        {editingMetricId && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Edit Metric</h3>
            {isLoadingDetails ? (
              <div>Loading metric details...</div>
            ) : metricDetails ? (
              <MetricForm
                sectionId={section.id}
                initialData={getInitialFormData()}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                isEdit={true}
              />
            ) : (
              <div>Error loading metric details</div>
            )}
          </div>
        )}

        {/* Metric cards */}
        {section.cockpit_metrics.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No metrics in this section yet.
          </div>
        ) : (
          <div className="grid gap-2">
            {section.cockpit_metrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                onDelete={onDeleteMetric}
                onEdit={handleEditMetric}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SectionCard;
