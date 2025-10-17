
import { CockpitMetric, CockpitKPI, MetricData } from '@/types/cockpit';

interface KPICalculationResult {
  value: number;
  metadata?: any;
  error?: string;
}

interface MetricDataPoint {
  value: number;
  timestamp: string;
  metadata?: any;
}

export class KPICalculatorService {
  // Calculate weighted average of multiple KPIs
  static calculateWeightedKPIAggregate(kpis: Array<{ value: number; weight: number }>): number {
    const totalWeight = kpis.reduce((sum, kpi) => sum + (kpi.weight || 0), 0);
    
    if (totalWeight === 0) return 0;
    
    const weightedSum = kpis.reduce((sum, kpi) => sum + (kpi.value * (kpi.weight || 0)), 0);
    
    return weightedSum / totalWeight;
  }

  // Determine trend direction based on historical data
  static calculateTrend(
    currentValue: number,
    historicalValues: number[],
    trendDirection: 'higher_is_better' | 'lower_is_better' | 'neutral' = 'higher_is_better'
  ): 'up' | 'down' | 'stable' {
    if (historicalValues.length === 0) return 'stable';

    const avgHistorical = historicalValues.reduce((sum, val) => sum + val, 0) / historicalValues.length;
    const percentChange = ((currentValue - avgHistorical) / avgHistorical) * 100;

    // Consider changes less than 5% as stable
    if (Math.abs(percentChange) < 5) return 'stable';

    if (trendDirection === 'lower_is_better') {
      return percentChange < 0 ? 'up' : 'down';
    } else {
      return percentChange > 0 ? 'up' : 'down';
    }
  }

  // Format KPI value based on format type
  static formatKPIValue(value: number, formatType: 'number' | 'percentage' | 'currency'): string {
    switch (formatType) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  }

  // Calculate performance percentage against target
  static calculatePerformancePercentage(
    currentValue: number,
    targetValue: number,
    trendDirection: 'higher_is_better' | 'lower_is_better' | 'neutral' = 'higher_is_better'
  ): number {
    if (!targetValue || targetValue === 0) return 0;

    if (trendDirection === 'lower_is_better') {
      // For lower is better, we calculate how close we are to the target
      // If current is lower than target, that's good (over 100%)
      return Math.min(100, (targetValue / currentValue) * 100);
    } else {
      // For higher is better, standard percentage
      return Math.min(100, (currentValue / targetValue) * 100);
    }
  }
}

export default KPICalculatorService;
