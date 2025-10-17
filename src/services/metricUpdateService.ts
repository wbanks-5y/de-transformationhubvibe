
import { supabase } from '@/integrations/supabase/client';
import { 
  MetricBase,
  MetricSingleValue,
  MetricMultiValue,
  MetricTimeBased
} from '@/types/metrics';

export const updateMetricBase = async (
  id: string, 
  updates: Partial<Omit<MetricBase, 'id' | 'created_at' | 'updated_at'>>
) => {
  console.log('metricUpdateService: updateMetricBase called with:', { id, updates });
  
  const { data, error } = await supabase
    .from('metric_base')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('metricUpdateService: Error updating metric base:', error);
    throw error;
  }
  
  console.log('metricUpdateService: Metric base updated successfully:', data);
  return data;
};

export const updateSingleValueMetric = async (
  baseMetricId: string,
  updates: Partial<Omit<MetricSingleValue, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>>
) => {
  console.log('metricUpdateService: updateSingleValueMetric called with:', { baseMetricId, updates });
  
  const { data, error } = await supabase
    .from('metric_single_value')
    .update(updates)
    .eq('base_metric_id', baseMetricId)
    .select()
    .single();
    
  if (error) {
    console.error('metricUpdateService: Error updating single value metric:', error);
    throw error;
  }
  
  console.log('metricUpdateService: Single value metric updated successfully:', data);
  return data;
};

export const updateMultiValueMetric = async (
  baseMetricId: string,
  config: Partial<Omit<MetricMultiValue, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>>,
  dataPoints?: any[]
) => {
  console.log('metricUpdateService: updateMultiValueMetric called with:', { baseMetricId, config, dataPoints });
  
  // Update the multi value configuration
  const { data: configData, error: configError } = await supabase
    .from('metric_multi_value')
    .update(config)
    .eq('base_metric_id', baseMetricId)
    .select()
    .single();
    
  if (configError) {
    console.error('metricUpdateService: Error updating multi value config:', configError);
    throw configError;
  }
  
  // If data points are provided, replace them
  if (dataPoints && configData) {
    // Delete existing data points
    const { error: deleteError } = await supabase
      .from('metric_multi_value_data')
      .delete()
      .eq('multi_value_metric_id', configData.id);
      
    if (deleteError) {
      console.error('metricUpdateService: Error deleting old data points:', deleteError);
      throw deleteError;
    }
    
    // Insert new data points
    if (dataPoints.length > 0) {
      const dataPointsWithMetricId = dataPoints.map(point => ({
        ...point,
        multi_value_metric_id: configData.id
      }));
      
      const { error: insertError } = await supabase
        .from('metric_multi_value_data')
        .insert(dataPointsWithMetricId);
        
      if (insertError) {
        console.error('metricUpdateService: Error inserting new data points:', insertError);
        throw insertError;
      }
    }
  }
  
  console.log('metricUpdateService: Multi value metric updated successfully:', configData);
  return configData;
};

export const updateTimeBasedMetric = async (
  baseMetricId: string,
  config: Partial<Omit<MetricTimeBased, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>>,
  dataPoints?: any[]
) => {
  console.log('metricUpdateService: updateTimeBasedMetric called with:', { baseMetricId, config, dataPoints });
  
  // Update the time based configuration
  const { data: configData, error: configError } = await supabase
    .from('metric_time_based')
    .update(config)
    .eq('base_metric_id', baseMetricId)
    .select()
    .single();
    
  if (configError) {
    console.error('metricUpdateService: Error updating time based config:', configError);
    throw configError;
  }
  
  // If data points are provided, replace them
  if (dataPoints && configData) {
    // Delete existing data points
    const { error: deleteError } = await supabase
      .from('metric_time_based_data')
      .delete()
      .eq('time_metric_id', configData.id);
      
    if (deleteError) {
      console.error('metricUpdateService: Error deleting old data points:', deleteError);
      throw deleteError;
    }
    
    // Insert new data points
    if (dataPoints.length > 0) {
      const dataPointsWithMetricId = dataPoints.map(point => ({
        ...point,
        time_metric_id: configData.id
      }));
      
      const { error: insertError } = await supabase
        .from('metric_time_based_data')
        .insert(dataPointsWithMetricId);
        
      if (insertError) {
        console.error('metricUpdateService: Error inserting new data points:', insertError);
        throw insertError;
      }
    }
  }
  
  console.log('metricUpdateService: Time based metric updated successfully:', configData);
  return configData;
};
