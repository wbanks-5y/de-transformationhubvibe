
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

// Expanded on-brand color palette with 6 additional colors
const BRAND_COLORS = [
  '#4F46E5', // Primary indigo
  '#3B82F6', // Blue
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#84CC16', // Lime
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#6B7280', // Gray
  '#1F2937', // Dark gray
  '#059669', // Teal
  '#DC2626', // Red-600 (new)
  '#7C3AED', // Violet-600 (new)
  '#0891B2', // Cyan-600 (new)
  '#16A34A', // Green-600 (new)
  '#CA8A04', // Yellow-600 (new)
  '#9333EA', // Purple-600 (new)
];

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
  return (
    <div className="space-y-2">
      {label && <Label className="text-xs">{label}</Label>}
      <div className="grid grid-cols-6 gap-1 p-2 border rounded-md bg-white">
        {BRAND_COLORS.map((color) => (
          <Button
            key={color}
            type="button"
            className="w-6 h-6 p-0 rounded-sm border-2 hover:scale-110 transition-transform"
            style={{ 
              backgroundColor: color,
              borderColor: value === color ? '#1F2937' : 'transparent'
            }}
            onClick={() => onChange(color)}
          >
            {value === color && (
              <Check className="h-3 w-3 text-white drop-shadow-sm" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
