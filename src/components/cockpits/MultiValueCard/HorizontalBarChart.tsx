
import React from "react";
import SimpleHorizontalBarChart from "./SimpleHorizontalBarChart";
import { ChartDataPoint, isMultiSeriesData } from "./utils";

interface HorizontalBarChartProps {
  data: ChartDataPoint[];
  fontSize: number;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  fontSize
}) => {
  console.log('HorizontalBarChart (wrapper) rendering:', { data, fontSize });

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  // Check if this is truly multi-series data
  const isMultiSeries = isMultiSeriesData(data);
  
  console.log('HorizontalBarChart analysis:', {
    isMultiSeries,
    dataLength: data.length,
    sampleData: data.slice(0, 2)
  });

  if (isMultiSeries) {
    // For now, we'll use the simple component even for multi-series
    // This can be extended later with a dedicated multi-series component
    console.log('Multi-series detected, but using simple component for now');
  }

  return (
    <SimpleHorizontalBarChart 
      data={data}
      fontSize={fontSize}
    />
  );
};

export default HorizontalBarChart;
