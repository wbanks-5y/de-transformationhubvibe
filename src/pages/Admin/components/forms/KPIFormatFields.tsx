
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CockpitKPI } from "@/types/cockpit";

interface KPIFormatFieldsProps {
  formData: Partial<CockpitKPI>;
  onChange: (updates: Partial<CockpitKPI>) => void;
}

const KPIFormatFields: React.FC<KPIFormatFieldsProps> = ({
  formData,
  onChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="trend_direction">Trend Direction</Label>
        <Select
          value={formData.trend_direction || 'higher_is_better'}
          onValueChange={(value: any) => onChange({ trend_direction: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="higher_is_better">Higher is Better</SelectItem>
            <SelectItem value="lower_is_better">Lower is Better</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="format_type">Format Type</Label>
        <Select
          value={formData.format_type || 'number'}
          onValueChange={(value: any) => onChange({ format_type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="currency">Currency</SelectItem>
            <SelectItem value="percentage">Percentage</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default KPIFormatFields;
