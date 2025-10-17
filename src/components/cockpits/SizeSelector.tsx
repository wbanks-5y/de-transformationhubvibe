
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SizeSelectorProps {
  value: 'small' | 'medium' | 'large' | 'xl';
  onChange: (size: 'small' | 'medium' | 'large' | 'xl') => void;
  label?: string;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ value, onChange, label = "Size" }) => {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="small">Small</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="large">Large</SelectItem>
          <SelectItem value="xl">Extra Large</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SizeSelector;
