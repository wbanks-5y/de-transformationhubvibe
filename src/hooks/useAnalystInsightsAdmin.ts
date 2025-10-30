
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AnalystInsight } from './useAnalystInsights';

export interface CreateAnalystInsightData {
  title: string;
  description: string;
  category: string;
  impact: 'positive' | 'negative' | 'neutral';
  source?: string;
  timestamp_text: string;
  icon_name?: string;
  external_url?: string;
  tags?: string[];
}

export const useCreateAnalystInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAnalystInsightData) => {
      const { data: result, error } = await supabase
        .from('analyst_insights')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyst-insights'] });
      toast.success("Analyst insight created successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to create insight: ${error.message}`);
    }
  });
};

export const useUpdateAnalystInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAnalystInsightData> }) => {
      const { data: result, error } = await supabase
        .from('analyst_insights')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyst-insights'] });
      toast.success("Analyst insight updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update insight: ${error.message}`);
    }
  });
};

export const useDeleteAnalystInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('analyst_insights')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyst-insights'] });
      toast.success("Analyst insight deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete insight: ${error.message}`);
    }
  });
};

export const useApproveAnalystInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('analyst_insights')
        .update({ 
          approval_status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyst-insights'] });
      toast.success("Insight approved successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to approve insight: ${error.message}`);
    }
  });
};

export const useRejectAnalystInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Delete the rejected insight instead of just marking it as rejected
      const { error } = await supabase
        .from('analyst_insights')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyst-insights'] });
      toast.success("Insight rejected and deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to reject insight: ${error.message}`);
    }
  });
};
