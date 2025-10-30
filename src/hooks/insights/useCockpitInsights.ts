
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CockpitInsight } from '@/types/cockpit';

export const useCockpitInsights = (cockpitTypeId?: string) => {
  return useQuery({
    queryKey: ['cockpit-insights', cockpitTypeId],
    queryFn: async () => {
      console.log('useCockpitInsights queryFn called with:', {
        cockpitTypeId,
        hasTypeId: !!cockpitTypeId,
        typeIdType: typeof cockpitTypeId
      });
      
      if (!cockpitTypeId) {
        console.log('No cockpit type ID provided, returning empty array');
        return [];
      }
      
      console.log('Building query for cockpit_insights table...');
      
      const { data, error } = await supabase
        .from('cockpit_insights')
        .select('*')
        .eq('cockpit_type_id', cockpitTypeId)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });
      
      console.log('Supabase query result:', {
        data,
        error,
        dataLength: data?.length || 0,
        cockpitTypeId
      });
      
      if (error) {
        console.error('Error fetching insights:', error);
        throw error;
      }
      
      console.log('Insights fetched successfully:', {
        count: data?.length || 0,
        data: data,
        firstInsight: data?.[0]
      });
      
      return data as CockpitInsight[];
    },
    enabled: !!cockpitTypeId,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  });
};
