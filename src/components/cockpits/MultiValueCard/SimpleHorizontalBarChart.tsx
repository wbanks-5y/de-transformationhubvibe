
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface SimpleHorizontalBarChartProps {
  data: DataPoint[];
  fontSize: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-sm flex items-center gap-2">
          <span 
            className="w-3 h-3 rounded"
            style={{ backgroundColor: payload[0].payload.color || '#3B82F6' }}
          />
          <span style={{ color: payload[0].payload.color || '#3B82F6' }}>
            Value: {payload[0].value?.toLocaleString() || 0}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const SimpleHorizontalBarChart: React.FC<SimpleHorizontalBarChartProps> = ({
  data,
  fontSize
}) => {
  console.log('SimpleHorizontalBarChart rendering:', { data, fontSize });

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        layout="horizontal"
        margin={{ 
          top: 20, 
          right: 30, 
          left: 80, 
          bottom: 20 
        }}
      >
        <XAxis 
          type="number" 
          tick={{ fontSize: fontSize - 1, fill: '#666' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
          tickFormatter={(value) => value?.toLocaleString() || '0'}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fontSize: fontSize - 1, fill: '#666' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
          width={75}
        />
        <Tooltip 
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
        />
        
        <Bar 
          dataKey="value"
          radius={[0, 4, 4, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleHorizontalBarChart;
