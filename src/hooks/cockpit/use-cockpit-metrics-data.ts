
import { SupabaseClient } from '@supabase/supabase-js';
import { MetricDisplay } from '@/types/metrics';
import type { Database } from '@/integrations/supabase/types';

export const useCockpitMetricsData = () => {
  const transformMetricsData = async (
    sectionId: string,
    client: SupabaseClient<Database>
  ): Promise<MetricDisplay[]> => {
    // Get base metrics and their related data
    const { data: baseMetrics, error: metricsError } = await client
      .from('metric_base')
      .select(`
        *,
        metric_single_value (*),
        metric_multi_value (
          *,
          metric_multi_value_data (*)
        ),
        metric_time_based (
          *,
          metric_time_based_data (*)
        )
      `)
      .eq('section_id', sectionId)
      .eq('is_active', true)
      .order('sort_order');
    
    if (metricsError) {
      console.error('Error fetching metrics for section:', sectionId, metricsError);
      return [];
    }

    // Transform the metrics to the MetricDisplay format
    const metrics: MetricDisplay[] = (baseMetrics || []).map(baseMetric => {
      const sizeConfig = (['small', 'medium', 'large', 'xl'].includes(baseMetric.size_config)) 
        ? baseMetric.size_config as 'small' | 'medium' | 'large' | 'xl'
        : 'medium';

      if (baseMetric.metric_single_value && baseMetric.metric_single_value.length > 0) {
        const singleValueData = baseMetric.metric_single_value[0];
        return {
          ...baseMetric,
          size_config: sizeConfig,
          metric_type: 'single_value' as const,
          single_value_data: {
            ...singleValueData,
            metric_type: (['number', 'percentage', 'currency'].includes(singleValueData.metric_type)) 
              ? singleValueData.metric_type as 'number' | 'percentage' | 'currency'
              : 'number',
            trend: (['up', 'down', 'stable'].includes(singleValueData.trend)) 
              ? singleValueData.trend as 'up' | 'down' | 'stable'
              : 'stable',
            actual_value: singleValueData.actual_value || 0,
            target_value: singleValueData.target_value || 0,
            base_metric_id: singleValueData.base_metric_id || baseMetric.id,
            created_at: singleValueData.created_at || new Date().toISOString(),
            updated_at: singleValueData.updated_at || new Date().toISOString()
          }
        };
      } else if (baseMetric.metric_multi_value && baseMetric.metric_multi_value.length > 0) {
        const multiValueData = baseMetric.metric_multi_value[0];
        return {
          ...baseMetric,
          size_config: sizeConfig,
          metric_type: 'multi_value' as const,
          multi_value_data: {
            ...multiValueData,
            chart_type: (['bar', 'horizontal_bar', 'stacked_bar', 'grouped_bar', 'line', 'area', 'stacked_area', 'stepped_line', 'smooth_line', 'pie', 'doughnut', 'polar_area', 'radar', 'scatter', 'bubble', 'funnel', 'waterfall', 'treemap', 'sunburst', 'gauge', 'bullet', 'heatmap', 'sankey', 'histogram'].includes(multiValueData.chart_type))
              ? multiValueData.chart_type as 'bar' | 'horizontal_bar' | 'stacked_bar' | 'grouped_bar' | 'line' | 'area' | 'stacked_area' | 'stepped_line' | 'smooth_line' | 'pie' | 'doughnut' | 'polar_area' | 'radar' | 'scatter' | 'bubble' | 'funnel' | 'waterfall' | 'treemap' | 'sunburst' | 'gauge' | 'bullet' | 'heatmap' | 'sankey' | 'histogram'
              : 'bar'
          },
          data_points: multiValueData.metric_multi_value_data || []
        };
      } else if (baseMetric.metric_time_based && baseMetric.metric_time_based.length > 0) {
        const timeBasedData = baseMetric.metric_time_based[0];
        return {
          ...baseMetric,
          size_config: sizeConfig,
          metric_type: 'time_based' as const,
          time_based_data: {
            ...timeBasedData,
            chart_type: (['line', 'area', 'stacked_area', 'stepped_line', 'smooth_line', 'bar', 'stacked_bar', 'waterfall', 'scatter', 'bubble', 'candlestick', 'ohlc', 'heatmap', 'calendar_heatmap', 'stream_graph'].includes(timeBasedData.chart_type))
              ? timeBasedData.chart_type as 'line' | 'area' | 'stacked_area' | 'stepped_line' | 'smooth_line' | 'bar' | 'stacked_bar' | 'waterfall' | 'scatter' | 'bubble' | 'candlestick' | 'ohlc' | 'heatmap' | 'calendar_heatmap' | 'stream_graph'
              : 'line',
            time_granularity: (['day', 'week', 'month', 'quarter', 'year'].includes(timeBasedData.time_granularity))
              ? timeBasedData.time_granularity as 'day' | 'week' | 'month' | 'quarter' | 'year'
              : 'month'
          },
          data_points: timeBasedData.metric_time_based_data || []
        };
      }
      
      // Fallback to single_value if no specific type data found
      return {
        ...baseMetric,
        size_config: sizeConfig,
        metric_type: 'single_value' as const,
        single_value_data: {
          id: '',
          base_metric_id: baseMetric.id,
          metric_type: 'number' as const,
          actual_value: 0,
          target_value: 0,
          trend: 'stable' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
    });

    return metrics;
  };

  return { transformMetricsData };
};
