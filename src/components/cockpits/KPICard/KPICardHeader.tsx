
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { CockpitKPI } from "@/types/cockpit";
import { getIconByName } from "@/utils/iconUtils";

interface KPICardHeaderProps {
  kpi: CockpitKPI;
  hasTimeSeriesData: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const KPICardHeader: React.FC<KPICardHeaderProps> = ({ 
  kpi, 
  hasTimeSeriesData, 
  variant = 'default' 
}) => {
  const IconComponent = getIconByName(kpi.icon);

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3 flex-1">
        {kpi.icon && (
          <div className={`p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 ${kpi.color_class || 'text-blue-600'} shadow-sm`}>
            <IconComponent className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 leading-tight mb-1">
            {kpi.display_name}
          </h3>
          {variant === 'detailed' && kpi.description && (
            <p className="text-xs text-gray-500 line-clamp-2">
              {kpi.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {kpi.kpi_data_type === 'single' && (
          <Badge variant="outline" className="text-xs bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            Single
          </Badge>
        )}
        {kpi.kpi_data_type === 'time_based' && !hasTimeSeriesData && (
          <Badge variant="outline" className="text-xs bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 text-orange-700">
            No Data
          </Badge>
        )}
        {kpi.kpi_data_type === 'time_based' && hasTimeSeriesData && (
          <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700">
            <Activity className="h-3 w-3 mr-1" />
            Time Series
          </Badge>
        )}
      </div>
    </div>
  );
};

export default KPICardHeader;
