
import { useQuery } from '@tanstack/react-query';
import { useCockpitTypeLookup } from './use-cockpit-type-lookup';
import { useCockpitSectionsData } from './use-cockpit-sections-data';
import { useCockpitInsightsData } from './use-cockpit-insights-data';

export const useRefactoredCockpitData = (cockpitIdentifier: string) => {
  const { findCockpitType } = useCockpitTypeLookup();
  const { fetchSectionsWithMetrics } = useCockpitSectionsData();
  const { fetchInsights } = useCockpitInsightsData();

  return useQuery({
    queryKey: ['cockpit-data', cockpitIdentifier],
    queryFn: async () => {
      console.log('🏗️ Fetching cockpit data for:', cockpitIdentifier);
      
      const cockpitType = await findCockpitType(cockpitIdentifier);
      
      if (!cockpitType) {
        console.error('❌ Cockpit type not found:', cockpitIdentifier);
        throw new Error(`Cockpit type '${cockpitIdentifier}' not found`);
      }

      console.log('✅ Found cockpit type, fetching sections and insights...');
      
      // Get sections data
      const sections = await fetchSectionsWithMetrics(cockpitType.id);
      console.log('✅ Sections fetched:', sections.length);

      // Get insights data  
      const insights = await fetchInsights(cockpitType.id);
      console.log('✅ Insights fetched:', insights.length);

      console.log('🎉 Cockpit data assembled successfully');
      
      return {
        cockpitType,
        sections,
        insights
      };
    },
    enabled: !!cockpitIdentifier,
  });
};
