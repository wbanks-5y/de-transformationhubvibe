
import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CockpitKPI } from "@/types/cockpit";
import { useKPITimeBased } from "@/hooks/use-kpi-data";

interface KPITrendIndicatorProps {
  kpi: CockpitKPI;
  currentValue: number;
}

const KPITrendIndicator: React.FC<KPITrendIndicatorProps> = ({ 
  kpi, 
  currentValue 
}) => {
  // Fetch time-based values to calculate trend - only call if it's a time-based KPI
  const { data: timeBasedData } = useKPITimeBased(
    kpi.kpi_data_type === 'time_based' ? kpi.id : ''
  );

  // Only show trends for time-based KPIs with sufficient data
  if (kpi.kpi_data_type !== 'time_based' || !timeBasedData || timeBasedData.length < 2) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
        <Minus className="h-3 w-3 text-gray-400" />
        <span className="text-xs text-gray-500">
          {kpi.kpi_data_type === 'time_based' ? 'No trend data' : 'Single value'}
        </span>
      </div>
    );
  }

  // Calculate trend percentage between last two values
  // Data is now in chronological order (oldest first), so latest is at the end
  const latestValue = timeBasedData[timeBasedData.length - 1].actual_value;
  const previousValue = timeBasedData[timeBasedData.length - 2].actual_value;
  
  // Handle edge cases
  if (previousValue === 0) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
        <Minus className="h-3 w-3 text-gray-400" />
        <span className="text-xs text-gray-500">No baseline</span>
      </div>
    );
  }

  // Calculate trend percentage
  const trendPercentage = ((latestValue - previousValue) / Math.abs(previousValue)) * 100;
  
  // Check for NaN or invalid values
  if (isNaN(trendPercentage) || !isFinite(trendPercentage)) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
        <Minus className="h-3 w-3 text-gray-400" />
        <span className="text-xs text-gray-500">Invalid data</span>
      </div>
    );
  }

  const isPositiveTrend = trendPercentage > 0;
  
  // Determine if the trend is good based on KPI direction
  const isGoodTrend = kpi.trend_direction === 'higher_is_better' ? 
    isPositiveTrend : !isPositiveTrend;
  
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;
  const trendColor = isGoodTrend ? 'text-green-600' : 'text-red-600';
  const bgGradient = isGoodTrend ? 
    'bg-gradient-to-r from-green-50 to-green-100 border-green-200' : 
    'bg-gradient-to-r from-red-50 to-red-100 border-red-200';
  
  return (
    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${bgGradient} shadow-sm`}>
      <TrendIcon className={`h-3 w-3 ${trendColor}`} />
      <span className={`text-xs font-medium ${trendColor}`}>
        {Math.abs(trendPercentage).toFixed(1)}%
      </span>
    </div>
  );
};

export default KPITrendIndicator;
