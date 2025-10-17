
import React from "react";
import { CockpitKPI } from "@/types/cockpit";
import KPITrendIndicator from "./KPITrendIndicator";

interface KPICardFooterProps {
  kpi: CockpitKPI;
  currentValue: number;
  variant?: 'default' | 'compact' | 'detailed';
}

const KPICardFooter: React.FC<KPICardFooterProps> = ({ 
  kpi, 
  currentValue, 
  variant = 'default' 
}) => {
  const showTrend = kpi.kpi_data_type === 'time_based';

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center gap-2">
        <KPITrendIndicator kpi={kpi} currentValue={currentValue} />
        {!showTrend && (
          <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
            {kpi.kpi_data_type === 'time_based' ? 'No trend data' : 'Single value'}
          </div>
        )}
      </div>
      
      {variant === 'detailed' && (
        <div className="text-xs text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 px-2 py-1 rounded-md">
          {kpi.kpi_data_type === 'single' ? 'Single' : 'Time-based'}
          {kpi.weight && kpi.weight !== 1.0 && ` • Weight: ${kpi.weight}`}
        </div>
      )}
    </div>
  );
};

export default KPICardFooter;
