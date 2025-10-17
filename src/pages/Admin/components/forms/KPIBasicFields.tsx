
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import { CockpitKPI } from "@/types/cockpit";

interface KPIBasicFieldsProps {
  formData: Partial<CockpitKPI>;
  onChange: (updates: Partial<CockpitKPI>) => void;
}

const KPIBasicFields: React.FC<KPIBasicFieldsProps> = ({
  formData,
  onChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="revenue_kpi"
            required
          />
        </div>
        <div>
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            value={formData.display_name || ''}
            onChange={(e) => onChange({ display_name: e.target.value })}
            placeholder="Monthly Revenue"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describes the KPI purpose"
        />
      </div>
    </>
  );
};

export default KPIBasicFields;
