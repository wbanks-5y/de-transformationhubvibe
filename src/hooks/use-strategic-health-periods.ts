
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStrategicHealthPeriods = (selectedPeriod: string = 'current') => {
  return useQuery({
    queryKey: ['strategic-health-periods', selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategic_objective_health_periods')
        .select(`
          *,
          strategic_objectives (
            id,
            name,
            display_name,
            perspective,
            owner,
            target_description
          )
        `)
        .eq('period_type', selectedPeriod)
        .eq('year', 2024)
        .order('health_score', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
};
