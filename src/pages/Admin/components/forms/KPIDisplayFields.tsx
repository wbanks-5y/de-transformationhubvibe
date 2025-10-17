
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import { CockpitKPI } from "@/types/cockpit";
import IconSelector from "../IconSelector";

interface KPIDisplayFieldsProps {
  formData: Partial<CockpitKPI>;
  onChange: (updates: Partial<CockpitKPI>) => void;
}

const KPIDisplayFields: React.FC<KPIDisplayFieldsProps> = ({
  formData,
  onChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="icon">Icon</Label>
          <IconSelector
            selectedIcon={formData.icon || 'DollarSign'}
            onIconSelect={(icon) => onChange({ icon })}
            cockpitName={formData.display_name || ''}
          />
        </div>
        <div>
          <Label htmlFor="sort_order">Sort Order</Label>
          <NumberInput
            id="sort_order"
            value={formData.sort_order || null}
            onChange={(value) => onChange({ sort_order: value })}
            allowDecimals={false}
            min={0}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Weight</Label>
          <NumberInput
            id="weight"
            value={formData.weight || null}
            onChange={(value) => onChange({ weight: value })}
            min={0}
            placeholder="1.0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Weight factor for aggregate calculations. Higher values increase influence.
          </p>
        </div>
        <div>
          <Label>Card Size</Label>
          <Select
            value={formData.size_config || 'medium'}
            onValueChange={(value: 'small' | 'medium' | 'large') => onChange({ size_config: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active !== false}
          onCheckedChange={(checked) => onChange({ is_active: checked })}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>
    </>
  );
};

export default KPIDisplayFields;
