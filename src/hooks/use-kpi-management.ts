
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';
import { CockpitKPIValue, CockpitKPITimeBased, CockpitKPITarget } from '@/types/cockpit';

// Single KPI Value Management
export const useCreateKPIValue = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (kpiValueData: Omit<CockpitKPIValue, 'id' | 'created_at' | 'updated_at'>) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
        .from('cockpit_kpi_values')
        .insert(kpiValueData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpi-value', data.kpi_id] });
      toast.success('KPI value added successfully');
    },
    onError: (error) => {
      console.error('Error creating KPI value:', error);
      toast.error('Failed to add KPI value');
    }
  });
};

export const useUpdateKPIValue = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CockpitKPIValue> }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
        .from('cockpit_kpi_values')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpi-value', data.kpi_id] });
      toast.success('KPI value updated successfully');
    },
    onError: (error) => {
      console.error('Error updating KPI value:', error);
      toast.error('Failed to update KPI value');
    }
  });
};

// Time-based KPI Value Management
export const useCreateKPITimeBased = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (kpiTimeData: Omit<CockpitKPITimeBased, 'id' | 'created_at' | 'updated_at'>) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
        .from('cockpit_kpi_time_based')
        .insert(kpiTimeData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpi-time-based', data.kpi_id] });
      queryClient.invalidateQueries({ queryKey: ['kpi-latest-time-based', data.kpi_id] });
      toast.success('Time-based KPI value added successfully');
    },
    onError: (error) => {
      console.error('Error creating time-based KPI value:', error);
      toast.error('Failed to add time-based KPI value');
    }
  });
};

export const useUpdateKPITimeBased = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CockpitKPITimeBased> }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
        .from('cockpit_kpi_time_based')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpi-time-based', data.kpi_id] });
      queryClient.invalidateQueries({ queryKey: ['kpi-latest-time-based', data.kpi_id] });
      toast.success('Time-based KPI value updated successfully');
    },
    onError: (error) => {
      console.error('Error updating time-based KPI value:', error);
      toast.error('Failed to update time-based KPI value');
    }
  });
};

export const useDeleteKPITimeBased = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { error } = await organizationClient
        .from('cockpit_kpi_time_based')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-time-based'] });
      queryClient.invalidateQueries({ queryKey: ['kpi-latest-time-based'] });
      toast.success('Time-based KPI value deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting time-based KPI value:', error);
      toast.error('Failed to delete time-based KPI value');
    }
  });
};

// KPI Target Management
export const useCreateKPITarget = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (targetData: Omit<CockpitKPITarget, 'id' | 'created_at' | 'updated_at'>) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
        .from('cockpit_kpi_targets')
        .insert(targetData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpi-targets', data.kpi_id] });
      toast.success('KPI target added successfully');
    },
    onError: (error) => {
      console.error('Error creating KPI target:', error);
      toast.error('Failed to add KPI target');
    }
  });
};

export const useUpdateKPITarget = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CockpitKPITarget> }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
        .from('cockpit_kpi_targets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpi-targets', data.kpi_id] });
      toast.success('KPI target updated successfully');
    },
    onError: (error) => {
      console.error('Error updating KPI target:', error);
      toast.error('Failed to update KPI target');
    }
  });
};

export const useDeleteKPITarget = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { error } = await organizationClient
        .from('cockpit_kpi_targets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-targets'] });
      toast.success('KPI target deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting KPI target:', error);
      toast.error('Failed to delete KPI target');
    }
  });
};
