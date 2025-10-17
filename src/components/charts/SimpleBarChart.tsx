
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from "recharts";
import BaseChart from "./BaseChart";
import { processMultiSeriesData } from "../cockpits/MultiValueCard/chartDataProcessor";

interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  seriesName?: string;
}

interface SimpleBarChartProps {
  data: ChartDataPoint[];
  height?: number;
  showAxis?: boolean;
  color?: string;
  showLegend?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  isMultiSeries: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, isMultiSeries }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-blue-600">
            {isMultiSeries ? entry.name : 'Value'}: {entry.value?.toLocaleString() || 0}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  height = 200, 
  showAxis = true,
  color = "#3B82F6",
  showLegend = true
}) => {
  console.log('SimpleBarChart input data (should be pre-sorted):', data);
  
  // Process the data without additional sorting - data should already be sorted by parent
  const { processedData, seriesConfig, isMultiSeries } = processMultiSeriesData(data);

  console.log('SimpleBarChart processed (order preserved):', { processedData, seriesConfig, isMultiSeries });

  return (
    <BaseChart data={processedData} height={height}>
      <BarChart 
        data={processedData} 
        margin={{ 
          top: 5, 
          right: 30, 
          left: 20, 
          bottom: isMultiSeries && showLegend ? 50 : 5 
        }}
      >
        {showAxis && <XAxis dataKey="name" tick={{ fontSize: 12 }} />}
        {showAxis && <YAxis tick={{ fontSize: 12 }} />}
        <Tooltip content={<CustomTooltip isMultiSeries={isMultiSeries} />} />
        {isMultiSeries && showLegend && (
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="rect"
            wrapperStyle={{ fontSize: 10 }}
          />
        )}
        
        {isMultiSeries ? (
          seriesConfig.map((series) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              name={series.name}
              fill={series.color}
              radius={[4, 4, 0, 0]}
            />
          ))
        ) : (
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || color} />
            ))}
          </Bar>
        )}
      </BarChart>
    </BaseChart>
  );
};

export default SimpleBarChart;
