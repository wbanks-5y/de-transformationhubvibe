
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CockpitKPI } from "@/types/cockpit";
import { useKPIValue, useKPILatestTimeBased, useKPITargets } from "@/hooks/use-kpi-data";
import { getIconByName } from "@/utils/iconUtils";
import KPITrendIndicator from "./KPITrendIndicator";
import KPISemiCircleGauge from "./KPISemiCircleGauge";
import KPIDrillDownModal from "./KPIDrillDownModal";

interface KPICardProps {
  kpi: CockpitKPI;
  timeRange?: string;
  startDate?: string;
  endDate?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

const KPICard: React.FC<KPICardProps> = ({ 
  kpi, 
  timeRange = "30d",
  startDate,
  endDate,
  variant = 'default'
}) => {
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  
  // Fetch data based on KPI type
  const { data: singleValue } = useKPIValue(kpi.kpi_data_type === 'single' ? kpi.id : '');
  const { data: latestTimeBased } = useKPILatestTimeBased(kpi.kpi_data_type === 'time_based' ? kpi.id : '');
  const { data: targets } = useKPITargets(kpi.id);
  
  const getCurrentValue = () => {
    if (kpi.kpi_data_type === 'time_based' && latestTimeBased) {
      return latestTimeBased.actual_value;
    }
    
    if (kpi.kpi_data_type === 'single' && singleValue) {
      return singleValue.current_value;
    }
    
    return 0;
  };

  const getTargetValue = () => {
    if (!targets || targets.length === 0) return 0;
    
    // For time-based KPIs, try to find a matching time-based target
    if (kpi.kpi_data_type === 'time_based' && latestTimeBased) {
      const timeBasedTarget = targets.find(t => 
        t.target_type === 'time_based' &&
        t.period_start && t.period_end &&
        latestTimeBased.period_start >= t.period_start &&
        latestTimeBased.period_end <= t.period_end
      );
      if (timeBasedTarget) return timeBasedTarget.target_value;
    }
    
    // Fall back to single target
    const singleTarget = targets.find(t => t.target_type === 'single');
    return singleTarget?.target_value || 0;
  };

  const currentValue = getCurrentValue();
  const targetValue = getTargetValue();
  const IconComponent = getIconByName(kpi.icon);

  const formatValue = (value: number) => {
    switch (kpi.format_type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          notation: 'compact'
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  const handleCardClick = () => {
    if (kpi.kpi_data_type === 'time_based') {
      setIsDrillDownOpen(true);
    }
  };

  if (variant === 'compact') {
    return (
      <>
        <Card 
          className={`hover:shadow-md transition-all duration-300 border border-gray-200 bg-white ${
            kpi.kpi_data_type === 'time_based' ? 'cursor-pointer hover:border-blue-300' : ''
          }`}
          onClick={handleCardClick}
        >
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 flex-1">
                {kpi.icon && (
                  <div className="p-1 rounded bg-gray-100 border border-gray-200">
                    <IconComponent className="h-3 w-3 text-gray-700" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-900 mb-0.5">
                    {kpi.display_name}
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {formatValue(currentValue)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <KPITrendIndicator kpi={kpi} currentValue={currentValue} />
                {targetValue > 0 && (
                  <div className="text-xs text-gray-600">
                    Target: {formatValue(targetValue)}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <KPIDrillDownModal
          kpi={kpi}
          isOpen={isDrillDownOpen}
          onClose={() => setIsDrillDownOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <Card 
        className={`hover:shadow-md transition-all duration-300 border border-gray-200 bg-white ${
          kpi.kpi_data_type === 'time_based' ? 'cursor-pointer hover:border-blue-300' : ''
        }`}
        onClick={handleCardClick}
      >
        <CardContent className="p-2">
          <div className="space-y-1">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {kpi.icon && (
                  <div className="p-1 rounded bg-gray-100 border border-gray-200">
                    <IconComponent className="h-3 w-3 text-gray-700" />
                  </div>
                )}
                <h3 className="text-xs font-semibold text-gray-900 truncate">
                  {kpi.display_name}
                </h3>
              </div>
              {kpi.kpi_data_type === 'time_based' && (
                <div className="text-xs text-blue-600 font-medium">
                  View Details →
                </div>
              )}
            </div>
            
            {/* Gauge */}
            <div className="flex justify-center">
              <KPISemiCircleGauge 
                kpi={kpi} 
                currentValue={currentValue} 
                targetValue={targetValue}
                size={80} 
              />
            </div>

            {/* Values */}
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Actual:</span>
                <span className="font-semibold text-gray-900">{formatValue(currentValue)}</span>
              </div>
              {targetValue > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Target:</span>
                  <span className="font-semibold text-gray-900">{formatValue(targetValue)}</span>
                </div>
              )}
            </div>

            {/* Trend */}
            <div className="flex justify-center">
              <KPITrendIndicator kpi={kpi} currentValue={currentValue} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <KPIDrillDownModal
        kpi={kpi}
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
      />
    </>
  );
};

export default KPICard;
