
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CockpitKPI } from "@/types/cockpit";

interface KPIDataTypeFieldsProps {
  formData: Partial<CockpitKPI>;
  onChange: (updates: Partial<CockpitKPI>) => void;
}

const KPIDataTypeFields: React.FC<KPIDataTypeFieldsProps> = ({
  formData,
  onChange
}) => {
  const handleDataTypeChange = (dataType: 'single' | 'time_based') => {
    onChange({ kpi_data_type: dataType });
  };

  return (
    <div className="space-y-6">
      {/* Data Type Selection */}
      <div>
        <Label htmlFor="kpi_data_type">KPI Data Type</Label>
        <Select
          value={formData.kpi_data_type || 'single'}
          onValueChange={handleDataTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single Value</SelectItem>
            <SelectItem value="time_based">Time-based</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-1">
          {formData.kpi_data_type === 'single' 
            ? 'KPI values will be managed as single entries with targets' 
            : 'KPI values will be tracked over time periods with historical data'
          }
        </p>
      </div>

      {/* Information Cards */}
      {formData.kpi_data_type === 'single' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Single Value KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This KPI will store individual values that can be updated manually or through data connections.
              You can set targets and track progress against goals. Values and targets are managed in their respective sections.
            </p>
          </CardContent>
        </Card>
      )}

      {formData.kpi_data_type === 'time_based' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Time-based KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This KPI will track values over time periods, allowing for trend analysis and historical tracking.
              Perfect for tracking monthly, quarterly, or yearly performance metrics.
              Time series data is managed in the Time Series section.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KPIDataTypeFields;
