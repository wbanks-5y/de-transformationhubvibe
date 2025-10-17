
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';

export const useDeleteCockpitInsight = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Deleting insight:', id);
      const { error } = await organizationClient
        .from('cockpit_insights')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting insight:', error);
        throw error;
      }
      console.log('Insight deleted:', id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-insights'] });
      toast.success("Insight deleted successfully");
    },
    onError: (error) => {
      console.error('Delete insight error:', error);
      toast.error("Failed to delete insight");
    }
  });
};
