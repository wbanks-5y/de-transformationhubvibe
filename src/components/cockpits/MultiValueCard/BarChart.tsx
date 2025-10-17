
import React from "react";
import { ChartDataPoint } from "./utils";
import { processMultiSeriesData } from "./chartDataProcessor";
import HorizontalBarChart from "./HorizontalBarChart";
import VerticalBarChart from "./VerticalBarChart";

interface BarChartComponentProps {
  data: ChartDataPoint[];
  sizeConfig?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  isHorizontal?: boolean;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ 
  data, 
  sizeConfig = 'medium', 
  xAxisLabel, 
  yAxisLabel,
  isHorizontal = false
}) => {
  console.log('BarChartComponent props:', { data, sizeConfig, isHorizontal });

  const getFontSize = () => {
    switch (sizeConfig) {
      case 'xl': return 14;
      case 'large': return 12;
      case 'medium': return 11;
      case 'small': return 10;
      default: return 11;
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-sm">No data available</p>
          <p className="text-xs mt-1">Add data points to see the chart</p>
        </div>
      </div>
    );
  }

  if (isHorizontal) {
    return (
      <HorizontalBarChart
        data={data}
        fontSize={getFontSize()}
      />
    );
  }

  return (
    <VerticalBarChart
      data={data}
      fontSize={getFontSize()}
    />
  );
};

export default BarChartComponent;
