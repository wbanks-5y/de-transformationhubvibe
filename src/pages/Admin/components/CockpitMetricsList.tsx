
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useCockpitData } from "@/hooks/use-cockpit-data";
import { useDeleteCockpitMetric } from "@/hooks/use-cockpit-metric-management";

interface CockpitMetricsListProps {
  sectionId: string;
  cockpitId?: string;
}

const CockpitMetricsList: React.FC<CockpitMetricsListProps> = ({ sectionId, cockpitId }) => {
  const { data: cockpitData, isLoading } = useCockpitData(cockpitId || '');
  const deleteMetric = useDeleteCockpitMetric();

  console.log('CockpitMetricsList - sectionId:', sectionId);
  console.log('CockpitMetricsList - cockpitId:', cockpitId);
  console.log('CockpitMetricsList - cockpitData:', cockpitData);

  // Find the section and its metrics
  const section = cockpitData?.sections?.find(s => s.id === sectionId);
  const metrics = section?.cockpit_metrics || [];

  console.log('CockpitMetricsList - section found:', section);
  console.log('CockpitMetricsList - metrics:', metrics);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this metric?')) {
      await deleteMetric.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  if (!cockpitId) {
    return <div className="text-center py-8 text-gray-500">No cockpit selected.</div>;
  }

  if (!section) {
    return <div className="text-center py-8 text-gray-500">Section not found.</div>;
  }

  if (metrics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No metrics found for this section.</p>
        <p className="text-sm mt-2">Use the "Add New Metric" button to create metrics for this section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {metrics.map((metric) => (
        <div key={metric.id} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{metric.display_name}</h3>
                <Badge variant={metric.is_active ? 'default' : 'secondary'}>
                  {metric.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline">{metric.metric_type}</Badge>
              </div>
              {metric.description && (
                <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
              )}
              <div className="flex gap-4 text-xs text-gray-500 mt-2">
                <span>Size: {metric.size_config}</span>
                <span>Sort: {metric.sort_order}</span>
                {metric.metric_type && <span>Type: {metric.metric_type}</span>}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(metric.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CockpitMetricsList;
