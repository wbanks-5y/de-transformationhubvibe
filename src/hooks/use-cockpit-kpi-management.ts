
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CockpitKPI } from '@/types/cockpit';
import { toast } from 'sonner';

export const useCreateCockpitKPI = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (kpiData: Omit<CockpitKPI, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
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
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CockpitKPI> }) => {
      const { data, error } = await supabase
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
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
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
