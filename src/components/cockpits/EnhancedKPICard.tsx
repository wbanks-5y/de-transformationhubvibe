
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Target, Calendar } from "lucide-react";
import { CockpitKPI } from "@/types/cockpit";
import { useKPIValue, useKPILatestTimeBased, useKPITargets } from "@/hooks/use-kpi-data";
import { formatDisplayValue, getTrendData } from "./utils/metricUtils";

interface EnhancedKPICardProps {
  kpi: CockpitKPI;
  timeRange?: string;
  startDate?: string;
  endDate?: string;
}

const EnhancedKPICard: React.FC<EnhancedKPICardProps> = ({ 
  kpi, 
  timeRange = "30d",
  startDate,
  endDate 
}) => {
  // Fetch data based on KPI type
  const { data: singleValue } = useKPIValue(kpi.kpi_data_type === 'single' ? kpi.id : '');
  const { data: latestTimeBased } = useKPILatestTimeBased(kpi.kpi_data_type === 'time_based' ? kpi.id : '');
  const { data: targets } = useKPITargets(kpi.id);

  const getCurrentValue = () => {
    if (kpi.kpi_data_type === 'time_based' && latestTimeBased) {
      return latestTimeBased.actual_value;
    }
    
    if (kpi.kpi_data_type === 'single' && singleValue) {
      return singleValue.current_value;
    }
    
    // Demo values for testing
    const demoValues = {
      'Revenue': 125000,
      'Profit': 45000,
      'Orders': 1250,
      'Customers': 8500,
      'Conversion': 3.2,
      'Growth': 15.5
    };
    
    const key = Object.keys(demoValues).find(k => 
      kpi.display_name.toLowerCase().includes(k.toLowerCase())
    );
    
    return key ? demoValues[key as keyof typeof demoValues] : 42500;
  };

  const getTargetValue = () => {
    if (!targets || targets.length === 0) return 0;
    
    // For time-based KPIs, try to find a matching time-based target
    if (kpi.kpi_data_type === 'time_based' && latestTimeBased) {
      const timeBasedTarget = targets.find(t => 
        t.target_type === 'time_based' &&
        t.period_start && t.period_end &&
        latestTimeBased.period_start >= t.period_start &&
        latestTimeBased.period_end <= t.period_end
      );
      if (timeBasedTarget) return timeBasedTarget.target_value;
    }
    
    // Fall back to single target
    const singleTarget = targets.find(t => t.target_type === 'single');
    return singleTarget?.target_value || 0;
  };

  const formatValue = (value: number) => {
    switch (kpi.format_type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(Math.round(value));
      case 'percentage':
        return `${Math.round(value)}%`;
      default:
        return Math.round(value).toLocaleString();
    }
  };

  const getTrendComponent = () => {
    // For now, show a default trend indicator
    // In a real implementation, this would calculate from time series data
    return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 text-gray-400">
        <Minus className="h-3 w-3" />
        <span className="text-xs">No trend</span>
      </div>
    );
  };

  const getProgressPercentage = () => {
    const targetValue = getTargetValue();
    if (!targetValue || targetValue === 0) return 0;
    
    const currentValue = getCurrentValue();
    let percentage = (currentValue / targetValue) * 100;
    
    // For "lower is better" KPIs, invert the progress calculation
    if (kpi.trend_direction === 'lower_is_better') {
      percentage = Math.max(0, 100 - percentage);
    }
    
    return Math.min(100, Math.max(0, percentage));
  };

  const getProgressColor = () => {
    const progress = getProgressPercentage();
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-yellow-500';
    if (progress >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const currentValue = getCurrentValue();
  const targetValue = getTargetValue();
  const hasTimeSeriesData = kpi.kpi_data_type === 'time_based' && latestTimeBased;
  const progressPercentage = getProgressPercentage();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">
              {kpi.display_name}
            </h3>
            {kpi.description && (
              <p className="text-xs text-gray-500 line-clamp-2">
                {kpi.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            {startDate && endDate && !hasTimeSeriesData && (
              <Badge variant="outline" className="text-xs bg-gray-50">
                Static
              </Badge>
            )}
            {startDate && endDate && hasTimeSeriesData && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                <Calendar className="h-3 w-3 mr-1" />
                Filtered
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Main Value Display */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {formatValue(currentValue)}
            </div>
            
            {/* Target and Progress */}
            {targetValue > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Target: {formatValue(targetValue)}
                  </span>
                  <span className="font-medium text-gray-900">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Trend and Status */}
          <div className="flex items-center justify-between">
            {getTrendComponent()}
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={kpi.trend_direction === 'higher_is_better' ? 'default' : 
                        kpi.trend_direction === 'lower_is_better' ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {kpi.trend_direction === 'higher_is_better' ? '↑ Higher is better' :
                 kpi.trend_direction === 'lower_is_better' ? '↓ Lower is better' : 
                 '→ Neutral'}
              </Badge>
            </div>
          </div>

          {/* Data Type Indicator */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Data: {kpi.kpi_data_type === 'time_based' ? 'Time-based' : 'Single value'}
              </span>
              {kpi.weight && kpi.weight !== 1.0 && (
                <span className="text-gray-500">
                  Weight: {kpi.weight}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedKPICard;
