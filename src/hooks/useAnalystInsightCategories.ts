
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalystInsightCategory {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  color_class: string | null;
  icon_name: string | null;
  sort_order: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAnalystInsightCategories = () => {
  return useQuery({
    queryKey: ['analyst-insight-categories'],
    queryFn: async (): Promise<AnalystInsightCategory[]> => {
      const { data, error } = await supabase
        .from('analyst_insight_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching analyst insight categories:', error);
        throw error;
      }

      return data || [];
    }
  });
};
