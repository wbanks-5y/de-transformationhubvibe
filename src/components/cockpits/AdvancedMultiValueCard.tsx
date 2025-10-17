import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiValueMetricDisplay } from "@/types/metrics";
import SimpleBarChart from "../charts/SimpleBarChart";
import SimpleLineChart from "../charts/SimpleLineChart";
import SimplePieChart from "../charts/SimplePieChart";
import HorizontalBarChart from "./MultiValueCard/HorizontalBarChart";
import { processChartData } from "./MultiValueCard/utils";

interface AdvancedMultiValueCardProps {
  metric: MultiValueMetricDisplay;
  className?: string;
}

const AdvancedMultiValueCard: React.FC<AdvancedMultiValueCardProps> = ({ metric, className = "" }) => {
  console.log('AdvancedMultiValueCard: Rendering metric:', {
    id: metric.id,
    name: metric.display_name,
    chartType: metric.multi_value_data?.chart_type,
    dataPointsCount: metric.data_points?.length || 0,
    sampleDataPoint: metric.data_points?.[0]
  });

  // Transform data points for charts using the utility function
  const chartData = processChartData(metric.data_points);

  console.log('AdvancedMultiValueCard: Processed chart data:', chartData);

  const renderChart = () => {
    const chartType = metric.multi_value_data?.chart_type;
    const height = getChartHeight();

    console.log('AdvancedMultiValueCard: Rendering chart type:', chartType);

    switch (chartType) {
      case 'horizontal_bar':
        return (
          <HorizontalBarChart 
            data={chartData}
            fontSize={12}
          />
        );

      case 'pie':
        return (
          <SimplePieChart 
            data={chartData.map(point => ({
              name: point.name,
              value: point.value,
              color: point.color || '#3B82F6'
            }))}
            height={height}
            innerRadius={0}
            outerRadius={Math.min(height / 3, 80)}
          />
        );

      case 'doughnut':
        return (
          <SimplePieChart 
            data={chartData.map(point => ({
              name: point.name,
              value: point.value,
              color: point.color || '#3B82F6'
            }))}
            height={height}
            innerRadius={30}
            outerRadius={Math.min(height / 3, 80)}
          />
        );

      case 'line':
        return (
          <SimpleLineChart 
            data={chartData.map(point => ({
              name: point.name,
              value: point.value,
              color: point.color || '#3B82F6'
            }))}
            height={height}
            color="#3B82F6"
            strokeWidth={2}
          />
        );

      case 'bar':
      default:
        return (
          <SimpleBarChart 
            data={chartData}
            height={height}
            color="#3B82F6"
          />
        );
    }
  };

  const getCardHeight = () => {
    switch (metric.size_config) {
      case 'small': return 'h-64';
      case 'medium': return 'h-80';
      case 'large': return 'h-96';
      case 'xl': return 'h-[32rem]';
      default: return 'h-80';
    }
  };

  const getChartHeight = () => {
    switch (metric.size_config) {
      case 'small': return 180;
      case 'medium': return 240;
      case 'large': return 300;
      case 'xl': return 380;
      default: return 240;
    }
  };

  const getHeaderConfig = () => {
    const isSmall = metric.size_config === 'small';
    return {
      titleSize: isSmall ? 'text-sm' : 'text-base',
      descriptionSize: isSmall ? 'text-xs' : 'text-sm',
      headerPadding: isSmall ? 'pb-1' : 'pb-2'
    };
  };

  const headerConfig = getHeaderConfig();

  return (
    <Card className={`${getCardHeight()} hover:shadow-lg transition-all duration-300 border-0 shadow-md flex flex-col ${className}`}>
      <CardHeader className={`${headerConfig.headerPadding} space-y-1 flex-shrink-0`}>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className={`${headerConfig.titleSize} font-bold text-gray-900 leading-tight line-clamp-2`}>
              {metric.display_name}
            </CardTitle>
            {metric.description && (
              <p className={`${headerConfig.descriptionSize} text-gray-600 line-clamp-1`}>
                {metric.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`flex-1 min-h-0 ${metric.size_config === 'small' ? 'p-3 pt-0' : 'p-4 pt-0'}`}>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-xs font-medium">No data available</p>
              <p className="text-xs mt-1 text-gray-400">Add data points to see the visualization</p>
            </div>
          </div>
        ) : (
          <div className="h-full w-full">
            {renderChart()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedMultiValueCard;
