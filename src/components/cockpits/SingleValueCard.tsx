import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { CockpitMetric } from "@/types/cockpit";
import { useCockpitMetricData } from "@/hooks/use-cockpit-metric-data";
import ChartConfigurationMenu, { ChartConfig, ChartType } from "../charts/ChartConfigurationMenu";
import SingleValueGauge from "./SingleValueGauge";
import SparklineChart from "./SparklineChart";

interface SingleValueCardProps {
  metric: CockpitMetric;
  isLarge?: boolean;
}

type SingleValueChartType = 'gauge' | 'progress' | 'sparkline' | 'none';

const SingleValueCard: React.FC<SingleValueCardProps> = ({ metric, isLarge = false }) => {
  // Default chart configuration without persistence
  const [chartConfig, setChartConfig] = useState<ChartConfig>(() => ({
    chartType: 'bar',
    primaryColor: '#3B82F6',
    sortType: 'default',
    sortOrderOverride: false
  }));

  // Update config when changes are made
  const handleConfigChange = (newConfig: ChartConfig) => {
    setChartConfig(newConfig);
  };

  const handleResetToDefaults = () => {
    setChartConfig({
      chartType: 'bar',
      primaryColor: '#3B82F6',
      sortType: 'default',
      sortOrderOverride: false
    });
  };

  // Get recent metric data for sparkline
  const { data: metricData = [] } = useCockpitMetricData(
    metric.id,
    metric.metric_data_type,
    undefined,
    undefined,
    10 // Last 10 data points for sparkline
  );

  const currentValue = parseFloat(metric.current_value || "0");
  const targetValue = parseFloat(metric.target_value || "0");
  
  const formatValue = (value: number, type: string) => {
    switch (type) {
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
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get size-specific styles
  const getSizeStyles = () => {
    const size = metric.size_config || 'medium';
    
    switch (size) {
      case 'small':
        return {
          card: 'min-h-[180px]',
          title: 'text-sm',
          value: 'text-2xl',
          target: 'text-xs',
          padding: 'p-3'
        };
      case 'medium':
        return {
          card: 'min-h-[220px]',
          title: 'text-base',
          value: 'text-3xl',
          target: 'text-sm',
          padding: 'p-4'
        };
      case 'large':
        return {
          card: 'min-h-[280px]',
          title: 'text-lg',
          value: 'text-4xl',
          target: 'text-base',
          padding: 'p-6'
        };
      case 'xl':
        return {
          card: 'min-h-[350px]',
          title: 'text-xl',
          value: 'text-5xl',
          target: 'text-lg',
          padding: 'p-8'
        };
      default:
        return {
          card: 'min-h-[220px]',
          title: 'text-base',
          value: 'text-3xl',
          target: 'text-sm',
          padding: 'p-4'
        };
    }
  };

  const styles = getSizeStyles();
  const targetPercentage = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
  const isAboveTarget = currentValue >= targetValue && targetValue > 0;

  // Convert ChartType to visualization type
  const getVisualizationType = (): SingleValueChartType => {
    switch (chartConfig?.chartType) {
      case 'pie':
      case 'doughnut':
        return 'gauge';
      case 'line':
        return 'sparkline';
      case 'bar':
      case 'horizontal_bar':
        return 'progress';
      default:
        return 'progress';
    }
  };

  const visualizationType = getVisualizationType();

  // Prepare sparkline data
  const sparklineData = metricData.map((item: any) => ({
    value: Number(item?.y_axis_value || item?.value || 0),
    timestamp: item?.date_value
  }));

  // Available chart types for single value metrics
  const getAvailableChartTypes = (): ChartType[] => {
    return ['bar', 'horizontal_bar', 'pie', 'doughnut', 'line'];
  };

  // Render visualization
  const renderVisualization = () => {
    switch (visualizationType) {
      case 'gauge':
        return targetValue > 0 ? (
          <div className="mt-4 flex justify-center">
            <SingleValueGauge
              value={currentValue}
              target={targetValue}
              color={chartConfig?.primaryColor || '#3B82F6'}
              size={metric.size_config === 'small' ? 'small' : metric.size_config === 'large' || metric.size_config === 'xl' ? 'large' : 'medium'}
            />
          </div>
        ) : null;
      
      case 'sparkline':
        return sparklineData.length > 0 ? (
          <div className="mt-4 flex justify-center">
            <SparklineChart
              data={sparklineData}
              color={chartConfig?.primaryColor || '#3B82F6'}
              chartType={chartConfig?.chartType === 'line' ? 'line' : 'bar'}
              width={styles.padding === 'p-3' ? 100 : 140}
              height={styles.padding === 'p-3' ? 30 : 40}
            />
          </div>
        ) : null;
      
      case 'progress':
      default:
        return targetValue > 0 ? (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-gray-500" />
                <span className={`${styles.target} text-gray-600`}>Target</span>
              </div>
              <span className={`${styles.target} font-medium text-gray-800`}>
                {formatValue(targetValue, metric.metric_type || 'number')}
              </span>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300`}
                style={{ 
                  width: `${Math.min(targetPercentage, 100)}%`,
                  backgroundColor: chartConfig?.primaryColor || '#3B82F6'
                }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`${styles.target} text-gray-600`}>
                {targetPercentage.toFixed(1)}% of target
              </span>
              {isAboveTarget && (
                <span className={`${styles.target} text-green-600 font-medium`}>
                  ✓ Target achieved
                </span>
              )}
            </div>
          </div>
        ) : null;
    }
  };

  return (
    <Card className={`${styles.card} hover:shadow-lg transition-shadow duration-200 relative`}>
      {/* Chart Configuration Menu */}
      <div className="absolute top-2 right-2 z-10">
        <ChartConfigurationMenu
          currentConfig={chartConfig}
          onConfigChange={handleConfigChange}
          availableChartTypes={getAvailableChartTypes()}
          showTimeOptions={false}
          showBusinessOptions={false}
          dataType="number"
          onResetToDefaults={handleResetToDefaults}
        />
      </div>

      <CardHeader className={`pb-2 ${styles.padding}`}>
        <CardTitle className={`${styles.title} font-semibold text-gray-800 line-clamp-2`}>
          {metric.display_name}
        </CardTitle>
        {metric.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
            {metric.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className={`${styles.padding} pt-0 flex-1 flex flex-col justify-between`}>
        <div className="space-y-2 flex-1 flex flex-col justify-center">
          {/* Main Value */}
          <div className="text-center">
            <div className={`${styles.value} font-bold text-gray-900 leading-tight`}>
              {formatValue(currentValue, metric.metric_type || 'number')}
            </div>
            
            {/* Trend Indicator */}
            <div className={`flex items-center justify-center gap-1 mt-2 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium capitalize">
                {metric.trend || 'stable'}
              </span>
            </div>
          </div>

          {/* Visualization */}
          {renderVisualization()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SingleValueCard;
