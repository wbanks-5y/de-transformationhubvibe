
import { useQuery } from '@tanstack/react-query';
import { useCockpitKPIs } from './use-cockpit-kpis';
import { useKPIValue, useKPILatestTimeBased, useKPITargets } from './use-kpi-data';

export const useWeightedKPIAggregate = (
  cockpitTypeId: string,
  startDate?: string,
  endDate?: string
) => {
  const { data: kpis = [] } = useCockpitKPIs(cockpitTypeId);

  return useQuery({
    queryKey: ['weighted-kpi-aggregate', cockpitTypeId, startDate, endDate],
    queryFn: async () => {
      console.log('Calculating weighted KPI aggregate for cockpit:', cockpitTypeId);
      
      if (!kpis || kpis.length === 0) {
        console.log('No KPIs found for cockpit');
        return { totalScore: 0, maxPossibleScore: 0, percentage: 0 };
      }

      let totalWeightedScore = 0;
      let totalWeight = 0;

      for (const kpi of kpis) {
        if (!kpi.is_active) continue;

        const weight = kpi.weight || 1.0;
        let score = 0;

        // Get current value based on KPI type
        if (kpi.kpi_data_type === 'single') {
          // For single KPIs, use a default value for now
          // In a real implementation, you'd fetch from cockpit_kpi_values
          score = 75; // Default middle-high value
        } else if (kpi.kpi_data_type === 'time_based') {
          // For time-based KPIs, use a default value for now
          // In a real implementation, you'd fetch latest from cockpit_kpi_time_based
          score = 70; // Default middle value
        }

        // Get target value - for now use a default
        // In a real implementation, you'd fetch from cockpit_kpi_targets
        const targetValue = 100; // Default target
        
        // Normalize score to 0-100 based on target
        if (targetValue > 0) {
          const targetScore = (score / targetValue) * 100;
          score = Math.min(100, Math.max(0, targetScore));
        }

        totalWeightedScore += score * weight;
        totalWeight += weight;
      }

      const finalPercentage = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;

      console.log('Weighted KPI calculation result:', {
        totalWeightedScore,
        totalWeight,
        finalPercentage,
        kpiCount: kpis.length
      });

      return {
        totalScore: totalWeightedScore,
        maxPossibleScore: totalWeight * 100,
        percentage: Math.round(finalPercentage * 100) / 100
      };
    },
    enabled: !!cockpitTypeId && kpis.length > 0,
  });
};
