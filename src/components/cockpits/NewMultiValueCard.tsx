
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiValueMetricDisplay } from "@/types/metrics";
import SimpleBarChart from "../charts/SimpleBarChart";
import SimpleLineChart from "../charts/SimpleLineChart";
import SimplePieChart from "../charts/SimplePieChart";
import HorizontalBarChart from "./MultiValueCard/HorizontalBarChart";
import { processChartData } from "./MultiValueCard/utils";
import ChartConfigurationMenu, { ChartConfig, ChartType } from "../charts/ChartConfigurationMenu";

interface NewMultiValueCardProps {
  metric: MultiValueMetricDisplay;
  className?: string;
}

const NewMultiValueCard: React.FC<NewMultiValueCardProps> = ({ metric, className = "" }) => {
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

  console.log('NewMultiValueCard: Rendering metric:', {
    id: metric.id,
    name: metric.display_name,
    chartType: chartConfig.chartType,
    dataPointsCount: metric.data_points?.length || 0,
    fullMetric: metric
  });

  // Transform data points for the charts using the utility function
  const chartData = processChartData(metric.data_points);

  // Apply user's color preference to data
  const dataWithUserColors = chartData.map(point => ({
    ...point,
    color: point.color || chartConfig.primaryColor
  }));

  console.log('NewMultiValueCard: Chart data transformed:', {
    originalDataPoints: metric.data_points,
    transformedData: dataWithUserColors
  });

  // Define available chart types
  const getAvailableChartTypes = (): ChartType[] => {
    const baseTypes: ChartType[] = ['bar', 'horizontal_bar'];
    
    // Add pie/doughnut for data that makes sense as parts of a whole
    if (chartData.length <= 8 && chartData.every(d => d.value >= 0)) {
      baseTypes.push('pie', 'doughnut');
    }
    
    // Add line chart for time-series or ordered data
    if (chartData.length >= 3) {
      baseTypes.push('line');
    }
    
    return baseTypes;
  };

  const renderChart = () => {
    // Use user preference, fallback to metric setting, then default
    const effectiveChartType = chartConfig.chartType || metric.multi_value_data?.chart_type || 'bar';
    const height = getChartHeight();

    console.log('NewMultiValueCard: Rendering chart type:', effectiveChartType);

    switch (effectiveChartType) {
      case 'horizontal_bar':
        console.log('NewMultiValueCard: Rendering horizontal bar chart');
        return (
          <HorizontalBarChart 
            data={dataWithUserColors}
            fontSize={12}
          />
        );

      case 'pie':
        return (
          <SimplePieChart 
            data={dataWithUserColors.map(point => ({
              name: point.name,
              value: point.value,
              color: point.color
            }))}
            height={height}
            innerRadius={0}
            outerRadius={Math.min(height / 3, 80)}
          />
        );

      case 'doughnut':
        return (
          <SimplePieChart 
            data={dataWithUserColors.map(point => ({
              name: point.name,
              value: point.value,
              color: point.color
            }))}
            height={height}
            innerRadius={30}
            outerRadius={Math.min(height / 3, 80)}
          />
        );

      case 'line':
        return (
          <SimpleLineChart 
            data={dataWithUserColors.map(point => ({
              name: point.name,
              value: point.value
            }))}
            height={height}
            color={chartConfig.primaryColor}
          />
        );

      case 'bar':
      default:
        console.log('NewMultiValueCard: Rendering regular bar chart with data:', dataWithUserColors);
        return (
          <SimpleBarChart 
            data={dataWithUserColors}
            height={height}
            color={chartConfig.primaryColor}
          />
        );
    }
  };

  const getChartHeight = () => {
    switch (metric.size_config) {
      case 'small': return 120;
      case 'medium': return 160;
      case 'large': return 200;
      case 'xl': return 240;
      default: return 160;
    }
  };

  const getCardSize = () => {
    switch (metric.size_config) {
      case 'small': return 'h-48';
      case 'medium': return 'h-64';
      case 'large': return 'h-80';
      case 'xl': return 'h-96';
      default: return 'h-64';
    }
  };

  const handleExport = () => {
    // TODO: Implement chart export functionality
    console.log('Export chart functionality to be implemented');
  };

  const hasData = chartData.length > 0;

  return (
    <Card className={`${getCardSize()} hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800 line-clamp-2">
            {metric.display_name}
          </CardTitle>
          {hasData && (
            <ChartConfigurationMenu
              currentConfig={chartConfig}
              onConfigChange={handleConfigChange}
              availableChartTypes={getAvailableChartTypes()}
              onResetToDefaults={handleResetToDefaults}
            />
          )}
        </div>
        {metric.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {metric.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 h-full">
        {!hasData ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <p className="text-sm">No data available</p>
              <p className="text-xs mt-1">Add data points to see the chart</p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            {renderChart()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewMultiValueCard;
