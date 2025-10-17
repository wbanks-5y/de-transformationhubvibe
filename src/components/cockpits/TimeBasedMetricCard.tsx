
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeBasedMetricDisplay } from "@/types/metrics";
import TimeRangeSelector from "./TimeRangeSelector";
import D3BarChart from "../charts/d3/D3BarChart";
import D3LineChart from "../charts/d3/D3LineChart";
import D3ResponsiveChart from "../charts/d3/D3ResponsiveChart";
import ChartConfigurationMenu, { ChartConfig, ChartType } from "../charts/ChartConfigurationMenu";
import ChartSortingControls, { SortType } from "../charts/ChartSortingControls";
import { format, parseISO, isAfter, isBefore, subDays, subMonths, subYears } from "date-fns";

interface TimeBasedMetricCardProps {
  metric: TimeBasedMetricDisplay;
  sizeConfig?: 'small' | 'medium' | 'large' | 'xl';
}

type TimeRangeValue = '7d' | '30d' | '3m' | '6m' | '1y' | 'all';

const TimeBasedMetricCard: React.FC<TimeBasedMetricCardProps> = ({ 
  metric, 
  sizeConfig = 'medium' 
}) => {
  console.log('TimeBasedMetricCard: Rendering metric:', {
    id: metric?.id,
    name: metric?.display_name,
    hasTimeBasedData: !!metric?.time_based_data,
    chartType: metric?.time_based_data?.chart_type,
    dataPointsCount: metric?.data_points?.length || 0
  });

  // Convert time-based chart types to ChartType with safety check
  const getValidTimeBasedChartType = (type?: string): ChartType => {
    if (!type) return 'line';
    
    switch (type) {
      case 'line':
      case 'stepped_line':
      case 'smooth_line':
        return 'line';
      case 'bar':
      case 'stacked_bar':
        return 'bar';
      case 'area':
      case 'stacked_area':
        return 'line'; // Use line chart for area charts in D3
      default:
        return 'line';
    }
  };

  // Default chart configuration without persistence
  const [chartConfig, setChartConfig] = useState<ChartConfig>(() => ({
    chartType: getValidTimeBasedChartType(metric?.time_based_data?.chart_type) || 'line',
    primaryColor: '#3B82F6',
    sortType: 'chronological' as SortType,
    sortOrderOverride: false
  }));

  // Update config when changes are made
  const handleConfigChange = (newConfig: ChartConfig) => {
    console.log('TimeBasedMetricCard: Updating config:', newConfig);
    setChartConfig(newConfig);
  };

  const handleResetToDefaults = () => {
    const defaultConfig = {
      chartType: getValidTimeBasedChartType(metric?.time_based_data?.chart_type) || 'line',
      primaryColor: '#3B82F6',
      sortType: 'chronological' as SortType,
      sortOrderOverride: false
    };
    setChartConfig(defaultConfig);
  };

  // Set default time range based on granularity - 'all' for yearly data, '1y' for others
  const getDefaultTimeRange = (): TimeRangeValue => {
    return metric?.time_based_data?.time_granularity === 'year' ? 'all' : '1y';
  };

  // Use state for time range and sorting
  const [timeRange, setTimeRange] = useState<TimeRangeValue>(getDefaultTimeRange());

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

  // Filter data based on time range
  const getFilteredData = () => {
    if (!metric?.data_points || metric.data_points.length === 0) {
      console.log('TimeBasedMetricCard: No data points available');
      return [];
    }

    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '3m':
        startDate = subMonths(now, 3);
        break;
      case '6m':
        startDate = subMonths(now, 6);
        break;
      case '1y':
        startDate = subYears(now, 1);
        break;
      case 'all':
        return metric.data_points;
      default:
        startDate = subYears(now, 1);
    }

    return metric.data_points.filter(point => {
      if (!point.date_value) return true;
      
      try {
        const pointDate = parseISO(point.date_value);
        return isAfter(pointDate, startDate);
      } catch (error) {
        console.warn('TimeBasedMetricCard: Error parsing date:', point.date_value, error);
        return true;
      }
    });
  };

  // Enhanced sorting function for time-based data
  const sortTimeBasedData = (data: any[]) => {
    return [...data].sort((a, b) => {
      // Primary sort: by actual date if available
      if (a.date_value && b.date_value) {
        try {
          const dateA = new Date(a.date_value);
          const dateB = new Date(b.date_value);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
          }
        } catch (error) {
          console.warn('TimeBasedMetricCard: Error comparing dates:', error);
        }
      }
      
      // Secondary sort: by year, then by period within year
      if (a.year !== b.year) {
        return (a.year || 0) - (b.year || 0);
      }
      
      // Sort by period within the same year based on granularity
      switch (metric?.time_based_data?.time_granularity) {
        case 'quarter':
          return (a.quarter || 1) - (b.quarter || 1);
        case 'month':
          return (a.month || 1) - (b.month || 1);
        case 'week':
          return (a.week || 1) - (b.week || 1);
        case 'day':
          if (a.month !== b.month) return (a.month || 1) - (b.month || 1);
          return (a.day || 1) - (b.day || 1);
        default:
          return 0;
      }
    });
  };

  // Apply user-selected sorting
  const applyUserSorting = (data: any[], sortType: SortType) => {
    const sortedData = [...data];
    
    switch (sortType) {
      case 'chronological':
      case 'default':
        return sortTimeBasedData(sortedData);
      case 'reverse-chronological':
        return sortTimeBasedData(sortedData).reverse();
      case 'value-ascending':
        return sortedData.sort((a, b) => (a.value || 0) - (b.value || 0));
      case 'value-descending':
        return sortedData.sort((a, b) => (b.value || 0) - (a.value || 0));
      case 'alphabetical':
        return sortedData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'reverse-alphabetical':
        return sortedData.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      default:
        return sortTimeBasedData(sortedData);
    }
  };

  const processChartData = () => {
    try {
      const filteredData = getFilteredData();
      
      if (!filteredData || filteredData.length === 0) {
        console.log('TimeBasedMetricCard: No filtered data available');
        return [];
      }

      // Transform data for D3 charts first
      const chartData = filteredData.map(point => {
        // Create time label based on granularity
        let timeLabel = '';
        
        if (point.date_value) {
          try {
            const date = parseISO(point.date_value);
            switch (metric?.time_based_data?.time_granularity) {
              case 'day':
                timeLabel = format(date, 'MMM dd');
                break;
              case 'week':
                timeLabel = `Week ${point.week || 1}`;
                break;
              case 'month':
                timeLabel = format(date, 'MMM yyyy');
                break;
              case 'quarter':
                timeLabel = `Q${point.quarter || 1} ${point.year || ''}`;
                break;
              case 'year':
                timeLabel = String(point.year || '');
                break;
              default:
                timeLabel = format(date, 'MMM yyyy');
            }
          } catch (error) {
            console.warn('TimeBasedMetricCard: Error formatting date:', point.date_value, error);
            timeLabel = String(point.year || 'Unknown');
          }
        } else {
          // Fallback for missing date_value
          if (point.year) {
            if (point.month) {
              timeLabel = `${String(point.month).padStart(2, '0')}/${point.year}`;
            } else if (point.quarter) {
              timeLabel = `Q${point.quarter} ${point.year}`;
            } else {
              timeLabel = String(point.year);
            }
          } else {
            timeLabel = 'Unknown';
          }
        }
        
        return {
          name: timeLabel,
          value: Number(point.value || 0),
          color: chartConfig?.primaryColor || '#3B82F6',
          seriesName: point.series_name
        };
      });

      // Apply user-selected sorting
      return applyUserSorting(chartData, chartConfig?.sortType || 'chronological');
    } catch (error) {
      console.error('TimeBasedMetricCard: Error processing chart data:', error);
      return [];
    }
  };

  const chartData = processChartData();

  // Check if we have multiple series
  const uniqueSeriesNames = new Set(chartData.map(point => point.seriesName).filter(Boolean));
  const hasMultipleSeries = uniqueSeriesNames.size > 1;

  // Define available chart types for time-based data
  const getAvailableChartTypes = (): ChartType[] => {
    return ['line', 'bar'];
  };

  const renderChart = (dimensions: { width: number; height: number }) => {
    const effectiveChartType = chartConfig?.chartType || 'line';
    
    console.log('TimeBasedMetricCard: Rendering chart:', {
      type: effectiveChartType,
      dataLength: chartData.length,
      dimensions,
      primaryColor: chartConfig?.primaryColor
    });
    
    switch (effectiveChartType) {
      case 'bar':
        return (
          <D3BarChart 
            data={chartData}
            width={dimensions.width}
            height={dimensions.height}
            isHorizontal={false}
            showSeriesLabels={hasMultipleSeries}
          />
        );

      case 'line':
      default:
        return (
          <D3LineChart 
            data={chartData}
            width={dimensions.width}
            height={dimensions.height}
            color={chartConfig?.primaryColor || '#3B82F6'}
            strokeWidth={2}
          />
        );
    }
  };

  const hasData = chartData && chartData.length > 0;

  // Create time range options for the selector
  const timeRangeOptions = [
    { value: '7d' as TimeRangeValue, label: '7 Days' },
    { value: '30d' as TimeRangeValue, label: '30 Days' },
    { value: '3m' as TimeRangeValue, label: '3 Months' },
    { value: '6m' as TimeRangeValue, label: '6 Months' },
    { value: '1y' as TimeRangeValue, label: '1 Year' },
    { value: 'all' as TimeRangeValue, label: 'All Time' }
  ];

  // Safety check for metric
  if (!metric) {
    console.error('TimeBasedMetricCard: No metric provided');
    return (
      <Card className="h-64 flex items-center justify-center">
        <p className="text-red-600">Error: No metric data available</p>
      </Card>
    );
  }

  return (
    <Card className={`${getSizeClasses()} ${getCardHeight()} flex flex-col`}>
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {metric.display_name || 'Untitled Metric'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasData && (
              <ChartConfigurationMenu
                currentConfig={chartConfig}
                onConfigChange={handleConfigChange}
                availableChartTypes={getAvailableChartTypes()}
                showTimeOptions={true}
                showBusinessOptions={false}
                dataType="date"
                onResetToDefaults={handleResetToDefaults}
                className="mr-2"
              />
            )}
            <TimeRangeSelector 
              value={timeRange}
              onChange={(value: string) => setTimeRange(value as TimeRangeValue)}
              options={timeRangeOptions}
            />
          </div>
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
            <D3ResponsiveChart 
              aspectRatio={sizeConfig === 'small' ? 16/9 : 16/10}
              minWidth={120}
              minHeight={80}
            >
              {(dimensions) => renderChart(dimensions)}
            </D3ResponsiveChart>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No data available for the selected time range</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeBasedMetricCard;
