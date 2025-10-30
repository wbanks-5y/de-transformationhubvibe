
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProcessOptimizationMetrics {
  id: string;
  process_id: string;
  potential_savings: string;
  time_reduction: string;
  quality_improvement: string;
}

export interface ProcessRecommendation {
  id: string;
  process_id: string;
  title: string;
  description: string;
  impact_level: 'High' | 'Medium' | 'Low';
  complexity_level: 'High' | 'Medium' | 'Low';
  benefits: string[];
  risks: string[];
  sort_order: number;
  is_active: boolean;
}

export const useProcessOptimizationMetrics = (processId: string) => {
  return useQuery({
    queryKey: ['process-optimization-metrics', processId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_optimization_metrics')
        .select('*')
        .eq('process_id', processId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch process optimization metrics: ${error.message}`);
      }

      return data as ProcessOptimizationMetrics;
    },
    enabled: !!processId,
  });
};

export const useProcessRecommendations = (processId: string) => {
  return useQuery({
    queryKey: ['process-recommendations', processId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_recommendations')
        .select('*')
        .eq('process_id', processId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch process recommendations: ${error.message}`);
      }

      return data as ProcessRecommendation[];
    },
    enabled: !!processId,
  });
};
