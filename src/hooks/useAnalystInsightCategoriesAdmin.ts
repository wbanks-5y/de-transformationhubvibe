
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from '@/hooks/use-toast';

export interface CreateAnalystInsightCategoryData {
  name: string;
  display_name: string;
  description?: string;
  color_class?: string;
  icon_name?: string;
  sort_order?: number;
}

export const useCreateAnalystInsightCategory = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();

  return useMutation({
    mutationFn: async (data: CreateAnalystInsightCategoryData) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data: result, error } = await organizationClient
        .from('analyst_insight_categories')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyst-insight-categories'] });
      toast.success("Insight category created successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to create category: ${error.message}`);
    }
  });
};

export const useUpdateAnalystInsightCategory = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAnalystInsightCategoryData> }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data: result, error } = await organizationClient
        .from('analyst_insight_categories')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyst-insight-categories'] });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update category: ${error.message}`);
    }
  });
};

export const useDeleteAnalystInsightCategory = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { error } = await organizationClient
        .from('analyst_insight_categories')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyst-insight-categories'] });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete category: ${error.message}`);
    }
  });
};
