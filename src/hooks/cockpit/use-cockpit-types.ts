
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { CockpitType } from '@/types/cockpit';

export const useCockpitTypes = () => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['cockpit-types'],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }

      console.log('Fetching cockpit types...');
      
      const { data, error } = await organizationClient
        .from('cockpit_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) {
        console.error('Error fetching cockpit types:', error);
        throw error;
      }
      
      console.log('Cockpit types fetched:', data?.length, 'items');
      return data as CockpitType[];
    },
    enabled: !!organizationClient,
    staleTime: 0,
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};
