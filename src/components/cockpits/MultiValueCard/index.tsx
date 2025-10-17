import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiValueMetricDisplay } from "@/types/metrics";
import { processChartData, detectDataType, applySorting } from "./utils";
import BarChart from "./BarChart";
import HorizontalBarChart from "./HorizontalBarChart";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import ChartConfigurationMenu, { ChartConfig, ChartType } from "../../charts/ChartConfigurationMenu";

interface MultiValueCardProps {
  metric: MultiValueMetricDisplay;
  sizeConfig?: 'small' | 'medium' | 'large' | 'xl';
}

const MultiValueCard: React.FC<MultiValueCardProps> = ({ metric, sizeConfig = 'medium' }) => {
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

  // Get size classes based on config
  const getSizeClasses = () => {
    switch (sizeConfig) {
      case 'small': return 'col-span-1 row-span-1';
      case 'medium': return 'col-span-2 row-span-1';
      case 'large': return 'col-span-3 row-span-2';
      case 'xl': return 'col-span-4 row-span-2';
      default: return 'col-span-2 row-span-1';
    }
  };

  const getCardHeight = () => {
    switch (sizeConfig) {
      case 'small': return 'h-64';
      case 'medium': return 'h-80';
      case 'large': return 'h-96';
      case 'xl': return 'h-[32rem]';
      default: return 'h-80';
    }
  };

  const getFontSize = () => {
    switch (sizeConfig) {
      case 'xl': return 14;
      case 'large': return 12;
      case 'medium': return 11;
      case 'small': return 10;
      default: return 11;
    }
  };

  // Process chart data without automatic sorting
  const processedData = processChartData(metric.data_points || []);
  
  // Detect data type for smart sorting options
  const dataType = detectDataType(processedData);
  
  // Apply user-selected sorting - THIS IS THE FINAL SORT
  const sortedData = applySorting(processedData, chartConfig.sortType);

  console.log('MultiValueCard FINAL sorted data for charts:', {
    metricName: metric.display_name,
    sortType: chartConfig.sortType,
    dataLength: sortedData.length,
    finalOrder: sortedData.map(d => d.name),
    chartType: chartConfig.chartType
  });

  // Override chart type with user preference, fallback to metric setting
  const effectiveChartType = chartConfig.chartType || metric.multi_value_data?.chart_type || 'bar';

  // Apply user's color preference to data with proper override logic
  const dataWithUserColors = sortedData.map(point => {
    // Check if user has selected a non-default color (not the default blue)
    const hasUserSelectedColor = chartConfig.primaryColor !== '#3B82F6';
    
    // For single-series data or when user has actively selected a color, 
    // prioritize the user's primary color choice
    if (hasUserSelectedColor || !point.color) {
      return {
        ...point,
        color: chartConfig.primaryColor
      };
    }
    
    // For multi-series data where user hasn't changed color, keep original colors
    return {
      ...point,
      color: point.color || chartConfig.primaryColor
    };
  });

  console.log('Color application logic:', {
    primaryColor: chartConfig.primaryColor,
    hasUserSelectedColor: chartConfig.primaryColor !== '#3B82F6',
    originalDataColors: sortedData.map(d => ({ name: d.name, color: d.color })),
    finalDataColors: dataWithUserColors.map(d => ({ name: d.name, color: d.color }))
  });

  // Determine if we should show time-based sorting options
  const hasTimeData = processedData.some(point => 
    /\d{4}/.test(point.name) || // Contains year
    /q[1-4]/i.test(point.name) || // Contains quarter
    /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(point.name) // Contains month
  );

  // Determine if we should show business-specific sorting options
  const hasBusinessData = dataType === 'aging' || dataType === 'priority';

  // Define available chart types based on data characteristics
  const getAvailableChartTypes = (): ChartType[] => {
    const baseTypes: ChartType[] = ['bar', 'horizontal_bar'];
    
    // Add pie/doughnut for data that makes sense as parts of a whole
    if (sortedData.length <= 8 && sortedData.every(d => d.value >= 0)) {
      baseTypes.push('pie', 'doughnut');
    }
    
    // Add line chart for time-series or ordered data
    if (hasTimeData || sortedData.length >= 3) {
      baseTypes.push('line');
    }
    
    return baseTypes;
  };

  const renderChart = () => {    
    console.log(`Rendering ${effectiveChartType} chart with user-colored data:`, dataWithUserColors.map(d => ({ name: d.name, color: d.color })));
    
    switch (effectiveChartType) {
      case 'horizontal_bar':
        return <HorizontalBarChart data={dataWithUserColors} fontSize={getFontSize()} />;
      case 'pie':
      case 'doughnut':
        return <PieChart data={dataWithUserColors} chartType={effectiveChartType} sizeConfig={sizeConfig} />;
      case 'line':
        return <LineChart data={dataWithUserColors} sizeConfig={sizeConfig} />;
      default:
        return <BarChart data={dataWithUserColors} sizeConfig={sizeConfig} />;
    }
  };

  const hasData = dataWithUserColors && dataWithUserColors.length > 0;

  return (
    <Card className={`${getSizeClasses()} ${getCardHeight()} flex flex-col`}>
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {metric.display_name}
          </CardTitle>
          {hasData && (
            <ChartConfigurationMenu
              currentConfig={chartConfig}
              onConfigChange={handleConfigChange}
              availableChartTypes={getAvailableChartTypes()}
              showTimeOptions={hasTimeData}
              showBusinessOptions={hasBusinessData}
              dataType={dataType}
              onResetToDefaults={handleResetToDefaults}
              className="ml-auto"
            />
          )}
        </div>
        {metric.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {metric.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 min-h-0">
        {hasData ? (
          <div className="h-full w-full">
            {renderChart()}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiValueCard;
