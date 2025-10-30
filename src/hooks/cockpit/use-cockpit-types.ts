
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CockpitType } from '@/types/cockpit';

export const useCockpitTypes = () => {
  return useQuery({
    queryKey: ['cockpit-types'],
    queryFn: async () => {
      console.log('🚀 Fetching cockpit types...');
      
      const { data, error } = await supabase
        .from('cockpit_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) {
        console.error('❌ Error fetching cockpit types:', error);
        throw error;
      }
      
      console.log('✅ Cockpit types fetched:', data?.length, 'items');
      return data as CockpitType[];
    },
    staleTime: 0,
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};
