
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { CockpitKPI } from '@/types/cockpit';
import { toast } from 'sonner';

export const useCreateCockpitKPI = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (kpiData: Omit<CockpitKPI, 'id' | 'created_at' | 'updated_at'>) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
        .from('cockpit_kpis')
        .insert(kpiData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-kpis'] });
    },
    onError: (error) => {
      console.error('Error creating KPI:', error);
      toast.error('Failed to create KPI');
    }
  });
};

export const useUpdateCockpitKPI = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CockpitKPI> }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
        .from('cockpit_kpis')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-kpis'] });
    },
    onError: (error) => {
      console.error('Error updating KPI:', error);
      toast.error('Failed to update KPI');
    }
  });
};

export const useDeleteCockpitKPI = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { error } = await organizationClient
        .from('cockpit_kpis')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-kpis'] });
    },
    onError: (error) => {
      console.error('Error deleting KPI:', error);
      toast.error('Failed to delete KPI');
    }
  });
};
