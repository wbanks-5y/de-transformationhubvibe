
import React from "react";
import ColorPicker from "@/components/ui/color-picker";

interface ChartColorControlsProps {
  primaryColor: string;
  onColorChange: (color: string) => void;
}

const ChartColorControls: React.FC<ChartColorControlsProps> = ({
  primaryColor,
  onColorChange
}) => {
  return (
    <div className="space-y-2">
      <ColorPicker
        label="Primary Color"
        value={primaryColor}
        onChange={onColorChange}
      />
    </div>
  );
};

export default ChartColorControls;
