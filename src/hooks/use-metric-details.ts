
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';

export const useMetricDetails = (metricId: string | null) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['metric-details', metricId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      if (!metricId) {
        throw new Error('No metric ID provided');
      }

      console.log('useMetricDetails: Fetching details for metric ID:', metricId);

      // First get the base metric data
      const { data: baseMetric, error: baseError } = await organizationClient
        .from('metric_base')
        .select('*')
        .eq('id', metricId)
        .single();

      if (baseError) {
        console.error('useMetricDetails: Error fetching base metric:', baseError);
        throw baseError;
      }

      // Determine metric type by checking which type-specific table has data
      let metricType: 'single_value' | 'multi_value' | 'time_based' | null = null;
      let typeSpecificData: any = null;
      let dataPoints: any[] = [];

      // Check single value
      const { data: singleValue } = await organizationClient
        .from('metric_single_value')
        .select('*')
        .eq('base_metric_id', metricId)
        .maybeSingle();

      if (singleValue) {
        metricType = 'single_value';
        typeSpecificData = singleValue;
      }

      // Check multi value
      if (!metricType) {
        const { data: multiValue } = await organizationClient
          .from('metric_multi_value')
          .select('*')
          .eq('base_metric_id', metricId)
          .maybeSingle();

        if (multiValue) {
          metricType = 'multi_value';
          typeSpecificData = multiValue;

          // Get data points
          const { data: multiValueData } = await organizationClient
            .from('metric_multi_value_data')
            .select('*')
            .eq('multi_value_metric_id', multiValue.id)
            .order('sort_order');

          dataPoints = multiValueData || [];
        }
      }

      // Check time based
      if (!metricType) {
        const { data: timeBased } = await organizationClient
          .from('metric_time_based')
          .select('*')
          .eq('base_metric_id', metricId)
          .maybeSingle();

        if (timeBased) {
          metricType = 'time_based';
          typeSpecificData = timeBased;

          // Get data points
          const { data: timeBasedData } = await organizationClient
            .from('metric_time_based_data')
            .select('*')
            .eq('time_metric_id', timeBased.id)
            .order('year', { ascending: true });

          dataPoints = timeBasedData || [];
        }
      }

      const result = {
        base: baseMetric,
        metricType,
        typeSpecificData,
        dataPoints
      };

      console.log('useMetricDetails: Fetched metric details:', result);
      return result;
    },
    enabled: !!metricId && !!organizationClient
  });
};
