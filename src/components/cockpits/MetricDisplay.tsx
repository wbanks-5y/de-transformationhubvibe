
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricDisplayProps {
  displayValue: string;
  trendData: {
    percentage: number;
    isPositive: boolean;
  } | null;
  metric?: {
    current_value?: string;
    target_value?: string;
    trend?: 'up' | 'down' | 'neutral';
    additional_data?: {
      dataType?: 'single' | 'multiple';
    };
  };
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ 
  displayValue, 
  trendData, 
  metric 
}) => {
  const isStaticValue = metric?.additional_data?.dataType === 'single';
  
  return (
    <div className="flex items-center justify-between">
      <div className="text-2xl font-bold">
        {displayValue}
      </div>
      
      {/* Show trend for static values or calculated trend for time series */}
      {(trendData || (isStaticValue && metric?.trend)) && (
        <div className={`flex items-center ${
          trendData ? 
            (trendData.isPositive ? 'text-green-600' : 'text-red-600') :
            (metric?.trend === 'up' ? 'text-green-600' : 
             metric?.trend === 'down' ? 'text-red-600' : 'text-gray-600')
        }`}>
          {trendData ? (
            <>
              {trendData.isPositive ? 
                <TrendingUp className="h-4 w-4 mr-1" /> : 
                <TrendingDown className="h-4 w-4 mr-1" />
              }
              <span className="text-sm">{Math.abs(trendData.percentage).toFixed(1)}%</span>
            </>
          ) : metric?.trend && metric.trend !== 'neutral' ? (
            <>
              {metric.trend === 'up' ? 
                <TrendingUp className="h-4 w-4 mr-1" /> : 
                <TrendingDown className="h-4 w-4 mr-1" />
              }
              <span className="text-sm">Trend</span>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MetricDisplay;
