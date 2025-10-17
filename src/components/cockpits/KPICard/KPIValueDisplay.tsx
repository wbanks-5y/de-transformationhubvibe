
import React from "react";
import { CockpitKPI } from "@/types/cockpit";

interface KPIValueDisplayProps {
  value: number;
  kpi: CockpitKPI;
  targetValue?: number;
  variant?: 'default' | 'compact' | 'detailed';
}

const KPIValueDisplay: React.FC<KPIValueDisplayProps> = ({ 
  value, 
  kpi, 
  targetValue,
  variant = 'default' 
}) => {
  const formatValue = (val: number) => {
    switch (kpi.format_type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(Math.round(val));
      case 'percentage':
        return `${Math.round(val)}%`;
      default:
        return Math.round(val).toLocaleString();
    }
  };

  const getValueColor = () => {
    if (targetValue) {
      const progress = (value / targetValue) * 100;
      if (progress >= 100) return 'text-green-700';
      if (progress >= 80) return 'text-blue-700';
      if (progress >= 60) return 'text-yellow-700';
      return 'text-red-700';
    }
    return 'text-gray-900';
  };

  const textSize = variant === 'compact' ? 'text-xl' : 'text-2xl';

  return (
    <div className={`${textSize} font-bold ${getValueColor()} transition-colors duration-200`}>
      {formatValue(value)}
    </div>
  );
};

export default KPIValueDisplay;
