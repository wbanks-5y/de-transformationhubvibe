
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';

export const useCreateCockpitFilter = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (filterData: any) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
        .from('cockpit_filters')
        .insert([filterData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-filters'] });
      toast.success('Filter created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating filter:', error);
      toast.error('Failed to create filter');
    },
  });
};

export const useUpdateCockpitFilter = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
        .from('cockpit_filters')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-filters'] });
      toast.success('Filter updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating filter:', error);
      toast.error('Failed to update filter');
    },
  });
};

export const useDeleteCockpitFilter = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { error } = await organizationClient
        .from('cockpit_filters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-filters'] });
      toast.success('Filter deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting filter:', error);
      toast.error('Failed to delete filter');
    },
  });
};
