
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';

export const useCockpitSections = (cockpitTypeId: string) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['cockpit-sections', cockpitTypeId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      if (!cockpitTypeId) return [];
      
      const { data, error } = await organizationClient
        .from('cockpit_sections')
        .select('*')
        .eq('cockpit_type_id', cockpitTypeId)
        .order('sort_order');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!cockpitTypeId && !!organizationClient
  });
};

export const useCreateCockpitSection = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (data: {
      cockpit_type_id: string;
      name: string;
      display_name: string;
      description?: string;
      sort_order?: number;
      is_active?: boolean;
    }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data: section, error } = await organizationClient
        .from('cockpit_sections')
        .insert(data)
        .select()
        .single();
        
      if (error) throw error;
      return section;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-sections'] });
      toast.success('Section created successfully');
    },
    onError: (error) => {
      console.error('Error creating section:', error);
      toast.error('Failed to create section');
    }
  });
};

export const useUpdateCockpitSection = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ id, updates }: {
      id: string;
      updates: {
        name?: string;
        display_name?: string;
        description?: string;
        sort_order?: number;
        is_active?: boolean;
      };
    }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data: section, error } = await organizationClient
        .from('cockpit_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return section;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-sections'] });
      toast.success('Section updated successfully');
    },
    onError: (error) => {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
    }
  });
};

export const useDeleteCockpitSection = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { error } = await organizationClient
        .from('cockpit_sections')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-sections'] });
      toast.success('Section deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting section:', error);
      toast.error('Failed to delete section');
    }
  });
};
