
import React from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SeriesData {
  name: string;
  color: string;
  data: any[];
}

interface TimeSeriesChartProps {
  data: any[];
  height?: number;
  chartType?: 'line' | 'area' | 'bar';
  seriesData?: SeriesData[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  primaryColor?: string;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ 
  data, 
  height = 300, 
  chartType = 'line',
  seriesData,
  xAxisLabel = "Time",
  yAxisLabel = "Value",
  primaryColor = "#3B82F6"
}) => {
  console.log('TimeSeriesChart rendering with:', {
    dataLength: data?.length || 0,
    seriesDataLength: seriesData?.length || 0,
    chartType,
    primaryColor,
    seriesColors: seriesData?.map(s => ({ name: s.name, color: s.color })) || [],
    sampleData: data?.slice(0, 2) || []
  });

  // Check if we should show legend (multiple series)
  const showLegend = seriesData && seriesData.length > 1;

  // If seriesData is provided, we need to merge all series data into a single dataset
  // with each series as a separate key
  const chartData = seriesData && seriesData.length > 0 ? (() => {
    // Create a map of all unique time points
    const timePointsMap = new Map();
    
    seriesData.forEach(series => {
      series.data.forEach(point => {
        const timeKey = point.name;
        if (!timePointsMap.has(timeKey)) {
          timePointsMap.set(timeKey, { name: timeKey, timestamp: point.timestamp });
        }
        timePointsMap.get(timeKey)[series.name] = point.value;
      });
    });
    
    // Convert to array and sort by timestamp
    return Array.from(timePointsMap.values()).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  })() : data;

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: showLegend ? 40 : 5 }
    };

    const xAxisProps = {
      dataKey: "name",
      tick: { fontSize: 12 },
      angle: -45,
      textAnchor: "end" as const,
      height: 60,
      label: { 
        value: xAxisLabel, 
        position: 'insideBottom' as const, 
        offset: -5,
        style: { textAnchor: 'middle', fontSize: 11, fill: '#6b7280' }
      }
    };

    const yAxisProps = {
      tick: { fontSize: 12 },
      label: { 
        value: yAxisLabel, 
        angle: -90, 
        position: 'insideLeft' as const,
        style: { textAnchor: 'middle', fontSize: 11, fill: '#6b7280' }
      }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip />
            {showLegend && <Legend />}
            {seriesData && seriesData.length > 0 ? (
              seriesData.map((series) => (
                <Area
                  key={series.name}
                  type="monotone"
                  dataKey={series.name}
                  stackId="1"
                  stroke={series.color}
                  fill={series.color}
                  fillOpacity={0.6}
                />
              ))
            ) : (
              <Area
                type="monotone"
                dataKey="value"
                stroke={primaryColor}
                fill={primaryColor}
                fillOpacity={0.6}
              />
            )}
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip />
            {showLegend && <Legend />}
            {seriesData && seriesData.length > 0 ? (
              seriesData.map((series) => (
                <Bar
                  key={series.name}
                  dataKey={series.name}
                  fill={series.color}
                />
              ))
            ) : (
              <Bar dataKey="value" fill={primaryColor} />
            )}
          </BarChart>
        );
      
      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip />
            {showLegend && <Legend />}
            {seriesData && seriesData.length > 0 ? (
              seriesData.map((series) => (
                <Line
                  key={series.name}
                  type="monotone"
                  dataKey={series.name}
                  stroke={series.color}
                  strokeWidth={2}
                  dot={{ fill: series.color, strokeWidth: 2, r: 4 }}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                stroke={primaryColor}
                strokeWidth={2}
                dot={{ fill: primaryColor, strokeWidth: 2, r: 4 }}
              />
            )}
          </LineChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default TimeSeriesChart;
