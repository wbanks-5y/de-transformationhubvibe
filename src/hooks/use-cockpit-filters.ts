
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';

export interface CockpitFilter {
  id: string;
  cockpit_type_id: string | null;
  name: string;
  filter_type: string;
  filter_config: {
    type: 'relative' | 'custom';
    period?: string;
    label: string;
    description: string;
  };
  is_default: boolean | null;
  sort_order: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useCockpitFilters = (cockpitTypeId?: string, filterType?: string) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['cockpit-filters', cockpitTypeId, filterType],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Fetching cockpit filters for:', cockpitTypeId, filterType);
      
      if (!cockpitTypeId) {
        return [];
      }
      
      let query = organizationClient
        .from('cockpit_filters')
        .select('*')
        .eq('cockpit_type_id', cockpitTypeId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (filterType) {
        query = query.eq('filter_type', filterType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching cockpit filters:', error);
        throw error;
      }
      
      console.log('Cockpit filters fetched:', data);
      
      // Transform the data to match our interface
      const transformedData = data?.map(filter => ({
        ...filter,
        filter_config: filter.filter_config as CockpitFilter['filter_config']
      })) || [];
      
      return transformedData as CockpitFilter[];
    },
    enabled: !!cockpitTypeId && !!organizationClient,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useDefaultFilter = (cockpitTypeId?: string, filterType?: string) => {
  const { data: filters } = useCockpitFilters(cockpitTypeId, filterType);
  return filters?.find(filter => filter.is_default) || filters?.[0];
};
