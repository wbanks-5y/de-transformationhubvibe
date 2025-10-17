
import React from "react";
import { ResponsiveContainer } from "recharts";

interface BaseChartProps {
  data: any[];
  height?: number;
  children: React.ReactElement;
  className?: string;
}

const BaseChart: React.FC<BaseChartProps> = ({ 
  data, 
  height = 200, 
  children, 
  className = "" 
}) => {
  if (!data || data.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center text-gray-500 ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-sm">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export default BaseChart;
