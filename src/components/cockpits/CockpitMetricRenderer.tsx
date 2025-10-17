
import React from "react";
import { MetricDisplay, MultiValueMetricDisplay, TimeBasedMetricDisplay, SingleValueMetricDisplay } from "@/types/metrics";
import { CockpitMetric } from "@/types/cockpit";
import MultiValueCard from "./MultiValueCard";
import TimeBasedMetricCard from "./TimeBasedMetricCard";
import SingleValueCard from "./SingleValueCard";

interface CockpitMetricRendererProps {
  metric: MetricDisplay;
}

export const CockpitMetricRenderer: React.FC<CockpitMetricRendererProps> = ({ metric }) => {
  console.log('Rendering metric card:', {
    metricId: metric.id,
    metricType: metric.metric_type,
    metricName: metric.display_name,
    sizeConfig: metric.size_config
  });

  try {
    // Use the appropriate card component based on metric type
    if (metric.metric_type === 'multi_value') {
      console.log('Rendering MultiValueCard for metric:', metric.id);
      return <MultiValueCard metric={metric as MultiValueMetricDisplay} sizeConfig={metric.size_config} />;
    } else if (metric.metric_type === 'time_based') {
      console.log('Rendering TimeBasedMetricCard for metric:', metric.id);
      return <TimeBasedMetricCard metric={metric as TimeBasedMetricDisplay} sizeConfig={metric.size_config} />;
    } else {
      console.log('Rendering SingleValueCard for metric:', metric.id);
      // Convert MetricDisplay to CockpitMetric format for SingleValueCard
      const singleValueMetric = metric as SingleValueMetricDisplay;
      const cockpitMetric: CockpitMetric = {
        id: metric.id,
        section_id: metric.section_id,
        name: metric.name,
        display_name: metric.display_name,
        description: metric.description,
        metric_type: singleValueMetric.single_value_data.metric_type,
        metric_data_type: 'single',
        current_value: singleValueMetric.single_value_data.actual_value?.toString(),
        target_value: singleValueMetric.single_value_data.target_value?.toString(),
        trend: singleValueMetric.single_value_data.trend,
        sort_order: metric.sort_order,
        is_active: metric.is_active,
        size_config: metric.size_config,
        icon: (metric as any).icon,
        color_class: (metric as any).color_class,
        created_at: metric.created_at,
        updated_at: metric.updated_at
      };
      return <SingleValueCard metric={cockpitMetric} isLarge={metric.size_config === 'large' || metric.size_config === 'xl'} />;
    }
  } catch (error) {
    console.error('Error rendering metric card:', error);
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <p className="text-red-600 text-sm">Error loading metric: {metric.display_name}</p>
      </div>
    );
  }
};
