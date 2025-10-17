
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';

// Hook to update only the is_active field in metric_base
export const useUpdateMetricBaseActive = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ 
      metricId, 
      isActive 
    }: {
      metricId: string;
      isActive: boolean;
    }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('useUpdateMetricBaseActive: Updating metric base active status:', {
        metricId,
        isActive
      });

      const { data, error } = await organizationClient
        .from('metric_base')
        .update({ is_active: isActive })
        .eq('id', metricId)
        .select()
        .single();

      if (error) {
        console.error('useUpdateMetricBaseActive: Error updating metric base:', error);
        throw new Error(`Failed to update metric active status: ${error.message}`);
      }

      console.log('useUpdateMetricBaseActive: Successfully updated metric base');
      return data;
    },
    onSuccess: () => {
      console.log('useUpdateMetricBaseActive: onSuccess called');
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
    },
    onError: (error: any) => {
      console.error('useUpdateMetricBaseActive: onError called with error:', error);
      toast.error(`Failed to update metric status: ${error.message}`);
    }
  });
};

// Hook to update chart_type and y_axis_label in metric_time_based
export const useUpdateTimeBasedConfig = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ 
      metricId, 
      chartType, 
      yAxisLabel 
    }: {
      metricId: string;
      chartType: string;
      yAxisLabel: string;
    }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('useUpdateTimeBasedConfig: Updating time-based config:', {
        metricId,
        chartType,
        yAxisLabel
      });

      const { data, error } = await organizationClient
        .from('metric_time_based')
        .update({ 
          chart_type: chartType,
          y_axis_label: yAxisLabel
        })
        .eq('base_metric_id', metricId)
        .select()
        .single();

      if (error) {
        console.error('useUpdateTimeBasedConfig: Error updating time-based config:', error);
        throw new Error(`Failed to update time-based configuration: ${error.message}`);
      }

      console.log('useUpdateTimeBasedConfig: Successfully updated time-based config');
      return data;
    },
    onSuccess: () => {
      console.log('useUpdateTimeBasedConfig: onSuccess called');
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
    },
    onError: (error: any) => {
      console.error('useUpdateTimeBasedConfig: onError called with error:', error);
      toast.error(`Failed to update configuration: ${error.message}`);
    }
  });
};

// Hook to upsert data points in metric_time_based_data
export const useUpsertTimeBasedData = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ 
      metricId, 
      dataPoints 
    }: {
      metricId: string;
      dataPoints: any[];
    }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('useUpsertTimeBasedData: Upserting time-based data points:', {
        metricId,
        dataPointsLength: dataPoints.length
      });

      // First, get the time-based config ID
      const { data: timeBasedConfig, error: configError } = await organizationClient
        .from('metric_time_based')
        .select('id')
        .eq('base_metric_id', metricId)
        .single();

      if (configError || !timeBasedConfig) {
        console.error('useUpsertTimeBasedData: Failed to fetch time-based config ID');
        throw new Error('Failed to fetch time-based configuration');
      }

      // If no data points provided, clear existing data
      if (dataPoints.length === 0) {
        console.log('useUpsertTimeBasedData: No data points provided, clearing existing data');
        
        const { error: deleteError } = await organizationClient
          .from('metric_time_based_data')
          .delete()
          .eq('time_metric_id', timeBasedConfig.id);

        if (deleteError) {
          console.error('useUpsertTimeBasedData: Error clearing existing data:', deleteError);
          throw new Error(`Failed to clear existing data: ${deleteError.message}`);
        }

        return { message: 'Data cleared successfully' };
      }

      // Format data points for upsert
      const formattedDataPoints = dataPoints.map(point => ({
        time_metric_id: timeBasedConfig.id,
        value: Number(point.value) || 0,
        year: Number(point.year) || new Date().getFullYear(),
        quarter: point.quarter ? Number(point.quarter) : null,
        month: point.month ? Number(point.month) : null,
        week: point.week ? Number(point.week) : null,
        day: point.day ? Number(point.day) : null,
        date_value: point.date_value || null,
        series_name: point.series_name || 'Series 1',
        series_color: point.series_color || '#3B82F6'
      }));

      console.log('useUpsertTimeBasedData: Formatted data points:', formattedDataPoints);

      // Clear existing data first, then insert new data (simulating upsert behavior)
      const { error: deleteError } = await organizationClient
        .from('metric_time_based_data')
        .delete()
        .eq('time_metric_id', timeBasedConfig.id);

      if (deleteError) {
        console.error('useUpsertTimeBasedData: Error clearing existing data:', deleteError);
        throw new Error(`Failed to clear existing data: ${deleteError.message}`);
      }

      // Insert new data points
      const { data, error } = await organizationClient
        .from('metric_time_based_data')
        .insert(formattedDataPoints)
        .select();

      if (error) {
        console.error('useUpsertTimeBasedData: Error inserting data points:', error);
        throw new Error(`Failed to insert data points: ${error.message}`);
      }

      console.log('useUpsertTimeBasedData: Successfully upserted data points');
      return data;
    },
    onSuccess: () => {
      console.log('useUpsertTimeBasedData: onSuccess called');
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
    },
    onError: (error: any) => {
      console.error('useUpsertTimeBasedData: onError called with error:', error);
      toast.error(`Failed to update data points: ${error.message}`);
    }
  });
};

// Combined hook for updating time-based metrics
export const useUpdateTimeBasedMetric = () => {
  const queryClient = useQueryClient();
  const updateBaseActive = useUpdateMetricBaseActive();
  const updateConfig = useUpdateTimeBasedConfig();
  const upsertData = useUpsertTimeBasedData();
  
  return useMutation({
    mutationFn: async ({ 
      metricId, 
      isActive, 
      chartType, 
      yAxisLabel, 
      dataPoints 
    }: {
      metricId: string;
      isActive: boolean;
      chartType: string;
      yAxisLabel: string;
      dataPoints: any[];
    }) => {
      console.log('useUpdateTimeBasedMetric: Starting combined update process:', {
        metricId,
        isActive,
        chartType,
        yAxisLabel,
        dataPointsLength: dataPoints.length
      });

      // Update metric base active status
      await updateBaseActive.mutateAsync({ metricId, isActive });
      
      // Update time-based configuration
      await updateConfig.mutateAsync({ metricId, chartType, yAxisLabel });
      
      // Upsert data points
      await upsertData.mutateAsync({ metricId, dataPoints });

      console.log('useUpdateTimeBasedMetric: Combined update completed successfully');
      return { success: true };
    },
    onSuccess: () => {
      console.log('useUpdateTimeBasedMetric: Combined onSuccess called');
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
      toast.success('Time-based metric updated successfully');
    },
    onError: (error: any) => {
      console.error('useUpdateTimeBasedMetric: Combined onError called with error:', error);
      toast.error(`Failed to update time-based metric: ${error.message}`);
    }
  });
};
