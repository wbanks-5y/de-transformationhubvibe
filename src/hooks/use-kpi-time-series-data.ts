
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { CockpitKPITimeBased } from '@/types/cockpit';

export interface KPITimeSeriesData {
  id: string;
  period_start: string;
  period_end: string;
  actual_value: number;
  current_value: number; // Alias for actual_value for backward compatibility
  target_value?: number;
  target_achievement_percentage?: number;
  trend_percentage?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useKPITimeSeriesData = (
  kpiId: string,
  startDate?: string,
  endDate?: string,
  limit?: number
) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['kpi-time-series-data', kpiId, startDate, endDate, limit],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Fetching KPI time series data:', { kpiId, startDate, endDate, limit });
      
      if (!kpiId) {
        console.log('No KPI ID provided');
        return [];
      }

      let query = organizationClient
        .from('cockpit_kpi_time_based')
        .select('*')
        .eq('kpi_id', kpiId)
        .order('period_start', { ascending: true });

      if (startDate) {
        query = query.gte('period_start', startDate);
      }
      
      if (endDate) {
        query = query.lte('period_end', endDate);
      }
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching KPI time series data:', error);
        throw error;
      }
      
      console.log('KPI time series data fetched:', data?.length || 0, 'records');
      
      // Transform to match expected interface with backward compatibility
      const transformedData: KPITimeSeriesData[] = (data || []).map(item => ({
        id: item.id,
        period_start: item.period_start,
        period_end: item.period_end,
        actual_value: item.actual_value,
        current_value: item.actual_value, // Alias for backward compatibility
        target_value: undefined, // Will be fetched separately from targets table
        target_achievement_percentage: undefined, // Calculated when targets available
        trend_percentage: undefined, // Calculated from historical data
        notes: item.notes,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      return transformedData;
    },
    enabled: !!kpiId && !!organizationClient,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  });
};

export const useKPILatestTimeSeriesValue = (kpiId: string) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['kpi-latest-time-series', kpiId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Fetching latest KPI time series value for:', kpiId);
      
      const { data, error } = await organizationClient
        .from('cockpit_kpi_time_based')
        .select('*')
        .eq('kpi_id', kpiId)
        .order('period_start', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching latest KPI time series value:', error);
        throw error;
      }
      
      console.log('Latest KPI time series value fetched:', data);
      
      if (!data) return null;
      
      return {
        id: data.id,
        period_start: data.period_start,
        period_end: data.period_end,
        actual_value: data.actual_value,
        current_value: data.actual_value, // Alias for backward compatibility
        target_value: undefined,
        target_achievement_percentage: undefined,
        trend_percentage: undefined,
        notes: data.notes,
        created_at: data.created_at,
        updated_at: data.updated_at
      } as KPITimeSeriesData;
    },
    enabled: !!kpiId && !!organizationClient,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  });
};
