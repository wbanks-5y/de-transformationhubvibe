
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { CockpitMetric } from "@/types/cockpit";
import { iconMap } from "@/utils/iconUtils";
import { useCockpitMetricData } from "@/hooks/use-cockpit-metric-data";
import TimeSeriesChart from "./TimeSeriesChart";
import ChartConfigurationMenu, { ChartConfig, ChartType } from "../charts/ChartConfigurationMenu";
import SparklineChart from "./SparklineChart";

interface CompactMetricCardProps {
  metric: CockpitMetric;
  isLarge?: boolean;
}

const CompactMetricCard: React.FC<CompactMetricCardProps> = ({ metric, isLarge = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Default chart configuration without persistence
  const [chartConfig, setChartConfig] = useState<ChartConfig>(() => ({
    chartType: 'line',
    primaryColor: '#3B82F6',
    sortType: 'default',
    sortOrderOverride: false
  }));

  const handleConfigChange = (newConfig: ChartConfig) => {
    setChartConfig(newConfig);
  };

  const handleResetToDefaults = () => {
    setChartConfig({
      chartType: 'line',
      primaryColor: '#3B82F6',
      sortType: 'default',
      sortOrderOverride: false
    });
  };

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const formatValue = (value: string | undefined) => {
    if (!value) return "N/A";
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Format large numbers more compactly
      if (Math.abs(numValue) >= 1000000) {
        return `${(numValue / 1000000).toFixed(1)}M`;
      } else if (Math.abs(numValue) >= 1000) {
        return `${(numValue / 1000).toFixed(1)}K`;
      }
      return numValue.toLocaleString();
    }
    
    return value;
  };

  // Get icon component
  const getIconComponent = () => {
    if (!metric.icon) return null;
    const IconComponent = iconMap[metric.icon];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  // Get metric data for charts - only for chart type metrics
  const { data: metricData = [] } = useCockpitMetricData(
    metric.id,
    metric.metric_data_type,
    undefined,
    undefined,
    10
  );
  
  const hasChart = metric.metric_type === 'chart' && metricData.length > 0;
  const hasSecondaryInfo = metric.description || metric.target_value;

  // Prepare chart data
  const chartData = metricData.map((item: any) => ({
    name: item?.x_axis_value || item?.date_value || 'Data',
    value: Number(item?.y_axis_value || item?.value || 0),
    timestamp: item?.date_value
  }));

  // Convert ChartType to chart component type
  const getChartType = (): 'line' | 'bar' | 'area' => {
    switch (chartConfig?.chartType) {
      case 'bar':
      case 'horizontal_bar':
        return 'bar';
      case 'line':
        return 'line';
      default:
        return 'line';
    }
  };

  // Available chart types for compact metrics
  const getAvailableChartTypes = (): ChartType[] => {
    return ['line', 'bar'];
  };

  const hasData = chartData && chartData.length > 0;

  return (
    <Card className={`${isLarge ? 'col-span-2' : ''} hover:shadow-md transition-shadow duration-200 relative animate-fade-in`}>
      {/* Configuration Menu */}
      {hasChart && (
        <div className="absolute top-2 right-2 z-10">
          <ChartConfigurationMenu
            currentConfig={chartConfig}
            onConfigChange={handleConfigChange}
            availableChartTypes={getAvailableChartTypes()}
            showTimeOptions={false}
            showBusinessOptions={false}
            dataType="number"
            onResetToDefaults={handleResetToDefaults}
            className="h-5 w-5"
          />
        </div>
      )}

      <CardHeader className="pb-2 px-4 pt-3">
        <div className="flex items-start justify-between pr-8">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium text-gray-900 truncate">
              {metric.display_name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {metric.icon && (
              <div className={`${metric.color_class || 'text-gray-600'}`}>
                {getIconComponent()}
              </div>
            )}
            {hasSecondaryInfo && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 transition-colors hover-scale"
              >
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-3">
        {/* Main Value */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl font-bold text-gray-900">
            {formatValue(metric.current_value)}
          </div>
          
          {/* Trend Indicator */}
          {metric.trend && metric.trend !== 'stable' && (
            <div className="flex items-center text-xs">
              {getTrendIcon()}
            </div>
          )}
        </div>

        {/* Target Value - Always visible but compact */}
        {metric.target_value && (
          <div className="text-xs text-gray-500 mb-2">
            Target: {formatValue(metric.target_value)}
          </div>
        )}

        {/* Chart - Enhanced with configuration */}
        {hasChart && (
          <div className="mt-2">
            {isLarge ? (
              <TimeSeriesChart 
                data={chartData}
                height={60}
                chartType={getChartType()}
                primaryColor={chartConfig?.primaryColor || '#3B82F6'}
              />
            ) : (
              <SparklineChart
                data={chartData}
                color={chartConfig?.primaryColor || '#3B82F6'}
                chartType={getChartType() === 'bar' ? 'bar' : 'line'}
                width={120}
                height={40}
              />
            )}
          </div>
        )}
        
        {/* Expandable Description */}
        {isExpanded && metric.description && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600">{metric.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactMetricCard;
