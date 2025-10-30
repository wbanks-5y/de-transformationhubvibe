
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalystInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: 'positive' | 'negative' | 'neutral';
  source: string | null;
  timestamp_text: string;
  icon_name: string | null;
  external_url: string | null;
  tags: string[];
  is_active: boolean;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export const useAnalystInsights = () => {
  return useQuery({
    queryKey: ['analyst-insights'],
    queryFn: async (): Promise<AnalystInsight[]> => {
      const { data, error } = await supabase
        .from('analyst_insights')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analyst insights:', error);
        throw error;
      }

      return (data || []).map(insight => ({
        ...insight,
        impact: insight.impact as 'positive' | 'negative' | 'neutral',
        approval_status: insight.approval_status as 'pending' | 'approved' | 'rejected',
        tags: Array.isArray(insight.tags) ? insight.tags.map(tag => String(tag)) : []
      }));
    }
  });
};
