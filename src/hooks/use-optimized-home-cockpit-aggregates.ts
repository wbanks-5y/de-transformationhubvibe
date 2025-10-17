import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';

export interface OptimizedCockpitAggregate {
  cockpit_type_id: string;
  cockpit_name: string;
  display_name: string;
  total_kpis: number;
  active_kpis: number;
  avg_health_score: number;
  performance_percentage: number;
  health_status: 'excellent' | 'good' | 'warning' | 'poor';
  icon?: string;
  color: string;
  last_updated: string;
}

const CACHE_KEY = 'home-cockpit-aggregates';
const CACHE_TIMESTAMP_KEY = 'home-cockpit-aggregates-timestamp';
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

// Session storage helpers
const getCachedData = (): OptimizedCockpitAggregate[] | null => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    const timestamp = sessionStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!cached || !timestamp) return null;
    
    const cacheAge = Date.now() - parseInt(timestamp);
    if (cacheAge > CACHE_DURATION) {
      sessionStorage.removeItem(CACHE_KEY);
      sessionStorage.removeItem(CACHE_TIMESTAMP_KEY);
      return null;
    }
    
    return JSON.parse(cached);
  } catch (error) {
    console.warn('Failed to read from session storage:', error);
    return null;
  }
};

const setCachedData = (data: OptimizedCockpitAggregate[]) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    sessionStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn('Failed to write to session storage:', error);
  }
};

export const useOptimizedHomeCockpitAggregates = () => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['optimized-home-cockpit-aggregates'],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }

      console.log('Fetching optimized home cockpit aggregates...');
      
      const startTime = Date.now();
      const { data, error } = await organizationClient.rpc('get_home_cockpit_aggregates');
      const elapsed = Date.now() - startTime;
      
      if (error) {
        console.error('Error fetching optimized cockpit aggregates:', error);
        throw error;
      }

      console.log(`Optimized aggregates fetched in ${elapsed}ms:`, data?.length || 0, 'cockpits');
      
      const aggregates = (data || []) as OptimizedCockpitAggregate[];
      
      // Cache the results in session storage
      setCachedData(aggregates);
      
      return aggregates;
    },
    enabled: !!organizationClient,
    staleTime: 3 * 60 * 1000, // Consider data stale after 3 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    initialData: () => {
      // Try to get cached data as initial data for instant loading
      const cached = getCachedData();
      if (cached) {
        console.log('Using cached data for instant loading:', cached.length, 'cockpits');
        return cached;
      }
      return undefined;
    },
    // Enable background refetching to keep data fresh
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes in background
  });
};
