
// Base metric interface
export interface MetricBase {
  id: string;
  section_id: string;
  name: string;
  display_name: string;
  description?: string;
  size_config: 'small' | 'medium' | 'large' | 'xl';
  sort_order: number;
  is_active: boolean;
  icon?: string;
  color_class?: string;
  created_at: string;
  updated_at: string;
}

// Single Value Metric
export interface MetricSingleValue {
  id: string;
  base_metric_id: string;
  metric_type: 'number' | 'percentage' | 'currency';
  actual_value?: number;
  target_value?: number;
  trend?: 'up' | 'down' | 'stable';
  created_at: string;
  updated_at: string;
}

// Multi Value Metric
export interface MetricMultiValue {
  id: string;
  base_metric_id: string;
  chart_type: 'bar' | 'horizontal_bar' | 'stacked_bar' | 'grouped_bar' | 'line' | 'area' | 'stacked_area' | 'stepped_line' | 'smooth_line' | 'pie' | 'doughnut' | 'polar_area' | 'radar' | 'scatter' | 'bubble' | 'funnel' | 'waterfall' | 'treemap' | 'sunburst' | 'gauge' | 'bullet' | 'heatmap' | 'sankey' | 'histogram';
  x_axis_label: string;
  y_axis_label: string;
  allow_multiple_series: boolean;
  created_at: string;
  updated_at: string;
}

// Multi Value Data Point
export interface MetricMultiValueData {
  id: string;
  multi_value_metric_id: string;
  x_axis_value: string;
  y_axis_value: number;
  series_name: string;
  series_color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Time Based Metric
export interface MetricTimeBased {
  id: string;
  base_metric_id: string;
  chart_type: 'line' | 'area' | 'stacked_area' | 'stepped_line' | 'smooth_line' | 'bar' | 'stacked_bar' | 'waterfall' | 'scatter' | 'bubble' | 'candlestick' | 'ohlc' | 'heatmap' | 'calendar_heatmap' | 'stream_graph';
  time_granularity: 'day' | 'week' | 'month' | 'quarter' | 'year';
  y_axis_label: string;
  allow_multiple_series: boolean;
  created_at: string;
  updated_at: string;
}

// Time Based Data Point
export interface MetricTimeBasedData {
  id: string;
  time_metric_id: string;
  year: number;
  quarter?: number;
  month?: number;
  week?: number;
  day?: number;
  date_value?: string;
  value: number;
  series_name: string;
  series_color: string;
  created_at: string;
  updated_at: string;
}

// Combined metric types for display
export interface SingleValueMetricDisplay extends MetricBase {
  metric_type: 'single_value';
  single_value_data: MetricSingleValue;
}

export interface MultiValueMetricDisplay extends MetricBase {
  metric_type: 'multi_value';
  multi_value_data: MetricMultiValue;
  data_points?: MetricMultiValueData[];
}

export interface TimeBasedMetricDisplay extends MetricBase {
  metric_type: 'time_based';
  time_based_data: MetricTimeBased;
  data_points?: MetricTimeBasedData[];
}

export type MetricDisplay = SingleValueMetricDisplay | MultiValueMetricDisplay | TimeBasedMetricDisplay;
