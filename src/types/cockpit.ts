export interface CockpitType {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  icon?: string;
  color_class?: string;
  route_path: string;
  cockpit_description?: string;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CockpitSection {
  id: string;
  cockpit_type_id: string;
  name: string;
  display_name: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CockpitMetric {
  id: string;
  section_id: string;
  name: string;
  display_name: string;
  description?: string;
  metric_type: 'number' | 'percentage' | 'currency' | 'chart';
  metric_data_type: 'single' | 'multi_value' | 'time_based';
  current_value?: string;
  target_value?: string;
  trend?: 'up' | 'down' | 'stable';
  data_config?: any;
  sort_order?: number;
  is_active?: boolean;
  size_config?: 'small' | 'medium' | 'large' | 'xl';
  icon?: string;
  color_class?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MetricData {
  id: string;
  metric_id: string;
  label: string;
  value: number;
  valid_from?: string;
  valid_to?: string;
  metadata?: any;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CockpitInsight {
  id: string;
  cockpit_type_id?: string;
  title: string;
  description: string;
  insight_type: 'positive' | 'negative' | 'neutral' | 'warning';
  priority: 'low' | 'medium' | 'high';
  insight_category?: string;
  confidence_score?: number;
  source_data_ids?: any;
  insight_data?: any;
  is_active?: boolean;
  expires_at?: string;
  generated_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Enhanced KPI interface with simplified data types
export interface CockpitKPI {
  id: string;
  cockpit_type_id: string;
  name: string;
  display_name: string;
  description?: string;
  kpi_data_type: 'single' | 'time_based';
  format_type: 'number' | 'percentage' | 'currency';
  format_options?: {
    // General formatting
    decimal_places?: number;
    currency_code?: string;
    [key: string]: any;
  };
  trend_direction: 'higher_is_better' | 'lower_is_better' | 'neutral';
  icon?: string;
  color_class?: string;
  size_config: 'small' | 'medium' | 'large' | 'xl';
  weight?: number;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Interface for single KPI values
export interface CockpitKPIValue {
  id: string;
  kpi_id: string;
  current_value: number;
  notes?: string;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

// Interface for time-based KPI values
export interface CockpitKPITimeBased {
  id: string;
  kpi_id: string;
  period_start: string;
  period_end: string;
  period_type: 'year' | 'quarter' | 'month' | 'week' | 'day';
  actual_value: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// New interface for multi-value KPI data points
export interface CockpitKPIMultiValueData {
  id: string;
  kpi_id: string;
  x_axis_value: string;
  y_axis_value: number;
  series_name: string;
  series_color: string;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

// Interface for KPI targets
export interface CockpitKPITarget {
  id: string;
  kpi_id: string;
  target_type: 'single' | 'time_based';
  target_value: number;
  period_start?: string;
  period_end?: string;
  period_type?: 'year' | 'quarter' | 'month' | 'week' | 'day';
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CockpitFilter {
  id: string;
  cockpit_type_id?: string;
  name: string;
  filter_type: string;
  filter_config: any;
  is_default?: boolean;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
