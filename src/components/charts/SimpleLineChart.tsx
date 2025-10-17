
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import BaseChart from "./BaseChart";

interface ChartDataPoint {
  name: string;
  value: number;
}

interface SimpleLineChartProps {
  data: ChartDataPoint[];
  height?: number;
  showAxis?: boolean;
  color?: string;
  strokeWidth?: number;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ 
  data, 
  height = 200, 
  showAxis = true,
  color = "#3B82F6",
  strokeWidth = 2
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <BaseChart data={data} height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showAxis && <XAxis dataKey="name" tick={{ fontSize: 12 }} />}
        {showAxis && <YAxis tick={{ fontSize: 12 }} />}
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={strokeWidth}
          dot={{ fill: color, strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </BaseChart>
  );
};

export default SimpleLineChart;
