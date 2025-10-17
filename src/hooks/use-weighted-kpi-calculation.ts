
import { useQuery } from '@tanstack/react-query';
import { useCockpitKPIs } from './use-cockpit-kpis';

export const useWeightedKPICalculation = (
  cockpitTypeId: string,
  startDate?: string,
  endDate?: string
) => {
  const { data: kpis = [] } = useCockpitKPIs(cockpitTypeId);

  return useQuery({
    queryKey: ['weighted-kpi-calculation', cockpitTypeId, startDate, endDate],
    queryFn: async () => {
      console.log('Performing weighted KPI calculation for cockpit:', cockpitTypeId);
      
      if (!kpis || kpis.length === 0) {
        return {
          weightedScore: 0,
          totalWeight: 0,
          normalizedPercentage: 0,
          kpiBreakdown: []
        };
      }

      let totalWeightedScore = 0;
      let totalWeight = 0;
      const kpiBreakdown: any[] = [];

      for (const kpi of kpis.filter(k => k.is_active)) {
        const weight = kpi.weight || 1.0;
        let currentValue = 0;

        // Get current value based on KPI type - using demo values for now
        if (kpi.kpi_data_type === 'single') {
          currentValue = 75; // Default value for single KPIs
        } else if (kpi.kpi_data_type === 'time_based') {
          currentValue = 70; // Default value for time-based KPIs
        }

        // Calculate score as percentage of target
        let scorePercentage = 0;
        const defaultTarget = 100; // Default target value
        if (defaultTarget > 0) {
          scorePercentage = (currentValue / defaultTarget) * 100;
          
          // Apply trend direction
          if (kpi.trend_direction === 'lower_is_better') {
            scorePercentage = Math.max(0, 100 - scorePercentage);
          }
          
          scorePercentage = Math.min(100, Math.max(0, scorePercentage));
        }

        const weightedScore = scorePercentage * weight;
        totalWeightedScore += weightedScore;
        totalWeight += weight;

        kpiBreakdown.push({
          kpiId: kpi.id,
          name: kpi.display_name,
          currentValue,
          targetValue: defaultTarget,
          weight,
          scorePercentage,
          weightedScore
        });
      }

      const normalizedPercentage = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;

      console.log('Weighted KPI calculation completed:', {
        totalWeightedScore,
        totalWeight,
        normalizedPercentage,
        kpiCount: kpiBreakdown.length
      });

      return {
        weightedScore: totalWeightedScore,
        totalWeight,
        normalizedPercentage: Math.round(normalizedPercentage * 100) / 100,
        kpiBreakdown
      };
    },
    enabled: !!cockpitTypeId && kpis.length > 0,
  });
};

// Export the calculation function for use in other hooks
export const calculateWeightedKPIPerformance = (cockpitTypeId: string, timeRange?: string) => {
  // This is a wrapper function for backward compatibility
  console.log('calculateWeightedKPIPerformance called with:', { cockpitTypeId, timeRange });
  return 0; // Return default value for now
};
