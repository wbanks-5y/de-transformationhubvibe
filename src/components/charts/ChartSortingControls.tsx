
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpAZ, ArrowDownAZ, ArrowUp01, ArrowDown01, Settings, Clock, TrendingUp } from "lucide-react";

export type SortType = 'default' | 'alphabetical' | 'reverse-alphabetical' | 'value-ascending' | 'value-descending' | 'chronological' | 'reverse-chronological' | 'aging-logical' | 'priority-logical';

interface ChartSortingControlsProps {
  onSortChange: (sortType: SortType) => void;
  currentSort: SortType;
  showTimeOptions?: boolean;
  showBusinessOptions?: boolean;
  dataType?: 'aging' | 'priority' | 'date' | 'number' | 'text';
  className?: string;
}

const ChartSortingControls: React.FC<ChartSortingControlsProps> = ({
  onSortChange,
  currentSort,
  showTimeOptions = false,
  showBusinessOptions = false,
  dataType,
  className = ""
}) => {
  const getSortOptions = () => {
    const baseOptions = [
      { value: 'default' as SortType, label: 'Default Order', icon: Settings },
      { value: 'alphabetical' as SortType, label: 'A → Z', icon: ArrowUpAZ },
      { value: 'reverse-alphabetical' as SortType, label: 'Z → A', icon: ArrowDownAZ },
      { value: 'value-ascending' as SortType, label: 'Value ↑', icon: ArrowUp01 },
      { value: 'value-descending' as SortType, label: 'Value ↓', icon: ArrowDown01 }
    ];

    // Add time options if requested
    if (showTimeOptions) {
      baseOptions.push(
        { value: 'chronological' as SortType, label: 'Oldest First', icon: Clock },
        { value: 'reverse-chronological' as SortType, label: 'Newest First', icon: Clock }
      );
    }

    // Add business-specific options based on data type
    if (showBusinessOptions || dataType) {
      if (dataType === 'aging') {
        baseOptions.splice(1, 0, { 
          value: 'aging-logical' as SortType, 
          label: 'Aging Order', 
          icon: TrendingUp 
        });
      }
      if (dataType === 'priority') {
        baseOptions.splice(1, 0, { 
          value: 'priority-logical' as SortType, 
          label: 'Priority Order', 
          icon: TrendingUp 
        });
      }
    }

    return baseOptions;
  };

  const sortOptions = getSortOptions();
  const currentOption = sortOptions.find(option => option.value === currentSort);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue>
            <div className="flex items-center gap-1">
              {currentOption && <currentOption.icon className="h-3 w-3" />}
              <span className="text-sm">{currentOption?.label}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="h-4 w-4" />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChartSortingControls;
