
import React from "react";
import { CockpitKPI } from "@/types/cockpit";

interface KPISemiCircleGaugeProps {
  kpi: CockpitKPI;
  currentValue: number;
  targetValue?: number;
  size?: number;
}

const KPISemiCircleGauge: React.FC<KPISemiCircleGaugeProps> = ({ 
  kpi, 
  currentValue,
  targetValue,
  size = 80
}) => {
  console.log('=== KPI GAUGE CALCULATION ===');
  console.log('KPI Name:', kpi.display_name);
  console.log('Current Value:', currentValue);
  console.log('Target Value:', targetValue);
  console.log('Trend Direction:', kpi.trend_direction);
  
  // Calculate achievement percentage based on trend direction
  let achievementPercentage = 0;
  
  if (targetValue && targetValue > 0) {
    if (kpi.trend_direction === 'lower_is_better') {
      // For lower_is_better: achievement = (target / current) * 100
      // When current < target, this gives > 100% (good performance)
      // When current = target, this gives 100%
      // When current > target, this gives < 100% (poor performance)
      if (currentValue > 0) {
        achievementPercentage = (targetValue / currentValue) * 100;
      } else {
        achievementPercentage = 100; // If current is 0, assume perfect for lower_is_better
      }
    } else {
      // For higher_is_better: standard calculation
      // achievement = (current / target) * 100
      achievementPercentage = (currentValue / targetValue) * 100;
    }
  }
  
  console.log('Achievement Percentage:', achievementPercentage);

  // Use achievement percentage for gauge fill (allow over 100%)
  const gaugePercentage = Math.max(0, achievementPercentage);
  
  // Calculate stroke properties for semi-circle gauge
  const radius = (size - 12) / 2;
  const circumference = Math.PI * radius; // Semi-circle circumference
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (Math.min(gaugePercentage, 100) / 100) * circumference;

  // Enhanced color thresholds that work with over 100%
  const getColor = () => {
    if (achievementPercentage >= 100) return '#10b981'; // green-500 - excellent (100%+)
    if (achievementPercentage >= 95) return '#22c55e';  // green-400 - very good (95-99%)
    if (achievementPercentage >= 80) return '#3b82f6';  // blue-500 - good (80-94%)
    if (achievementPercentage >= 60) return '#f59e0b';  // amber-500 - warning (60-79%)
    return '#ef4444'; // red-500 - poor (below 60%)
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 20}>
          {/* Background semi-circle */}
          <path
            d={`M 6 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 6} ${size / 2}`}
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Progress semi-circle */}
          <path
            d={`M 6 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 6} ${size / 2}`}
            stroke={getColor()}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center text - shows achievement percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center" style={{ marginTop: '10px' }}>
            <div className="text-sm font-bold" style={{ color: getColor() }}>
              {achievementPercentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPISemiCircleGauge;
