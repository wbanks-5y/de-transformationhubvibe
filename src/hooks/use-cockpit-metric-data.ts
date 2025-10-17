
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { MetricTimeBasedData, MetricMultiValueData } from '@/types/metrics';

export const useCockpitMetricData = (
  metricId?: string,
  metricType?: 'single' | 'multi_value' | 'time_based',
  startDate?: string,
  endDate?: string,
  limit?: number
) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['cockpit-metric-data', metricId, metricType, startDate, endDate, limit],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      if (!metricId || !metricType) {
        console.log('useCockpitMetricData: No metricId or metricType provided, returning empty array');
        return [];
      }

      console.log('useCockpitMetricData: Starting database query for metric data:', {
        metricId,
        metricType,
        startDate,
        endDate,
        limit
      });

      if (metricType === 'time_based') {
        // First, get the time-based metric ID from the base metric ID
        console.log('useCockpitMetricData: Querying metric_time_based table for base_metric_id:', metricId);
        
        const { data: timeBasedMetric, error: timeBasedError } = await organizationClient
          .from('metric_time_based')
          .select('id')
          .eq('base_metric_id', metricId)
          .maybeSingle();

        if (timeBasedError) {
          console.error('useCockpitMetricData: Error querying metric_time_based:', timeBasedError);
          throw timeBasedError;
        }

        if (!timeBasedMetric) {
          console.log('useCockpitMetricData: No time-based metric found for base_metric_id:', metricId);
          return [];
        }

        console.log('useCockpitMetricData: Found time-based metric with ID:', timeBasedMetric.id);

        // Now query time-based data using the time-based metric ID and date_value column for filtering
        let query = organizationClient
          .from('metric_time_based_data')
          .select('*')
          .eq('time_metric_id', timeBasedMetric.id)
          .order('date_value', { ascending: true });

        if (startDate && endDate) {
          console.log('useCockpitMetricData: Applying date filters to query using date_value column:', { startDate, endDate });
          query = query
            .gte('date_value', startDate)
            .lte('date_value', endDate);
        }

        if (limit) {
          query = query.limit(limit);
        }

        console.log('useCockpitMetricData: Executing time-based data query for time_metric_id:', timeBasedMetric.id);
        const { data, error } = await query;

        if (error) {
          console.error('useCockpitMetricData: Database query error:', error);
          throw error;
        }

        console.log('useCockpitMetricData: Time-based query results:', {
          dataLength: data?.length || 0,
          sampleData: data?.slice(0, 2),
          dateRange: { startDate, endDate }
        });

        return data as MetricTimeBasedData[];
      } else if (metricType === 'multi_value') {
        // First, get the multi-value metric ID from the base metric ID
        console.log('useCockpitMetricData: Querying metric_multi_value table for base_metric_id:', metricId);
        
        const { data: multiValueMetric, error: multiValueError } = await organizationClient
          .from('metric_multi_value')
          .select('id')
          .eq('base_metric_id', metricId)
          .maybeSingle();

        if (multiValueError) {
          console.error('useCockpitMetricData: Error querying metric_multi_value:', multiValueError);
          throw multiValueError;
        }

        if (!multiValueMetric) {
          console.log('useCockpitMetricData: No multi-value metric found for base_metric_id:', metricId);
          return [];
        }

        console.log('useCockpitMetricData: Found multi-value metric with ID:', multiValueMetric.id);

        // Query multi-value data using the multi-value metric ID
        let query = organizationClient
          .from('metric_multi_value_data')
          .select('*')
          .eq('multi_value_metric_id', multiValueMetric.id)
          .order('sort_order', { ascending: true });

        if (limit) {
          query = query.limit(limit);
        }

        console.log('useCockpitMetricData: Executing multi-value database query for multi_value_metric_id:', multiValueMetric.id);
        const { data, error } = await query;

        if (error) {
          console.error('useCockpitMetricData: Database query error:', error);
          throw error;
        }

        console.log('useCockpitMetricData: Multi-value query results:', {
          dataLength: data?.length || 0,
          sampleData: data?.slice(0, 2)
        });

        return data as MetricMultiValueData[];
      }

      // For single metrics, return empty array as they don't have data points
      console.log('useCockpitMetricData: Single value metric, returning empty array');
      return [];
    },
    enabled: !!metricId && !!metricType && !!organizationClient,
  });
};

export const useBulkCreateMetricData = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ 
      metricType, 
      metricId, 
      dataPoints 
    }: { 
      metricType: 'multi_value' | 'time_based';
      metricId: string;
      dataPoints: any[];
    }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Bulk creating metric data points:', { metricType, metricId, dataPoints });
      
      let table = '';
      let processedDataPoints = dataPoints;
      
      if (metricType === 'multi_value') {
        table = 'metric_multi_value_data';
        processedDataPoints = dataPoints.map(point => ({
          ...point,
          multi_value_metric_id: metricId
        }));
      } else if (metricType === 'time_based') {
        table = 'metric_time_based_data';
        processedDataPoints = dataPoints.map(point => ({
          ...point,
          time_metric_id: metricId
        }));
      }
      
      const { data, error } = await organizationClient
        .from(table as any)
        .insert(processedDataPoints)
        .select();
      
      if (error) {
        console.error('Error bulk creating metric data:', error);
        throw error;
      }
      
      console.log('Successfully created metric data points:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-metric-data'] });
      console.log('Invalidated metric data queries after bulk create');
    },
    onError: (error) => {
      console.error('Bulk create metric data error:', error);
    }
  });
};
