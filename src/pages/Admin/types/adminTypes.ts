
import { CockpitType, CockpitSection, CockpitKPI, CockpitMetric } from '@/types/cockpit';
import { MetricDisplay } from '@/types/metrics';

export interface CockpitManagementState {
  selectedCockpit: string;
  setSelectedCockpit: (id: string) => void;
  selectedSection: string;
  setSelectedSection: (id: string) => void;
  activeTab: 'cockpits' | 'sections' | 'metrics' | 'kpis' | 'insights';
  setActiveTab: React.Dispatch<React.SetStateAction<'cockpits' | 'sections' | 'metrics' | 'kpis' | 'insights'>>;
  showCockpitForm: boolean;
  setShowCockpitForm: (show: boolean) => void;
  showSectionForm: boolean;
  setShowSectionForm: (show: boolean) => void;
  showKPIForm: boolean;
  setShowKPIForm: (show: boolean) => void;
  showMetricForm: boolean;
  setShowMetricForm: (show: boolean) => void;
}

// Utility functions for type conversion
export const convertMetricDisplayToCockpitMetric = (metric: MetricDisplay): CockpitMetric => {
  return {
    id: metric.id,
    section_id: metric.section_id,
    name: metric.name,
    display_name: metric.display_name,
    description: metric.description,
    metric_type: metric.metric_type === 'single_value' ? 'number' : 'chart',
    metric_data_type: metric.metric_type === 'single_value' ? 'single' : 
                     metric.metric_type === 'multi_value' ? 'multi_value' : 'time_based',
    current_value: metric.metric_type === 'single_value' ? (metric as any).single_value_data?.actual_value?.toString() : '',
    target_value: metric.metric_type === 'single_value' ? (metric as any).single_value_data?.target_value?.toString() : '',
    trend: metric.metric_type === 'single_value' ? (metric as any).single_value_data?.trend : 'stable',
    sort_order: metric.sort_order,
    is_active: metric.is_active,
    size_config: metric.size_config,
    icon: (metric as any).icon,
    color_class: (metric as any).color_class,
    created_at: metric.created_at,
    updated_at: metric.updated_at
  };
};

export const convertCockpitMetricUpdatesToMetricDisplay = (updates: Partial<CockpitMetric>): any => {
  const metricDisplayUpdates: any = {};
  
  if (updates.name !== undefined) metricDisplayUpdates.name = updates.name;
  if (updates.display_name !== undefined) metricDisplayUpdates.display_name = updates.display_name;
  if (updates.description !== undefined) metricDisplayUpdates.description = updates.description;
  if (updates.size_config !== undefined) metricDisplayUpdates.size_config = updates.size_config;
  if (updates.sort_order !== undefined) metricDisplayUpdates.sort_order = updates.sort_order;
  if (updates.is_active !== undefined) metricDisplayUpdates.is_active = updates.is_active;
  
  return metricDisplayUpdates;
};
