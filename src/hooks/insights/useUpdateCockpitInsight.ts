
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { CockpitInsight } from '@/types/cockpit';
import { toast } from 'sonner';

export const useUpdateCockpitInsight = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CockpitInsight> }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Updating insight:', id, updates);
      const { data, error } = await organizationClient
        .from('cockpit_insights')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating insight:', error);
        throw error;
      }
      console.log('Insight updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-insights'] });
      toast.success("Insight updated successfully");
    },
    onError: (error) => {
      console.error('Update insight error:', error);
      toast.error("Failed to update insight");
    }
  });
};
