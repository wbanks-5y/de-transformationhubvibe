
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { CockpitKPI } from '@/types/cockpit';

export const useCockpitKPIs = (cockpitTypeId?: string) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['cockpit-kpis', cockpitTypeId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Fetching cockpit KPIs for:', cockpitTypeId);
      
      if (!cockpitTypeId) {
        console.log('No cockpit type ID provided, returning empty array');
        return [];
      }
      
      const { data, error } = await organizationClient
        .from('cockpit_kpis')
        .select('*')
        .eq('cockpit_type_id', cockpitTypeId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('❌fetching cockpit KPIs:', error);
        throw error;
      }
      
      console.log('Cockpit KPIs fetched:', data?.length || 0, 'items');
      return data as CockpitKPI[];
    },
    enabled: !!cockpitTypeId && !!organizationClient,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Re-export the mutation hooks from the management file
export { useCreateCockpitKPI, useUpdateCockpitKPI, useDeleteCockpitKPI } from '@/hooks/use-cockpit-kpi-management';
