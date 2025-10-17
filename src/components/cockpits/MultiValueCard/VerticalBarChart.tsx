
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from "recharts";
import { processMultiSeriesData } from "./chartDataProcessor";
import { ChartDataPoint } from "./utils";

interface VerticalBarChartProps {
  data: ChartDataPoint[];
  fontSize: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  isMultiSeries: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, isMultiSeries }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span style={{ color: entry.color }}>
              {isMultiSeries ? entry.name : 'Value'}: {entry.value?.toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const VerticalBarChart: React.FC<VerticalBarChartProps> = ({
  data,
  fontSize
}) => {
  console.log('VerticalBarChart rendering:', { data, fontSize });

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  // Process the data to determine if it's multi-series and get proper configuration
  const { processedData, seriesConfig, isMultiSeries } = processMultiSeriesData(data);

  console.log('VerticalBarChart processed:', { processedData, seriesConfig, isMultiSeries });

  // Calculate max value for domain
  const maxValue = isMultiSeries 
    ? Math.max(...processedData.flatMap(item => 
        seriesConfig.map(series => Number(item[series.key]) || 0)
      ))
    : Math.max(...processedData.map(item => Number(item.value) || 0));

  const domain = maxValue > 0 ? [0, Math.ceil(maxValue * 1.1)] : [0, 100];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={processedData}
        margin={{ top: 20, right: 30, left: 20, bottom: isMultiSeries ? 60 : 40 }}
      >
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: fontSize - 1, fill: '#666' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
          angle={-45}
          textAnchor="end"
          height={isMultiSeries ? 80 : 60}
        />
        <YAxis 
          domain={domain}
          tick={{ fontSize: fontSize - 1, fill: '#666' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip 
          content={<CustomTooltip isMultiSeries={isMultiSeries} />}
          cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
        />
        {isMultiSeries && (
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="rect"
            wrapperStyle={{ fontSize: fontSize - 2 }}
          />
        )}
        
        {isMultiSeries ? (
          seriesConfig.map((series) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              name={series.name}
              fill={series.color}
              radius={[2, 2, 0, 0]}
            />
          ))
        ) : (
          <Bar 
            dataKey="value"
            radius={[2, 2, 0, 0]}
          >
            {processedData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
            ))}
          </Bar>
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VerticalBarChart;
