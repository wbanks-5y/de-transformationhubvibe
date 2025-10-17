
import React from "react";
import { Label } from "@/components/ui/label";
import { SortAsc } from "lucide-react";
import ChartSortingControls, { SortType } from "./ChartSortingControls";

interface ChartSortingSectionProps {
  currentSort: SortType;
  sortOrderOverride: boolean;
  showTimeOptions: boolean;
  showBusinessOptions: boolean;
  dataType?: 'aging' | 'priority' | 'date' | 'number' | 'text';
  onSortChange: (sortType: SortType) => void;
}

const ChartSortingSection: React.FC<ChartSortingSectionProps> = ({
  currentSort,
  sortOrderOverride,
  showTimeOptions,
  showBusinessOptions,
  dataType,
  onSortChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <SortAsc className="h-4 w-4" />
        <Label className="text-xs font-medium">Sort Order</Label>
        {sortOrderOverride && (
          <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
            Override
          </span>
        )}
      </div>
      <ChartSortingControls
        currentSort={currentSort}
        onSortChange={onSortChange}
        showTimeOptions={showTimeOptions}
        showBusinessOptions={showBusinessOptions}
        dataType={dataType}
        className="w-full"
      />
    </div>
  );
};

export default ChartSortingSection;
