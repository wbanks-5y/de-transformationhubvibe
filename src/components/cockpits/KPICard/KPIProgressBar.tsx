
import React from "react";
import { Target } from "lucide-react";
import { CockpitKPI } from "@/types/cockpit";

interface KPIProgressBarProps {
  kpi: CockpitKPI;
  currentValue: number;
  targetValue?: number;
}

const KPIProgressBar: React.FC<KPIProgressBarProps> = ({ 
  kpi, 
  currentValue,
  targetValue 
}) => {
  if (!targetValue || targetValue === 0) return null;

  const formatValue = (value: number) => {
    switch (kpi.format_type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  let percentage = (currentValue / targetValue) * 100;
  
  if (kpi.trend_direction === 'lower_is_better') {
    percentage = Math.max(0, 100 - percentage);
  }
  
  percentage = Math.min(100, Math.max(0, percentage));

  const getProgressColor = () => {
    if (percentage >= 100) return '#10b981'; // green-500
    if (percentage >= 80) return '#3b82f6';  // blue-500
    if (percentage >= 60) return '#f59e0b';  // yellow-500
    return '#ef4444'; // red-500
  };

  const radius = 28;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 flex items-center gap-1">
          <Target className="h-3 w-3" />
          Target: {formatValue(targetValue)}
        </span>
        <span className="font-medium bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">
          {percentage.toFixed(0)}%
        </span>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              stroke="#e5e7eb"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <circle
              stroke={getProgressColor()}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold" style={{ color: getProgressColor() }}>
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIProgressBar;
