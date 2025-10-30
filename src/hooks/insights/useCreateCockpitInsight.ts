
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CockpitInsight } from '@/types/cockpit';
import { toast } from 'sonner';

export const useCreateCockpitInsight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<CockpitInsight, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating insight:', data);
      const { data: result, error } = await supabase
        .from('cockpit_insights')
        .insert(data)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating insight:', error);
        throw error;
      }
      console.log('Insight created:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-insights'] });
      toast.success("Insight created successfully");
    },
    onError: (error) => {
      console.error('Create insight error:', error);
      toast.error("Failed to create insight");
    }
  });
};
