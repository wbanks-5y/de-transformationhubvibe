
import React, { useState } from "react";
import { CockpitMetric } from "@/types/cockpit";
import { useCockpitMetricData } from "@/hooks/use-cockpit-metric-data";
import TimeSeriesChart from "./TimeSeriesChart";
import ChartConfigurationMenu, { ChartConfig, ChartType } from "../charts/ChartConfigurationMenu";
import { Loader2 } from "lucide-react";

interface MetricChartRendererProps {
  metric: CockpitMetric;
  startDate?: Date;
  endDate?: Date;
}

type ValidChartType = 'line' | 'bar' | 'area';

const MetricChartRenderer: React.FC<MetricChartRendererProps> = ({
  metric,
  startDate,
  endDate
}) => {
  console.log('MetricChartRenderer props:', {
    metricId: metric?.id,
    metricName: metric?.name,
    metricType: metric?.metric_type,
    metricDataType: metric?.metric_data_type,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString()
  });

  // Default chart configuration without persistence
  const [chartConfig, setChartConfig] = useState<ChartConfig>(() => ({
    chartType: 'line',
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
      chartType: 'line',
      primaryColor: '#3B82F6',
      sortType: 'default',
      sortOrderOverride: false
    });
  };

  // Safety check for metric
  if (!metric) {
    console.error('MetricChartRenderer: No metric provided');
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error: No metric data</p>
          <p className="text-xs text-red-400">Metric data is required to render chart</p>
        </div>
      </div>
    );
  }

  // Only render charts for metrics that are configured as chart type
  if (metric.metric_type !== 'chart') {
    console.log('Metric is not a chart type, skipping chart rendering:', {
      metricId: metric.id,
      metricType: metric.metric_type
    });
    return null;
  }

  // Convert Date objects to strings for the API call
  const startDateString = startDate ? startDate.toISOString().split('T')[0] : undefined;
  const endDateString = endDate ? endDate.toISOString().split('T')[0] : undefined;

  // Fetch metric data
  const { data: metricData, isLoading, error } = useCockpitMetricData(
    metric.id,
    metric.metric_data_type,
    startDateString,
    endDateString
  );

  if (isLoading) {
    console.log('Loading metric data for:', metric.id);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-gray-600">Loading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching metric data:', error);
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading data</p>
          <p className="text-xs text-red-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!metricData || metricData.length === 0) {
    console.log('No data available for metric:', metric.id);
    return (
      <div className="flex items-center justify-center h-64 bg-yellow-50 rounded-lg">
        <div className="text-center">
          <p className="text-yellow-700 mb-2">No data found</p>
          <p className="text-xs text-yellow-600">
            Add data points for this metric to see the chart
          </p>
        </div>
      </div>
    );
  }

  // Prepare chart data with safety checks
  const chartData = metricData.map((item: any) => ({
    name: item?.x_axis_value || item?.date_value || 'Data',
    value: Number(item?.y_axis_value || item?.value || 0),
    timestamp: item?.date_value
  }));

  console.log('Rendering chart with data:', {
    metricId: metric.id,
    dataLength: chartData.length,
    firstDataPoint: chartData[0],
    lastDataPoint: chartData[chartData.length - 1]
  });

  // Define available chart types
  const getAvailableChartTypes = (): ChartType[] => {
    return ['line', 'bar'];
  };

  // Convert ChartType to ValidChartType
  const getValidChartType = (chartType: ChartType): ValidChartType => {
    switch (chartType) {
      case 'line':
        return 'line';
      case 'bar':
        return 'bar';
      default:
        return 'line';
    }
  };

  const hasData = chartData && chartData.length > 0;

  return (
    <div className="relative">
      {/* Chart Configuration Menu */}
      {hasData && (
        <div className="absolute top-2 right-2 z-10">
          <ChartConfigurationMenu
            currentConfig={chartConfig}
            onConfigChange={handleConfigChange}
            availableChartTypes={getAvailableChartTypes()}
            showTimeOptions={true}
            showBusinessOptions={false}
            dataType="date"
            onResetToDefaults={handleResetToDefaults}
          />
        </div>
      )}

      {/* Chart */}
      <TimeSeriesChart
        data={chartData}
        height={300}
        chartType={getValidChartType(chartConfig?.chartType || 'line')}
        primaryColor={chartConfig?.primaryColor || '#3B82F6'}
      />
    </div>
  );
};

export default MetricChartRenderer;
