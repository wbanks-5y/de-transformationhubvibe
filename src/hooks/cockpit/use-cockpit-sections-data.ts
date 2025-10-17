
import { SupabaseClient } from '@supabase/supabase-js';
import { CockpitSection } from '@/types/cockpit';
import { MetricDisplay } from '@/types/metrics';
import type { Database } from '@/integrations/supabase/types';
import { useCockpitMetricsData } from './use-cockpit-metrics-data';

export const useCockpitSectionsData = () => {
  const { transformMetricsData } = useCockpitMetricsData();

  const fetchSectionsWithMetrics = async (
    cockpitTypeId: string,
    client: SupabaseClient<Database>
  ) => {
    console.log('Fetching sections for cockpit type:', cockpitTypeId);

    // Get sections for this cockpit type with better error handling
    const { data: sections, error: sectionsError } = await client
      .from('cockpit_sections')
      .select('*')
      .eq('cockpit_type_id', cockpitTypeId)
      .eq('is_active', true)
      .order('sort_order');
    
    if (sectionsError) {
      console.error('Error fetching sections:', sectionsError);
      // Continue with empty sections instead of failing completely
    }

    console.log('Sections found:', sections || []);

    // Get metrics for each section using the new metric structure with improved error handling
    const sectionsWithMetrics = [];
    for (const section of sections || []) {
      try {
        const metrics = await transformMetricsData(section.id, client);
        console.log(`Metrics for section ${section.name}:`, metrics || []);

        sectionsWithMetrics.push({
          ...section,
          cockpit_metrics: metrics
        });
      } catch (sectionError) {
        console.error(`Error processing section ${section.id}:`, sectionError);
        // Add section with empty metrics rather than failing
        sectionsWithMetrics.push({
          ...section,
          cockpit_metrics: []
        });
      }
    }

    return sectionsWithMetrics as (CockpitSection & { cockpit_metrics: MetricDisplay[] })[];
  };

  return { fetchSectionsWithMetrics };
};
