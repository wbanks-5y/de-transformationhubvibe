
import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TimeRangeOption {
  value: string;
  label: string;
}

interface NewTimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: TimeRangeOption[];
  className?: string;
}

const NewTimeRangeSelector: React.FC<NewTimeRangeSelectorProps> = ({
  value,
  onChange,
  options,
  className = ""
}) => {
  const selectedOption = options.find(option => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`h-8 px-3 text-sm ${className}`}>
          {selectedOption?.label || 'Select Range'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={value === option.value ? "bg-blue-50 text-blue-700" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NewTimeRangeSelector;
