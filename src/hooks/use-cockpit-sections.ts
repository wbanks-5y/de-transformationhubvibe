
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCockpitSections = (cockpitTypeId: string) => {
  return useQuery({
    queryKey: ['cockpit-sections', cockpitTypeId],
    queryFn: async () => {
      if (!cockpitTypeId) return [];
      
      const { data, error } = await supabase
        .from('cockpit_sections')
        .select('*')
        .eq('cockpit_type_id', cockpitTypeId)
        .order('sort_order');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!cockpitTypeId
  });
};

export const useCreateCockpitSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      cockpit_type_id: string;
      name: string;
      display_name: string;
      description?: string;
      sort_order?: number;
      is_active?: boolean;
    }) => {
      const { data: section, error } = await supabase
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
      const { data: section, error } = await supabase
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
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
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
