
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { CockpitKPIValue, CockpitKPITarget, CockpitKPITimeBased } from '@/types/cockpit';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Single KPI Value hooks
export const useKPIValue = (kpiId: string) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['kpi-value', kpiId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Fetching KPI value for:', kpiId);
      
      const { data, error } = await organizationClient
        .from('cockpit_kpi_values')
        .select('*')
        .eq('kpi_id', kpiId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching KPI value:', error);
        throw error;
      }
      
      console.log('KPI value fetched:', data);
      return data as CockpitKPIValue | null;
    },
    enabled: !!kpiId && !!organizationClient,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// KPI Targets hooks
export const useKPITargets = (kpiId: string) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['kpi-targets', kpiId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Fetching KPI targets for:', kpiId);
      
      const { data, error } = await organizationClient
        .from('cockpit_kpi_targets')
        .select('*')
        .eq('kpi_id', kpiId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching KPI targets:', error);
        throw error;
      }
      
      console.log('KPI targets fetched:', data?.length || 0, 'items');
      return data as CockpitKPITarget[];
    },
    enabled: !!kpiId && !!organizationClient,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Time-based KPI hooks - Updated to use ascending order for chronological consistency
export const useKPITimeBased = (kpiId: string) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['kpi-time-based', kpiId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Fetching time-based KPI data for:', kpiId);
      
      const { data, error } = await organizationClient
        .from('cockpit_kpi_time_based')
        .select('*')
        .eq('kpi_id', kpiId)
        .order('period_start', { ascending: true }); // Changed to ascending for chronological order
      
      if (error) {
        console.error('Error fetching time-based KPI data:', error);
        throw error;
      }
      
      console.log('Time-based KPI data fetched:', data?.length || 0, 'items');
      return data as CockpitKPITimeBased[];
    },
    enabled: !!kpiId && !!organizationClient,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useKPILatestTimeBased = (kpiId: string) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['kpi-latest-time-based', kpiId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Fetching latest time-based KPI data for:', kpiId);
      
      const { data, error } = await organizationClient
        .from('cockpit_kpi_time_based')
        .select('*')
        .eq('kpi_id', kpiId)
        .order('period_start', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching latest time-based KPI data:', error);
        throw error;
      }
      
      console.log('Latest time-based KPI data fetched:', data);
      return data as CockpitKPITimeBased | null;
    },
    enabled: !!kpiId && !!organizationClient,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutation hooks for KPI time-based data
export const useCreateKPITimeBased = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (data: {
      kpi_id: string;
      actual_value: number;
      period_start: string;
      period_end: string;
      period_type?: string;
      notes?: string;
    }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Creating KPI time-based data:', data);
      
      const { data: result, error } = await organizationClient
        .from('cockpit_kpi_time_based')
        .insert([data])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating KPI time-based data:', error);
        throw error;
      }
      
      console.log('KPI time-based data created:', result);
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch KPI data
      queryClient.invalidateQueries({ queryKey: ['kpi-time-based', variables.kpi_id] });
      queryClient.invalidateQueries({ queryKey: ['kpi-latest-time-based', variables.kpi_id] });
    },
  });
};

export const useUpdateKPITimeBased = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (data: {
      id: string;
      kpi_id: string;
      actual_value?: number;
      period_start?: string;
      period_end?: string;
      period_type?: string;
      notes?: string;
    }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Updating KPI time-based data:', data);
      
      const { id, kpi_id, ...updateData } = data;
      
      const { data: result, error } = await organizationClient
        .from('cockpit_kpi_time_based')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating KPI time-based data:', error);
        throw error;
      }
      
      console.log('KPI time-based data updated:', result);
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch KPI data
      queryClient.invalidateQueries({ queryKey: ['kpi-time-based', variables.kpi_id] });
      queryClient.invalidateQueries({ queryKey: ['kpi-latest-time-based', variables.kpi_id] });
    },
  });
};

export const useDeleteKPITimeBased = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (data: { id: string; kpi_id: string }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Deleting KPI time-based data:', data);
      
      const { error } = await organizationClient
        .from('cockpit_kpi_time_based')
        .delete()
        .eq('id', data.id);
      
      if (error) {
        console.error('Error deleting KPI time-based data:', error);
        throw error;
      }
      
      console.log('KPI time-based data deleted');
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch KPI data
      queryClient.invalidateQueries({ queryKey: ['kpi-time-based', variables.kpi_id] });
      queryClient.invalidateQueries({ queryKey: ['kpi-latest-time-based', variables.kpi_id] });
    },
  });
};

// Mutation hooks for KPI targets
export const useCreateKPITarget = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (data: {
      kpi_id: string;
      target_value: number;
      target_type: string;
      period_start?: string;
      period_end?: string;
      period_type?: string;
      notes?: string;
    }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Creating KPI target:', data);
      
      const { data: result, error } = await organizationClient
        .from('cockpit_kpi_targets')
        .insert([data])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating KPI target:', error);
        throw error;
      }
      
      console.log('KPI target created:', result);
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch KPI targets
      queryClient.invalidateQueries({ queryKey: ['kpi-targets', variables.kpi_id] });
    },
  });
};

export const useUpdateKPITarget = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (data: {
      id: string;
      kpi_id: string;
      target_value?: number;
      target_type?: string;
      period_start?: string;
      period_end?: string;
      period_type?: string;
      notes?: string;
    }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Updating KPI target:', data);
      
      const { id, kpi_id, ...updateData } = data;
      
      const { data: result, error } = await organizationClient
        .from('cockpit_kpi_targets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating KPI target:', error);
        throw error;
      }
      
      console.log('KPI target updated:', result);
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch KPI targets
      queryClient.invalidateQueries({ queryKey: ['kpi-targets', variables.kpi_id] });
    },
  });
};

export const useDeleteKPITarget = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (data: { id: string; kpi_id: string }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Deleting KPI target:', data);
      
      const { error } = await organizationClient
        .from('cockpit_kpi_targets')
        .delete()
        .eq('id', data.id);
      
      if (error) {
        console.error('Error deleting KPI target:', error);
        throw error;
      }
      
      console.log('KPI target deleted');
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch KPI targets
      queryClient.invalidateQueries({ queryKey: ['kpi-targets', variables.kpi_id] });
    },
  });
};
