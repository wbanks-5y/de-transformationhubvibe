
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LabelList } from "recharts";
import { ChartDataPoint } from "./utils";

interface PieChartComponentProps {
  data: ChartDataPoint[];
  chartType: 'pie' | 'doughnut';
  sizeConfig?: string;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, chartType, sizeConfig }) => {
  // Use percentage-based sizing instead of fixed pixels
  const getOuterRadius = () => {
    switch (sizeConfig) {
      case 'small': return "60%";
      case 'medium': return "70%"; 
      case 'large': return "75%";
      case 'xl': return "80%";
      default: return "65%";
    }
  };

  const getInnerRadius = () => {
    if (chartType !== 'doughnut') return 0;
    
    switch (sizeConfig) {
      case 'small': return "30%";
      case 'medium': return "35%";
      case 'large': return "40%";
      case 'xl': return "45%";
      default: return "35%";
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-blue-600">
            {`Value: ${data.value?.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label renderer for pie chart segments
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if percentage is significant enough (>5%)
    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom label for outside positioning with lines
  const renderOutsideLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if percentage is significant enough (>3%)
    if (percent < 0.03) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="#374151" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={11}
        fontWeight="medium"
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderOutsideLabel}
          innerRadius={getInnerRadius()}
          outerRadius={getOuterRadius()}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
          ))}
          <LabelList 
            dataKey="value" 
            content={renderCustomLabel}
          />
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
