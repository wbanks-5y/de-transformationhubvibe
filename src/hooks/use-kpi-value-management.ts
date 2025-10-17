
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';
import { CockpitKPIValue } from '@/types/cockpit';

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

export const useDeleteKPIValue = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { error } = await organizationClient
        .from('cockpit_kpi_values')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-value'] });
      toast.success('KPI value deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting KPI value:', error);
      toast.error('Failed to delete KPI value');
    }
  });
};
