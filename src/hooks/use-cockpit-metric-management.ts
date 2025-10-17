
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  createSingleValueMetric, 
  createMultiValueMetric, 
  createTimeBasedMetric,
  deleteMetric,
  addMultiValueDataPoint,
  updateMultiValueDataPoint,
  deleteMultiValueDataPoint,
  addTimeBasedDataPoint,
  updateTimeBasedDataPoint,
  deleteTimeBasedDataPoint
} from '@/services/metricService';
import { 
  MetricBase, 
  MetricSingleValue, 
  MetricMultiValue,
  MetricMultiValueData,
  MetricTimeBased,
  MetricTimeBasedData
} from '@/types/metrics';

export const useCreateCockpitMetric = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      base: Omit<MetricBase, 'id' | 'created_at' | 'updated_at'>;
      metricType: 'single_value' | 'multi_value' | 'time_based';
      singleValue?: Omit<MetricSingleValue, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>;
      multiValue?: Omit<MetricMultiValue, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>;
      timeBased?: Omit<MetricTimeBased, 'id' | 'base_metric_id' | 'created_at' | 'updated_at'>;
      dataPoints?: any[];
    }) => {
      console.log('useCreateCockpitMetric: Starting mutation with data:', data);
      
      try {
        const { base, metricType, singleValue, multiValue, timeBased, dataPoints } = data;
        
        // Enhanced validation with more specific error messages
        if (metricType === 'single_value' && !singleValue) {
          const error = new Error('Single value metric data is required but was not provided');
          console.error('useCreateCockpitMetric: Validation error:', error.message);
          console.error('useCreateCockpitMetric: Received data:', data);
          throw error;
        }
        
        if (metricType === 'multi_value' && !multiValue) {
          const error = new Error('Multi value metric data is required but was not provided');
          console.error('useCreateCockpitMetric: Validation error:', error.message);
          console.error('useCreateCockpitMetric: Received data:', data);
          throw error;
        }
        
        if (metricType === 'time_based' && !timeBased) {
          const error = new Error('Time based metric data is required but was not provided');
          console.error('useCreateCockpitMetric: Validation error:', error.message);
          console.error('useCreateCockpitMetric: Received data:', data);
          throw error;
        }
        
        // Validate base data more thoroughly
        if (!base.name || base.name.trim() === '') {
          throw new Error('Metric name is required and cannot be empty');
        }
        
        if (!base.display_name || base.display_name.trim() === '') {
          throw new Error('Display name is required and cannot be empty');
        }
        
        if (!base.section_id || base.section_id.trim() === '') {
          throw new Error('Section ID is required and cannot be empty');
        }
        
        let result;
        
        console.log('useCreateCockpitMetric: About to switch on metricType:', metricType);
        console.log('useCreateCockpitMetric: Base data validation passed:', base);
        
        switch (metricType) {
          case 'single_value':
            console.log('useCreateCockpitMetric: Creating single value metric');
            console.log('useCreateCockpitMetric: Single value data:', singleValue);
            result = await createSingleValueMetric(base, singleValue!);
            break;
            
          case 'multi_value':
            console.log('useCreateCockpitMetric: Creating multi value metric with data:', { base, multiValue, dataPoints });
            result = await createMultiValueMetric(base, multiValue!, dataPoints);
            console.log('useCreateCockpitMetric: Multi value metric creation completed with result:', result);
            break;
            
          case 'time_based':
            console.log('useCreateCockpitMetric: Creating time based metric');
            console.log('useCreateCockpitMetric: Time based data:', timeBased);
            result = await createTimeBasedMetric(base, timeBased!, dataPoints);
            break;
            
          default:
            const error = new Error(`Invalid metric type: ${metricType}. Expected 'single_value', 'multi_value', or 'time_based'`);
            console.error('useCreateCockpitMetric: Invalid metric type error:', error.message);
            console.error('useCreateCockpitMetric: Received metricType:', metricType);
            throw error;
        }
        
        console.log('useCreateCockpitMetric: Mutation completed successfully with result:', result);
        return result;
      } catch (error) {
        console.error('useCreateCockpitMetric: Error in mutation function:', error);
        console.error('useCreateCockpitMetric: Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('useCreateCockpitMetric: Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('useCreateCockpitMetric: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.error('useCreateCockpitMetric: Input data that caused error:', data);
        
        // Re-throw the error with additional context if needed
        if (error instanceof Error) {
          // Add context to the error message if it's too generic
          if (error.message === 'Unknown error occurred' || error.message === '') {
            error.message = `Failed to create ${data.metricType} metric: ${error.message || 'Unknown database error'}`;
          }
        }
        
        throw error;
      }
    },
    onSuccess: (result) => {
      console.log('useCreateCockpitMetric: onSuccess called with result:', result);
      try {
        queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
        console.log('useCreateCockpitMetric: Query invalidation completed');
        toast.success('Metric created successfully');
        console.log('useCreateCockpitMetric: Success toast shown');
      } catch (error) {
        console.error('useCreateCockpitMetric: Error in onSuccess:', error);
        // Don't throw here as it would mask the success
        toast.error('Metric created but failed to refresh data. Please refresh the page.');
      }
    },
    onError: (error) => {
      console.error('useCreateCockpitMetric: onError called with error:', error);
      console.error('useCreateCockpitMetric: Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('useCreateCockpitMetric: Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('useCreateCockpitMetric: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more user-friendly error messages for common issues
        if (errorMessage.includes('23505')) {
          errorMessage = 'A metric with this name already exists in this section. Please choose a different name.';
        } else if (errorMessage.includes('23503')) {
          errorMessage = 'Invalid section selected. Please refresh the page and try again.';
        } else if (errorMessage.includes('23502')) {
          errorMessage = 'Required fields are missing. Please fill in all required information.';
        } else if (errorMessage.includes('section_id')) {
          errorMessage = 'Please select a valid section for this metric.';
        }
      }
      
      console.log('useCreateCockpitMetric: Showing error toast with message:', errorMessage);
      toast.error(`Failed to create metric: ${errorMessage}`);
    }
  });
};

export const useDeleteCockpitMetric = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMetric(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
    },
    onError: (error) => {
      console.error('Error deleting metric:', error);
      toast.error('Failed to delete metric');
    }
  });
};

// Data point management hooks for multi-value metrics
export const useAddMultiValueDataPoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ metricId, dataPoint }: { 
      metricId: string; 
      dataPoint: Omit<MetricMultiValueData, 'id' | 'multi_value_metric_id' | 'created_at' | 'updated_at'>;
    }) => {
      return addMultiValueDataPoint(metricId, dataPoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
    }
  });
};

export const useUpdateMultiValueDataPoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MetricMultiValueData> }) => {
      return updateMultiValueDataPoint(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
    }
  });
};

export const useDeleteMultiValueDataPoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMultiValueDataPoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
    }
  });
};

// Data point management hooks for time-based metrics
export const useAddTimeBasedDataPoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ metricId, dataPoint }: { 
      metricId: string; 
      dataPoint: Omit<MetricTimeBasedData, 'id' | 'time_metric_id' | 'created_at' | 'updated_at'>;
    }) => {
      return addTimeBasedDataPoint(metricId, dataPoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
    }
  });
};

export const useUpdateTimeBasedDataPoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MetricTimeBasedData> }) => {
      return updateTimeBasedDataPoint(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
    }
  });
};

export const useDeleteTimeBasedDataPoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTimeBasedDataPoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-data'] });
    }
  });
};
