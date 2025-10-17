
import React from "react";

interface DataPoint {
  value: number;
  timestamp?: string;
}

interface SparklineChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  width?: number;
  showDots?: boolean;
  chartType?: 'line' | 'bar';
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  color = '#3B82F6',
  height = 40,
  width = 120,
  showDots = false,
  chartType = 'line'
}) => {
  if (!data || data.length === 0) {
    return <div style={{ width, height }} className="bg-gray-100 rounded" />;
  }

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((point, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - ((point.value - min) / range) * height
  }));

  if (chartType === 'bar') {
    const barWidth = width / data.length * 0.8;
    const barSpacing = width / data.length * 0.2;

    return (
      <svg width={width} height={height} className="overflow-visible">
        {points.map((point, index) => (
          <rect
            key={index}
            x={point.x - barWidth / 2}
            y={point.y}
            width={barWidth}
            height={height - point.y}
            fill={color}
            opacity={0.8}
          />
        ))}
      </svg>
    );
  }

  // Line chart
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDots && points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={2}
          fill={color}
        />
      ))}
    </svg>
  );
};

export default SparklineChart;
