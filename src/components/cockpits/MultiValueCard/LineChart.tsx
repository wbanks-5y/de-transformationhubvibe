
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { ChartDataPoint } from "./utils";

interface LineChartComponentProps {
  data: ChartDataPoint[];
  sizeConfig?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ 
  data, 
  sizeConfig, 
  xAxisLabel, 
  yAxisLabel 
}) => {
  const getFontSize = () => {
    switch (sizeConfig) {
      case 'xl': return 16;
      case 'large': return 14;
      case 'medium': return 12;
      default: return 10;
    }
  };

  const getStrokeWidth = () => {
    switch (sizeConfig) {
      case 'xl': return 4;
      case 'large': return 3;
      case 'medium': return 2;
      default: return 1.5;
    }
  };

  const getDotRadius = () => {
    switch (sizeConfig) {
      case 'xl': return 8;
      case 'large': return 6;
      case 'medium': return 4;
      default: return 3;
    }
  };

  const getDotStrokeWidth = () => {
    switch (sizeConfig) {
      case 'xl': return 4;
      case 'large': return 3;
      default: return 2;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: getFontSize() }}
          tickLine={false}
          axisLine={false}
          label={{ 
            value: xAxisLabel, 
            position: 'insideBottom', 
            offset: -5,
            style: { textAnchor: 'middle', fontSize: 11, fill: '#6b7280' }
          }}
        />
        <YAxis 
          tick={{ fontSize: getFontSize() }}
          tickLine={false}
          axisLine={false}
          label={{ 
            value: yAxisLabel, 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: 11, fill: '#6b7280' }
          }}
        />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={data[0]?.color || '#3B82F6'}
          strokeWidth={getStrokeWidth()}
          dot={{ 
            fill: data[0]?.color || '#3B82F6', 
            strokeWidth: getDotStrokeWidth(), 
            r: getDotRadius()
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
