
import { MetricMultiValueData, MetricTimeBasedData } from "@/types/metrics";

export interface DemoDataPoint {
  name: string;
  value: number;
  timestamp?: string;
  metadata?: any;
}

export const generateSingleValueDemo = (metricType: string): number => {
  switch (metricType) {
    case 'currency':
      return Math.floor(Math.random() * 100000) + 10000; // $10k - $110k
    case 'percentage':
      return Math.floor(Math.random() * 100); // 0-100%
    default:
      return Math.floor(Math.random() * 1000) + 100; // 100-1100
  }
};

export const generateMultiValueData = (
  chartType: string = 'bar',
  categories: number = 6,
  seriesCount: number = 1
): MetricMultiValueData[] => {
  const result: MetricMultiValueData[] = [];
  const seriesColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const seriesNames = ['Series A', 'Series B', 'Series C', 'Series D', 'Series E', 'Series F'];
  
  for (let i = 0; i < categories; i++) {
    for (let s = 0; s < seriesCount; s++) {
      let value: number;
      
      switch (chartType) {
        case 'pie':
        case 'doughnut':
        case 'polar_area':
          // For pie/doughnut charts, values should sum to a reasonable amount
          value = Math.floor(Math.random() * 30) + 5;
          break;
        case 'gauge':
        case 'bullet':
          // For gauges, values are typically percentages
          value = Math.floor(Math.random() * 100);
          break;
        case 'radar':
          // For radar charts, values are often on a similar scale
          value = Math.floor(Math.random() * 80) + 20;
          break;
        default:
          // For most other charts
          value = Math.floor(Math.random() * 1000) + 100;
      }
      
      result.push({
        id: `demo-${i}-${s}`,
        multi_value_metric_id: '',
        x_axis_value: `Category ${i + 1}`,
        y_axis_value: value,
        series_name: seriesCount > 1 ? seriesNames[s] : 'Series 1',
        series_color: seriesColors[s % seriesColors.length],
        sort_order: i,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }
  
  return result;
};

export const generateTimeBasedData = (
  timeGranularity: 'day' | 'week' | 'month' | 'quarter' | 'year', 
  periods: number = 12,
  seriesCount: number = 1
): MetricTimeBasedData[] => {
  const result: MetricTimeBasedData[] = [];
  const seriesColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const seriesNames = ['Series A', 'Series B', 'Series C', 'Series D', 'Series E', 'Series F'];
  const now = new Date();
  
  for (let s = 0; s < seriesCount; s++) {
    for (let i = 0; i < periods; i++) {
      const date = new Date();
      let year = now.getFullYear();
      let quarter: number | undefined = undefined;
      let month: number | undefined = undefined;
      let day: number | undefined = undefined;
      let week: number | undefined = undefined;
      
      switch (timeGranularity) {
        case 'day':
          date.setDate(now.getDate() - (periods - 1) + i);
          year = date.getFullYear();
          month = date.getMonth() + 1;
          day = date.getDate();
          break;
        case 'week':
          date.setDate(now.getDate() - (periods - 1) * 7 + i * 7);
          year = date.getFullYear();
          week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
          break;
        case 'month':
          date.setMonth(now.getMonth() - (periods - 1) + i);
          year = date.getFullYear();
          month = date.getMonth() + 1;
          break;
        case 'quarter':
          date.setMonth(now.getMonth() - (periods - 1) * 3 + i * 3);
          year = date.getFullYear();
          quarter = Math.floor((date.getMonth() / 3) + 1);
          break;
        case 'year':
          year = now.getFullYear() - (periods - 1) + i;
          break;
      }
      
      // Generate a value with a general upward trend and some randomness
      const baseValue = 500;
      const trendComponent = i * (20 + Math.random() * 10);
      const randomComponent = (Math.random() - 0.5) * 100;
      const value = Math.max(0, baseValue + trendComponent + randomComponent);
      
      result.push({
        id: `demo-${i}-${s}`,
        time_metric_id: '',
        year,
        quarter,
        month,
        week,
        day,
        value: Math.round(value),
        series_name: seriesCount > 1 ? seriesNames[s] : 'Series 1',
        series_color: seriesColors[s % seriesColors.length],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }
  
  return result;
};

// Helper function to prepare data for creating a new single value metric
export const prepareSingleValueMetricData = (
  sectionId: string, 
  name: string, 
  displayName: string, 
  description: string,
  metricType: 'number' | 'percentage' | 'currency'
) => {
  const actual = generateSingleValueDemo(metricType);
  const target = actual * (Math.random() < 0.5 ? 0.8 : 1.2); // Either above or below target
  
  return {
    base: {
      section_id: sectionId,
      name,
      display_name: displayName,
      description,
      size_config: 'medium',
      sort_order: 0,
      is_active: true
    },
    metricType: 'single_value',
    singleValue: {
      metric_type: metricType,
      actual_value: actual,
      target_value: target,
      trend: actual >= target ? 'up' : 'down'
    }
  };
};

// Helper function to prepare data for creating a new multi value metric
export const prepareMultiValueMetricData = (
  sectionId: string, 
  name: string, 
  displayName: string, 
  description: string,
  chartType: string = 'bar',
  categories: number = 6,
  seriesCount: number = 1
) => {
  return {
    base: {
      section_id: sectionId,
      name,
      display_name: displayName,
      description,
      size_config: 'medium',
      sort_order: 0,
      is_active: true
    },
    metricType: 'multi_value',
    multiValue: {
      chart_type: chartType,
      x_axis_label: 'Category',
      y_axis_label: 'Value',
      allow_multiple_series: seriesCount > 1
    },
    dataPoints: generateMultiValueData(chartType, categories, seriesCount)
  };
};

// Helper function to prepare data for creating a new time-based metric
export const prepareTimeBasedMetricData = (
  sectionId: string, 
  name: string, 
  displayName: string, 
  description: string,
  chartType: string = 'line',
  timeGranularity: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month',
  periods: number = 12,
  seriesCount: number = 1
) => {
  return {
    base: {
      section_id: sectionId,
      name,
      display_name: displayName,
      description,
      size_config: 'medium',
      sort_order: 0,
      is_active: true
    },
    metricType: 'time_based',
    timeBased: {
      chart_type: chartType,
      time_granularity: timeGranularity,
      y_axis_label: 'Value',
      allow_multiple_series: seriesCount > 1
    },
    dataPoints: generateTimeBasedData(timeGranularity, periods, seriesCount)
  };
};
