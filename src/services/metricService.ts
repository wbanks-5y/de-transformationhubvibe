import { supabase } from '@/integrations/supabase/client';
import { 
  MetricBase, 
  MetricSingleValue, 
  MetricMultiValue,
  MetricMultiValueData,
  MetricTimeBased,
  MetricTimeBasedData,
  MetricDisplay,
  SingleValueMetricDisplay,
  MultiValueMetricDisplay,
  TimeBasedMetricDisplay
} from '@/types/metrics';

export const createSingleValueMetric = async (
  base: Omit<MetricBase, 'id' | 'created_at' | 'updated_at'>,
  singleValue: Omit<MetricSingleValue, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>
) => {
  console.log('metricService: Creating single value metric with base:', base, 'singleValue:', singleValue);
  
  try {
    // Validate required fields
    if (!base.name || !base.display_name || !base.section_id) {
      const error = new Error('Missing required base fields: name, display_name, or section_id');
      console.error('metricService: Validation error:', error.message);
      console.error('metricService: Base data received:', base);
      throw error;
    }

    if (!singleValue.metric_type) {
      const error = new Error('Missing required single value field: metric_type');
      console.error('metricService: Validation error:', error.message);
      console.error('metricService: Single value data received:', singleValue);
      throw error;
    }

    // Create base metric
    console.log('metricService: Attempting to insert base metric with data:', base);
    const { data: baseMetric, error: baseError } = await supabase
      .from('metric_base')
      .insert(base)
      .select()
      .single();
      
    if (baseError) {
      console.error('metricService: Database error creating base metric:', baseError);
      console.error('metricService: Error code:', baseError.code);
      console.error('metricService: Error message:', baseError.message);
      console.error('metricService: Error details:', baseError.details);
      console.error('metricService: Error hint:', baseError.hint);
      console.error('metricService: Insert data that failed:', base);
      
      // Check for specific error types
      if (baseError.code === '23505') {
        throw new Error(`A metric with the name "${base.name}" already exists in this section`);
      } else if (baseError.code === '23503') {
        throw new Error(`Invalid section ID: ${base.section_id}. The section may not exist.`);
      } else if (baseError.code === '23502') {
        throw new Error(`Missing required field: ${baseError.message}`);
      } else {
        throw new Error(`Database error creating base metric: ${baseError.message} (Code: ${baseError.code})`);
      }
    }
    
    if (!baseMetric) {
      console.error('metricService: No base metric returned from insert');
      throw new Error('No base metric returned from database - insert may have failed silently');
    }
    
    console.log('metricService: Base metric created successfully:', baseMetric);
    
    // Create single value data
    console.log('metricService: Attempting to insert single value data...');
    const singleValuePayload = {
      ...singleValue,
      base_metric_id: baseMetric.id
    };
    console.log('metricService: Single value payload:', singleValuePayload);
    
    const { data: singleValueData, error: singleValueError } = await supabase
      .from('metric_single_value')
      .insert(singleValuePayload)
      .select()
      .single();
      
    if (singleValueError) {
      console.error('metricService: Database error creating single value data:', singleValueError);
      console.error('metricService: Error code:', singleValueError.code);
      console.error('metricService: Error message:', singleValueError.message);
      console.error('metricService: Error details:', singleValueError.details);
      console.error('metricService: Error hint:', singleValueError.hint);
      console.error('metricService: Insert data that failed:', singleValuePayload);
      
      // Clean up the base metric if single value creation fails
      try {
        await supabase.from('metric_base').delete().eq('id', baseMetric.id);
        console.log('metricService: Cleaned up base metric after single value creation failure');
      } catch (cleanupError) {
        console.error('metricService: Failed to clean up base metric:', cleanupError);
      }
      
      throw new Error(`Failed to create single value data: ${singleValueError.message} (Code: ${singleValueError.code})`);
    }
    
    if (!singleValueData) {
      console.error('metricService: No single value data returned from insert');
      // Clean up the base metric
      try {
        await supabase.from('metric_base').delete().eq('id', baseMetric.id);
        console.log('metricService: Cleaned up base metric after no single value data returned');
      } catch (cleanupError) {
        console.error('metricService: Failed to clean up base metric:', cleanupError);
      }
      throw new Error('No single value data returned from database - insert may have failed silently');
    }
    
    console.log('metricService: Single value data created successfully:', singleValueData);
    
    const result = {
      ...baseMetric,
      metric_type: 'single_value',
      single_value_data: singleValueData
    };
    
    console.log('metricService: Successfully completed single value metric creation, returning:', result);
    return result;
  } catch (error) {
    console.error('metricService: Unexpected error in createSingleValueMetric:', error);
    console.error('metricService: Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('metricService: Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('metricService: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
};

export const createMultiValueMetric = async (
  base: Omit<MetricBase, 'id' | 'created_at' | 'updated_at'>,
  multiValue: Omit<MetricMultiValue, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>,
  dataPoints?: any[]
) => {
  console.log('metricService: Starting createMultiValueMetric with base:', base, 'multiValue:', multiValue, 'dataPoints:', dataPoints);
  
  try {
    // Create base metric
    console.log('metricService: Creating base metric...');
    const { data: baseMetric, error: baseError } = await supabase
      .from('metric_base')
      .insert(base)
      .select()
      .single();
      
    if (baseError) {
      console.error('metricService: Error creating base metric:', baseError);
      throw baseError;
    }
    
    console.log('metricService: Base metric created successfully:', baseMetric);
    
    // Create multi value data
    console.log('metricService: Creating multi value data...');
    const { data: multiValueData, error: multiValueError } = await supabase
      .from('metric_multi_value')
      .insert({
        ...multiValue,
        base_metric_id: baseMetric.id
      })
      .select()
      .single();
      
    if (multiValueError) {
      console.error('metricService: Error creating multi value data:', multiValueError);
      throw multiValueError;
    }
    
    console.log('metricService: Multi value data created successfully:', multiValueData);
    
    // Create data points if provided
    if (dataPoints && dataPoints.length > 0) {
      console.log('metricService: Creating', dataPoints.length, 'data points...');
      const formattedDataPoints = dataPoints.map(point => ({
        multi_value_metric_id: multiValueData.id,
        x_axis_value: point.x_axis_value,
        y_axis_value: point.y_axis_value,
        series_name: point.series_name,
        series_color: point.series_color,
        sort_order: point.sort_order
      }));

      console.log('metricService: Formatted data points:', formattedDataPoints);

      const { data: insertedDataPoints, error: dataPointsError } = await supabase
        .from('metric_multi_value_data')
        .insert(formattedDataPoints)
        .select();
        
      if (dataPointsError) {
        console.error('metricService: Error creating data points:', dataPointsError);
        throw dataPointsError;
      }
      
      console.log('metricService: Data points created successfully:', insertedDataPoints);
    } else {
      console.log('metricService: No data points to create');
    }
    
    const result = {
      ...baseMetric,
      metric_type: 'multi_value',
      multi_value_data: multiValueData
    };
    
    console.log('metricService: createMultiValueMetric completed successfully, returning:', result);
    return result;
  } catch (error) {
    console.error('metricService: Unexpected error in createMultiValueMetric:', error);
    console.error('metricService: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
};

export const createTimeBasedMetric = async (
  base: Omit<MetricBase, 'id' | 'created_at' | 'updated_at'>,
  timeBased: Omit<MetricTimeBased, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>,
  dataPoints?: any[]
) => {
  console.log('metricService: Starting createTimeBasedMetric with base:', base, 'timeBased:', timeBased, 'dataPoints:', dataPoints);
  
  try {
    // Validate required fields
    if (!base.name || !base.display_name || !base.section_id) {
      const error = new Error('Missing required base fields: name, display_name, or section_id');
      console.error('metricService: Validation error:', error.message);
      console.error('metricService: Base data received:', base);
      throw error;
    }

    if (!timeBased.chart_type || !timeBased.time_granularity) {
      const error = new Error('Missing required time-based fields: chart_type or time_granularity');
      console.error('metricService: Validation error:', error.message);
      console.error('metricService: Time-based data received:', timeBased);
      throw error;
    }

    // Create base metric
    console.log('metricService: Attempting to insert base metric with data:', base);
    const { data: baseMetric, error: baseError } = await supabase
      .from('metric_base')
      .insert(base)
      .select()
      .single();
      
    if (baseError) {
      console.error('metricService: Database error creating base metric:', baseError);
      console.error('metricService: Error code:', baseError.code);
      console.error('metricService: Error message:', baseError.message);
      console.error('metricService: Error details:', baseError.details);
      console.error('metricService: Error hint:', baseError.hint);
      console.error('metricService: Insert data that failed:', base);
      
      // Check for specific error types
      if (baseError.code === '23505') {
        throw new Error(`A metric with the name "${base.name}" already exists in this section`);
      } else if (baseError.code === '23503') {
        throw new Error(`Invalid section ID: ${base.section_id}. The section may not exist.`);
      } else if (baseError.code === '23502') {
        throw new Error(`Missing required field: ${baseError.message}`);
      } else {
        throw new Error(`Database error creating base metric: ${baseError.message} (Code: ${baseError.code})`);
      }
    }
    
    if (!baseMetric) {
      console.error('metricService: No base metric returned from insert');
      throw new Error('No base metric returned from database - insert may have failed silently');
    }
    
    console.log('metricService: Base metric created successfully:', baseMetric);
    
    // Create time based data
    console.log('metricService: Attempting to insert time-based data...');
    const timeBasedPayload = {
      ...timeBased,
      base_metric_id: baseMetric.id
    };
    console.log('metricService: Time-based payload:', timeBasedPayload);
    
    const { data: timeBasedData, error: timeBasedError } = await supabase
      .from('metric_time_based')
      .insert(timeBasedPayload)
      .select()
      .single();
      
    if (timeBasedError) {
      console.error('metricService: Database error creating time-based data:', timeBasedError);
      console.error('metricService: Error code:', timeBasedError.code);
      console.error('metricService: Error message:', timeBasedError.message);
      console.error('metricService: Error details:', timeBasedError.details);
      console.error('metricService: Error hint:', timeBasedError.hint);
      console.error('metricService: Insert data that failed:', timeBasedPayload);
      
      // Clean up the base metric if time-based creation fails
      try {
        await supabase.from('metric_base').delete().eq('id', baseMetric.id);
        console.log('metricService: Cleaned up base metric after time-based creation failure');
      } catch (cleanupError) {
        console.error('metricService: Failed to clean up base metric:', cleanupError);
      }
      
      throw new Error(`Failed to create time-based data: ${timeBasedError.message} (Code: ${timeBasedError.code})`);
    }
    
    if (!timeBasedData) {
      console.error('metricService: No time-based data returned from insert');
      // Clean up the base metric
      try {
        await supabase.from('metric_base').delete().eq('id', baseMetric.id);
        console.log('metricService: Cleaned up base metric after no time-based data returned');
      } catch (cleanupError) {
        console.error('metricService: Failed to clean up base metric:', cleanupError);
      }
      throw new Error('No time-based data returned from database - insert may have failed silently');
    }
    
    console.log('metricService: Time-based data created successfully:', timeBasedData);
    
    // Create data points if provided
    if (dataPoints && dataPoints.length > 0) {
      console.log('metricService: Creating time-based data points:', dataPoints.length);
      const formattedDataPoints = dataPoints.map((point, index) => {
        const formatted = {
          time_metric_id: timeBasedData.id,
          year: point.year,
          quarter: point.quarter || null,
          month: point.month || null,
          week: point.week || null,
          day: point.day || null,
          value: point.value,
          series_name: point.series_name || 'Series 1',
          series_color: point.series_color || '#4F46E5'
        };
        console.log(`metricService: Formatted data point ${index + 1}:`, formatted);
        return formatted;
      });

      console.log('metricService: All formatted time-based data points:', formattedDataPoints);

      const { data: insertedDataPoints, error: dataPointsError } = await supabase
        .from('metric_time_based_data')
        .insert(formattedDataPoints)
        .select();
        
      if (dataPointsError) {
        console.error('metricService: Database error creating time-based data points:', dataPointsError);
        console.error('metricService: Error code:', dataPointsError.code);
        console.error('metricService: Error message:', dataPointsError.message);
        console.error('metricService: Error details:', dataPointsError.details);
        console.error('metricService: Error hint:', dataPointsError.hint);
        console.error('metricService: Insert data that failed:', formattedDataPoints);
        
        // Clean up created records
        try {
          await supabase.from('metric_time_based').delete().eq('id', timeBasedData.id);
          await supabase.from('metric_base').delete().eq('id', baseMetric.id);
          console.log('metricService: Cleaned up created records after data points creation failure');
        } catch (cleanupError) {
          console.error('metricService: Failed to clean up created records:', cleanupError);
        }
        
        throw new Error(`Failed to create time-based data points: ${dataPointsError.message} (Code: ${dataPointsError.code})`);
      }
      
      console.log('metricService: Time-based data points created successfully:', insertedDataPoints);
    } else {
      console.log('metricService: No data points to create');
    }
    
    const result = {
      ...baseMetric,
      metric_type: 'time_based',
      time_based_data: timeBasedData
    };
    
    console.log('metricService: Successfully completed time-based metric creation, returning:', result);
    return result;
  } catch (error) {
    console.error('metricService: Unexpected error in createTimeBasedMetric:', error);
    console.error('metricService: Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('metricService: Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('metricService: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
};

export const updateBaseMetric = async (id: string, updates: Partial<MetricBase>) => {
  const { data, error } = await supabase
    .from('metric_base')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateSingleValueMetric = async (baseMetricId: string, updates: Partial<MetricSingleValue>) => {
  // First, find the single value record using the base_metric_id
  const { data: singleValueRecord, error: findError } = await supabase
    .from('metric_single_value')
    .select('id')
    .eq('base_metric_id', baseMetricId)
    .single();
    
  if (findError) {
    console.error('Error finding single value record:', findError);
    throw findError;
  }
  
  if (!singleValueRecord) {
    throw new Error('Single value record not found for base metric ID: ' + baseMetricId);
  }
  
  // Now update the single value record
  const { data, error } = await supabase
    .from('metric_single_value')
    .update(updates)
    .eq('id', singleValueRecord.id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteMetric = async (id: string) => {
  const { error } = await supabase
    .from('metric_base')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return id;
};

export const addMultiValueDataPoint = async (
  metricId: string, 
  dataPoint: Omit<MetricMultiValueData, 'id' | 'multi_value_metric_id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('metric_multi_value_data')
    .insert({
      ...dataPoint,
      multi_value_metric_id: metricId
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateMultiValueDataPoint = async (id: string, updates: Partial<MetricMultiValueData>) => {
  const { data, error } = await supabase
    .from('metric_multi_value_data')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteMultiValueDataPoint = async (id: string) => {
  const { error } = await supabase
    .from('metric_multi_value_data')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return id;
};

export const addTimeBasedDataPoint = async (
  metricId: string, 
  dataPoint: Omit<MetricTimeBasedData, 'id' | 'time_metric_id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('metric_time_based_data')
    .insert({
      ...dataPoint,
      time_metric_id: metricId
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateTimeBasedDataPoint = async (id: string, updates: Partial<MetricTimeBasedData>) => {
  const { data, error } = await supabase
    .from('metric_time_based_data')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteTimeBasedDataPoint = async (id: string) => {
  const { error } = await supabase
    .from('metric_time_based_data')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return id;
};
