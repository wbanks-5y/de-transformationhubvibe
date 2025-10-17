
import { useQuery } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";

export const useStrategicHealthPeriods = (selectedPeriod: string = 'current') => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['strategic-health-periods', selectedPeriod],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
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
    },
    enabled: !!organizationClient,
  });
};
