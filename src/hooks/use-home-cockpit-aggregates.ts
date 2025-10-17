
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';

export interface CockpitAggregate {
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

export const useHomeCockpitAggregates = () => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['home-cockpit-aggregates'],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Fetching home cockpit aggregates with real KPI data...');
      
      // First get all cockpit types with their color information
      const { data: cockpitTypes, error: cockpitTypesError } = await organizationClient
        .from('cockpit_types')
        .select('id, name, display_name, icon, color_class')
        .eq('is_active', true)
        .order('sort_order');

      if (cockpitTypesError) {
        console.error('Error fetching cockpit types:', cockpitTypesError);
        throw cockpitTypesError;
      }

      console.log('Cockpit types found:', cockpitTypes?.length || 0);

      // For each cockpit type, get its KPIs and calculate real aggregates
      const aggregates: CockpitAggregate[] = [];

      for (const cockpitType of cockpitTypes || []) {
        console.log('Processing cockpit:', cockpitType.display_name);

        // Get KPIs for this cockpit
        const { data: kpis, error: kpisError } = await organizationClient
          .from('cockpit_kpis')
          .select('*')
          .eq('cockpit_type_id', cockpitType.id)
          .eq('is_active', true);

        if (kpisError) {
          console.error('Error fetching KPIs for cockpit:', cockpitType.id, kpisError);
          continue;
        }

        if (!kpis || kpis.length === 0) {
          console.log('No KPIs found for cockpit:', cockpitType.display_name);
          continue;
        }

        console.log('Found KPIs:', kpis.length, 'for', cockpitType.display_name);

        // Calculate weighted achievement for each KPI
        let totalWeightedAchievement = 0;
        let totalWeight = 0;
        let kpisWithData = 0;

        for (const kpi of kpis) {
          console.log('Processing KPI:', kpi.display_name, 'Type:', kpi.kpi_data_type);

          let currentValue: number | null = null;
          let targetValue: number | null = null;

          // Get current value based on KPI type
          if (kpi.kpi_data_type === 'single') {
            const { data: singleValue } = await organizationClient
              .from('cockpit_kpi_values')
              .select('current_value')
              .eq('kpi_id', kpi.id)
              .order('recorded_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            currentValue = singleValue?.current_value || null;
          } else if (kpi.kpi_data_type === 'time_based') {
            const { data: timeBasedValue } = await organizationClient
              .from('cockpit_kpi_time_based')
              .select('actual_value')
              .eq('kpi_id', kpi.id)
              .order('period_start', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            currentValue = timeBasedValue?.actual_value || null;
          }

          // Get target value
          const { data: target } = await organizationClient
            .from('cockpit_kpi_targets')
            .select('target_value, target_type')
            .eq('kpi_id', kpi.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          targetValue = target?.target_value || null;

          console.log('KPI values:', {
            name: kpi.display_name,
            current: currentValue,
            target: targetValue,
            trend_direction: kpi.trend_direction,
            weight: kpi.weight
          });

          // Only calculate achievement if we have both current and target values
          if (currentValue !== null && targetValue !== null && targetValue > 0) {
            let achievementPercentage = 0;

            if (kpi.trend_direction === 'lower_is_better') {
              // For lower_is_better: achievement = (target / current) * 100
              if (currentValue > 0) {
                achievementPercentage = (targetValue / currentValue) * 100;
              } else {
                achievementPercentage = 100; // If current is 0, assume perfect for lower_is_better
              }
            } else {
              // For higher_is_better: standard calculation
              achievementPercentage = (currentValue / targetValue) * 100;
            }

            // Cap achievement at 100% for home page display
            achievementPercentage = Math.min(achievementPercentage, 100);

            const weight = kpi.weight || 1.0;
            totalWeightedAchievement += achievementPercentage * weight;
            totalWeight += weight;
            kpisWithData++;

            console.log('KPI achievement calculated:', {
              name: kpi.display_name,
              achievement: achievementPercentage.toFixed(1) + '%',
              weight: weight,
              weighted_contribution: (achievementPercentage * weight).toFixed(1)
            });
          } else {
            console.log('Skipping KPI (missing data):', kpi.display_name, {
              hasCurrentValue: currentValue !== null,
              hasTargetValue: targetValue !== null
            });
          }
        }

        // Calculate final weighted average
        const finalPerformance = totalWeight > 0 ? totalWeightedAchievement / totalWeight : 0;
        
        console.log('Cockpit performance summary:', {
          cockpit: cockpitType.display_name,
          totalKPIs: kpis.length,
          kpisWithData: kpisWithData,
          totalWeight: totalWeight,
          totalWeightedAchievement: totalWeightedAchievement.toFixed(1),
          finalPerformance: finalPerformance.toFixed(1) + '%'
        });

        // Determine health status based on real performance
        let healthStatus: 'excellent' | 'good' | 'warning' | 'poor' = 'poor';
        if (finalPerformance >= 90) healthStatus = 'excellent';
        else if (finalPerformance >= 75) healthStatus = 'good';
        else if (finalPerformance >= 60) healthStatus = 'warning';

        // Enhanced color determination with proper fallbacks
        const getColor = (): string => {
          // Priority 1: Use color_class from cockpit_types table
          if (cockpitType.color_class) {
            // If it's already a hex color, use it
            if (cockpitType.color_class.startsWith('#')) {
              return cockpitType.color_class;
            }
            
            // Convert Tailwind class to hex color
            const tailwindToHex: Record<string, string> = {
              'bg-blue-500': '#3b82f6',
              'bg-green-500': '#10b981',
              'bg-purple-500': '#8b5cf6',
              'bg-orange-500': '#f97316',
              'bg-teal-500': '#14b8a6',
              'bg-pink-500': '#ec4899',
              'bg-indigo-500': '#6366f1',
              'bg-red-500': '#ef4444',
              'bg-yellow-500': '#eab308',
              'bg-gray-500': '#6b7280'
            };
            
            const hexColor = tailwindToHex[cockpitType.color_class];
            if (hexColor) {
              return hexColor;
            }
          }
          
          // Priority 2: Use health status colors
          switch (healthStatus) {
            case 'excellent': return '#10b981';
            case 'good': return '#3b82f6';
            case 'warning': return '#f59e0b';
            case 'poor': return '#ef4444';
            default: return '#6b7280';
          }
        };

        const finalColor = getColor();

        aggregates.push({
          cockpit_type_id: cockpitType.id,
          cockpit_name: cockpitType.name,
          display_name: cockpitType.display_name,
          total_kpis: kpis.length,
          active_kpis: kpis.filter(k => k.is_active).length,
          avg_health_score: Math.round(finalPerformance),
          performance_percentage: Math.round(finalPerformance),
          health_status: healthStatus,
          icon: cockpitType.icon,
          color: finalColor,
          last_updated: new Date().toISOString()
        });

        console.log('Final cockpit aggregate:', {
          name: cockpitType.display_name,
          performance: Math.round(finalPerformance) + '%',
          health_status: healthStatus,
          color: finalColor,
          total_kpis: kpis.length,
          kpis_with_data: kpisWithData
        });
      }

      console.log('Home cockpit aggregates calculated with real data:', aggregates.length, 'cockpits');
      return aggregates;
    },
    enabled: !!organizationClient,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
