
import React from "react";

interface SingleValueGaugeProps {
  value: number;
  target?: number;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
}

const SingleValueGauge: React.FC<SingleValueGaugeProps> = ({
  value,
  target = 100,
  color = '#3B82F6',
  size = 'medium',
  showLabels = true
}) => {
  const percentage = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  const angle = (percentage / 100) * 180; // Semi-circle gauge
  
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { radius: 40, strokeWidth: 6, fontSize: 'text-sm' };
      case 'medium':
        return { radius: 60, strokeWidth: 8, fontSize: 'text-base' };
      case 'large':
        return { radius: 80, strokeWidth: 10, fontSize: 'text-lg' };
      default:
        return { radius: 60, strokeWidth: 8, fontSize: 'text-base' };
    }
  };

  const { radius, strokeWidth, fontSize } = getSizeConfig();
  const circumference = Math.PI * radius;
  const strokeDasharray = `${(angle / 180) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: radius * 2, height: radius + 20 }}>
        <svg
          width={radius * 2}
          height={radius + 20}
          className="transform -rotate-90"
        >
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${radius} A ${radius - strokeWidth / 2} ${radius - strokeWidth / 2} 0 0 1 ${radius * 2 - strokeWidth / 2} ${radius}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d={`M ${strokeWidth / 2} ${radius} A ${radius - strokeWidth / 2} ${radius - strokeWidth / 2} 0 0 1 ${radius * 2 - strokeWidth / 2} ${radius}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            className="transition-all duration-500"
          />
        </svg>
        {/* Center value */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${fontSize} font-bold`}>
          <span style={{ color }}>{percentage.toFixed(1)}%</span>
          {showLabels && (
            <span className="text-xs text-gray-500 mt-1">
              {value} / {target}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleValueGauge;
