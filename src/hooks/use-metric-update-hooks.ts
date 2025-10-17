
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  updateSingleValueMetric,
  updateMultiValueMetric, 
  updateTimeBasedMetric,
  updateMetricBase
} from '@/services/metricUpdateService';
import { 
  MetricBase,
  MetricSingleValue,
  MetricMultiValue,
  MetricTimeBased
} from '@/types/metrics';

export const useUpdateMetricBase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<Omit<MetricBase, 'id' | 'created_at' | 'updated_at'>>
    }) => {
      console.log('useUpdateMetricBase: Updating metric base with id:', id, 'updates:', updates);
      return updateMetricBase(id, updates);
    },
    onSuccess: (result) => {
      console.log('useUpdateMetricBase: Update successful:', result);
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
      toast.success('Metric updated successfully');
    },
    onError: (error) => {
      console.error('useUpdateMetricBase: Error updating metric:', error);
      toast.error('Failed to update metric');
    }
  });
};

export const useUpdateSingleValueMetric = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ baseMetricId, updates }: {
      baseMetricId: string;
      updates: Partial<Omit<MetricSingleValue, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>>
    }) => {
      console.log('useUpdateSingleValueMetric: Updating single value metric:', { baseMetricId, updates });
      return updateSingleValueMetric(baseMetricId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
      toast.success('Single value metric updated successfully');
    },
    onError: (error) => {
      console.error('useUpdateSingleValueMetric: Error:', error);
      toast.error('Failed to update single value metric');
    }
  });
};

export const useUpdateMultiValueMetric = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ baseMetricId, config, dataPoints }: {
      baseMetricId: string;
      config: Partial<Omit<MetricMultiValue, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>>;
      dataPoints?: any[];
    }) => {
      console.log('useUpdateMultiValueMetric: Updating multi value metric:', { baseMetricId, config, dataPoints });
      return updateMultiValueMetric(baseMetricId, config, dataPoints);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
      toast.success('Multi value metric updated successfully');
    },
    onError: (error) => {
      console.error('useUpdateMultiValueMetric: Error:', error);
      toast.error('Failed to update multi value metric');
    }
  });
};

export const useUpdateTimeBasedMetric = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ baseMetricId, config, dataPoints }: {
      baseMetricId: string;
      config: Partial<Omit<MetricTimeBased, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>>;
      dataPoints?: any[];
    }) => {
      console.log('useUpdateTimeBasedMetric: Updating time based metric:', { baseMetricId, config, dataPoints });
      return updateTimeBasedMetric(baseMetricId, config, dataPoints);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
      toast.success('Time based metric updated successfully');
    },
    onError: (error) => {
      console.error('useUpdateTimeBasedMetric: Error:', error);
      toast.error('Failed to update time based metric');
    }
  });
};
