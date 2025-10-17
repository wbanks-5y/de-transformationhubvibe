
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BarChart, PieChart, Gauge, TrendingUp } from "lucide-react";
import { ChartType } from "./ChartConfigurationMenu";

const CHART_TYPE_OPTIONS = [
  { value: 'bar' as ChartType, label: 'Bar Chart', icon: BarChart },
  { value: 'horizontal_bar' as ChartType, label: 'Horizontal Bar', icon: BarChart },
  { value: 'pie' as ChartType, label: 'Gauge', icon: Gauge },
  { value: 'doughnut' as ChartType, label: 'Semi-Gauge', icon: PieChart },
  { value: 'line' as ChartType, label: 'Trend Line', icon: TrendingUp },
];

interface ChartTypeSelectorProps {
  currentChartType: ChartType;
  availableChartTypes: ChartType[];
  dataType?: 'aging' | 'priority' | 'date' | 'number' | 'text';
  onChartTypeChange: (chartType: ChartType) => void;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  currentChartType,
  availableChartTypes,
  dataType,
  onChartTypeChange
}) => {
  const filteredChartTypes = CHART_TYPE_OPTIONS.filter(option => 
    availableChartTypes.includes(option.value)
  );

  // Adjust labels for single value metrics
  const getChartTypeLabel = (option: typeof CHART_TYPE_OPTIONS[0]) => {
    if (dataType === 'number') {
      switch (option.value) {
        case 'pie':
          return 'Gauge';
        case 'doughnut':
          return 'Semi-Gauge';
        case 'line':
          return 'Sparkline';
        case 'bar':
          return 'Progress Bar';
        case 'horizontal_bar':
          return 'H. Progress';
        default:
          return option.label;
      }
    }
    return option.label;
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">
        {dataType === 'number' ? 'Display Style' : 'Chart Type'}
      </Label>
      <div className="grid grid-cols-2 gap-2">
        {filteredChartTypes.map((option) => {
          const Icon = option.icon;
          return (
            <Button
              key={option.value}
              variant={currentChartType === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onChartTypeChange(option.value)}
              className="flex items-center gap-2 h-8 text-xs"
            >
              <Icon className="h-3 w-3" />
              <span className="truncate">{getChartTypeLabel(option)}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ChartTypeSelector;
