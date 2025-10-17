
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { CockpitInsight } from '@/types/cockpit';
import { toast } from 'sonner';

export const useCreateCockpitInsight = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (data: Omit<CockpitInsight, 'id' | 'created_at' | 'updated_at'>) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Creating insight:', data);
      const { data: result, error } = await organizationClient
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
