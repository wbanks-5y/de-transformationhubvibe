
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Settings, RotateCcw } from "lucide-react";
import ChartTypeSelector from "./ChartTypeSelector";
import ChartColorControls from "./ChartColorControls";
import ChartSortingSection from "./ChartSortingSection";
import { SortType } from "./ChartSortingControls";

export type ChartType = 'bar' | 'horizontal_bar' | 'pie' | 'doughnut' | 'line';

export interface ChartConfig {
  chartType: ChartType;
  primaryColor: string;
  sortType: SortType;
  sortOrderOverride: boolean;
}

interface ChartConfigurationMenuProps {
  currentConfig: ChartConfig;
  onConfigChange: (config: ChartConfig) => void;
  availableChartTypes?: ChartType[];
  showTimeOptions?: boolean;
  showBusinessOptions?: boolean;
  dataType?: 'aging' | 'priority' | 'date' | 'number' | 'text';
  onResetToDefaults?: () => void;
  className?: string;
}

const ChartConfigurationMenu: React.FC<ChartConfigurationMenuProps> = ({
  currentConfig,
  onConfigChange,
  availableChartTypes = ['bar', 'horizontal_bar', 'pie', 'doughnut', 'line'],
  showTimeOptions = false,
  showBusinessOptions = false,
  dataType,
  onResetToDefaults,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChartTypeChange = (chartType: ChartType) => {
    onConfigChange({
      ...currentConfig,
      chartType
    });
  };

  const handleColorChange = (color: string) => {
    onConfigChange({
      ...currentConfig,
      primaryColor: color
    });
  };

  const handleSortChange = (sortType: SortType) => {
    onConfigChange({
      ...currentConfig,
      sortType,
      sortOrderOverride: sortType !== 'default'
    });
  };

  const showSortingSection = showTimeOptions || showBusinessOptions || dataType === 'date';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-8 w-8 p-0 relative ${className}`}
          title="Chart Configuration"
        >
          <Settings className="h-4 w-4" />
          {/* Visual indicator for customized settings */}
          {currentConfig.sortOrderOverride && (
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-4 bg-white border shadow-lg z-50" 
        align="end"
        side="bottom"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              {dataType === 'number' ? 'Value Display Options' : 'Chart Configuration'}
            </h3>
            {onResetToDefaults && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetToDefaults}
                className="h-6 w-6 p-0"
                title="Reset to defaults"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
          </div>

          <Separator />

          {/* Chart Type Selection */}
          <ChartTypeSelector
            currentChartType={currentConfig.chartType}
            availableChartTypes={availableChartTypes}
            dataType={dataType}
            onChartTypeChange={handleChartTypeChange}
          />

          <Separator />

          {/* Color Customization */}
          <ChartColorControls
            primaryColor={currentConfig.primaryColor}
            onColorChange={handleColorChange}
          />

          {/* Sorting Controls */}
          {showSortingSection && (
            <>
              <Separator />
              <ChartSortingSection
                currentSort={currentConfig.sortType}
                sortOrderOverride={currentConfig.sortOrderOverride}
                showTimeOptions={showTimeOptions}
                showBusinessOptions={showBusinessOptions}
                dataType={dataType}
                onSortChange={handleSortChange}
              />
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChartConfigurationMenu;
