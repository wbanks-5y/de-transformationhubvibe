
import { supabase } from '@/integrations/supabase/client';
import { CockpitInsight } from '@/types/cockpit';

export const useCockpitInsightsData = () => {
  const fetchInsights = async (cockpitTypeId: string): Promise<CockpitInsight[]> => {
    console.log('Fetching insights for cockpit type:', cockpitTypeId);

    const { data: insights, error: insightsError } = await supabase
      .from('cockpit_insights')
      .select('*')
      .eq('cockpit_type_id', cockpitTypeId)
      .eq('is_active', true)
      .order('priority', { ascending: false });
    
    if (insightsError) {
      console.error('Error fetching insights:', insightsError);
      return [];
    }

    console.log('Insights found:', insights || []);
    return (insights || []) as CockpitInsight[];
  };

  return { fetchInsights };
};
