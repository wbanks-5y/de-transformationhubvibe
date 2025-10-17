
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';

interface MetricBaseUpdate {
  is_active: boolean;
}

interface TimeBasedConfigUpdate {
  chart_type: string;
  y_axis_label: string;
}

interface TimeBasedDataPoint {
  year: number;
  quarter?: number;
  month?: number;
  week?: number;
  day?: number;
  date_value?: string;
  value: number;
  series_name: string;
  series_color: string;
}

interface MetricUpdateData {
  metricId: string;
  baseUpdate: MetricBaseUpdate;
  configUpdate: TimeBasedConfigUpdate;
  dataPoints: TimeBasedDataPoint[];
}

export const useMetricDirectUpdate = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ metricId, baseUpdate, configUpdate, dataPoints }: MetricUpdateData) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('useMetricDirectUpdate: Starting update for metric:', metricId);
      console.log('useMetricDirectUpdate: Data points to process:', dataPoints.length);

      // Step 1: Update metric_base
      console.log('useMetricDirectUpdate: Updating metric_base...');
      const { error: baseError } = await organizationClient
        .from('metric_base')
        .update(baseUpdate)
        .eq('id', metricId);

      if (baseError) {
        console.error('useMetricDirectUpdate: Error updating metric_base:', baseError);
        throw new Error(`Failed to update metric base: ${baseError.message}`);
      }
      console.log('useMetricDirectUpdate: Successfully updated metric_base');

      // Step 2: Update metric_time_based config
      console.log('useMetricDirectUpdate: Updating metric_time_based config...');
      const { error: configError } = await organizationClient
        .from('metric_time_based')
        .update(configUpdate)
        .eq('base_metric_id', metricId);

      if (configError) {
        console.error('useMetricDirectUpdate: Error updating metric_time_based:', configError);
        throw new Error(`Failed to update time-based config: ${configError.message}`);
      }
      console.log('useMetricDirectUpdate: Successfully updated metric_time_based config');

      // Step 3: Get the time_metric_id
      console.log('useMetricDirectUpdate: Fetching time_metric_id...');
      const { data: timeBasedConfig, error: fetchError } = await organizationClient
        .from('metric_time_based')
        .select('id')
        .eq('base_metric_id', metricId)
        .single();

      if (fetchError || !timeBasedConfig) {
        console.error('useMetricDirectUpdate: Error fetching time-based config ID:', fetchError);
        throw new Error('Failed to fetch time-based configuration ID');
      }

      const timeMetricId = timeBasedConfig.id;
      console.log('useMetricDirectUpdate: Found time_metric_id:', timeMetricId);

      // Step 4: Use the replace_time_based_metric_data function
      console.log('useMetricDirectUpdate: Using replace_time_based_metric_data function...');
      
      // Prepare data points for the function (completely remove any id references)
      const dataPointsForFunction = dataPoints.map(point => ({
        year: point.year,
        quarter: point.quarter || null,
        month: point.month || null,
        week: point.week || null,
        day: point.day || null,
        date_value: point.date_value || null,
        value: Number(point.value),
        series_name: point.series_name || 'Series 1',
        series_color: point.series_color || '#4F46E5'
      }));

      console.log('useMetricDirectUpdate: Calling replace_time_based_metric_data function with data:', dataPointsForFunction);

      // Call the database function
      const { data: functionResult, error: functionError } = await organizationClient.rpc(
        'replace_time_based_metric_data',
        {
          p_time_metric_id: timeMetricId,
          p_data_points: dataPointsForFunction
        }
      );

      if (functionError) {
        console.error('useMetricDirectUpdate: Error calling replace_time_based_metric_data:', functionError);
        throw new Error(`Failed to update data points: ${functionError.message}`);
      }

      console.log('useMetricDirectUpdate: Function result:', functionResult);

      // Type-safe handling of the function result
      const result = functionResult as any;
      
      if (!result?.success) {
        console.error('useMetricDirectUpdate: Function reported failure:', result);
        throw new Error(`Data update failed: ${result?.error || 'Unknown error'}`);
      }

      const summary = {
        total: dataPoints.length,
        deleted: result.deleted_count || 0,
        inserted: result.inserted_count || 0,
        errors: 0
      };

      console.log('useMetricDirectUpdate: Update completed successfully with summary:', summary);
      return { success: true, summary };
    },
    onSuccess: () => {
      console.log('useMetricDirectUpdate: onSuccess - invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
      queryClient.invalidateQueries({ queryKey: ['metric-details'] });
      toast.success('Metric updated successfully');
    },
    onError: (error: any) => {
      console.error('useMetricDirectUpdate: onError:', error);
      toast.error(`Failed to update metric: ${error.message}`);
    },
    retry: false,
  });
};
