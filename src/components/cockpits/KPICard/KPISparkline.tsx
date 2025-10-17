
import React from "react";
import { useKPITimeSeriesData } from "@/hooks/use-kpi-time-series-data";

interface KPISparklineProps {
  kpiId: string;
  width?: number;
  height?: number;
  color?: string;
}

const KPISparkline: React.FC<KPISparklineProps> = ({ 
  kpiId, 
  width = 60, 
  height = 20, 
  color = "#3B82F6" 
}) => {
  const { data: timeSeriesData } = useKPITimeSeriesData(kpiId, undefined, undefined, 12);

  if (!timeSeriesData || timeSeriesData.length < 2) {
    return null;
  }

  const values = timeSeriesData.map(d => d.actual_value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  if (range === 0) {
    // All values are the same, show a flat line
    return (
      <svg width={width} height={height} className="overflow-visible">
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={color}
          strokeWidth={1.5}
          fill="none"
        />
      </svg>
    );
  }

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      {/* Show trend with a subtle gradient */}
      <defs>
        <linearGradient id={`gradient-${kpiId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={0.1} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#gradient-${kpiId})`}
      />
    </svg>
  );
};

export default KPISparkline;
