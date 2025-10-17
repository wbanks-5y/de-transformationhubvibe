
import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { calculateDateRange, formatDateForDisplay, DateRange } from "@/utils/dateFilters";

interface TimeFilterOption {
  id: string;
  label: string;
  description: string;
  period?: string;
  type: 'relative' | 'custom';
}

interface TimeFilterProps {
  cockpitTypeId?: string;
  onFilterChange: (dateRange: DateRange, filter: TimeFilterOption | null) => void;
  className?: string;
}

const TimeFilter: React.FC<TimeFilterProps> = ({
  onFilterChange,
  className = ""
}) => {
  // Predefined time filter options
  const filterOptions: TimeFilterOption[] = [
    {
      id: 'last_7_days',
      label: 'Last 7 Days',
      description: 'Data from the last 7 days',
      period: '7d',
      type: 'relative'
    },
    {
      id: 'last_30_days',
      label: 'Last 30 Days',
      description: 'Data from the last 30 days',
      period: '30d',
      type: 'relative'
    },
    {
      id: 'last_3_months',
      label: 'Last 3 Months',
      description: 'Data from the last 3 months',
      period: '3m',
      type: 'relative'
    },
    {
      id: 'last_6_months',
      label: 'Last 6 Months',
      description: 'Data from the last 6 months',
      period: '6m',
      type: 'relative'
    },
    {
      id: 'last_year',
      label: 'Last Year',
      description: 'Data from the last 12 months',
      period: '1y',
      type: 'relative'
    },
    {
      id: 'custom_range',
      label: 'Custom Range',
      description: 'Select specific date range',
      type: 'custom'
    }
  ];

  const [selectedFilter, setSelectedFilter] = useState<TimeFilterOption>(filterOptions[4]); // Default to Last Year (index 4)
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isCustomPopoverOpen, setIsCustomPopoverOpen] = useState(false);

  // Set default filter on mount
  React.useEffect(() => {
    const defaultFilter = filterOptions[4]; // Last Year
    const dateRange = calculateDateRange(defaultFilter.period!);
    onFilterChange(dateRange, defaultFilter);
  }, [onFilterChange]);

  const handleFilterSelect = (filter: TimeFilterOption) => {
    setSelectedFilter(filter);
    
    if (filter.type === 'relative' && filter.period) {
      const dateRange = calculateDateRange(filter.period);
      onFilterChange(dateRange, filter);
    } else if (filter.type === 'custom') {
      setIsCustomPopoverOpen(true);
    }
  };

  const handleCustomDateApply = () => {
    if (customDateRange.from && customDateRange.to) {
      const dateRange = {
        startDate: customDateRange.from.toISOString(),
        endDate: customDateRange.to.toISOString()
      };
      onFilterChange(dateRange, selectedFilter);
      setIsCustomPopoverOpen(false);
    }
  };

  const getDisplayText = () => {
    if (selectedFilter.type === 'custom' && customDateRange.from && customDateRange.to) {
      return `${formatDateForDisplay(customDateRange.from.toISOString())} - ${formatDateForDisplay(customDateRange.to.toISOString())}`;
    }
    
    return selectedFilter.label;
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Calendar className="h-3 w-3 text-gray-400" />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            {getDisplayText()}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {filterOptions
            .filter(filter => filter.type === 'relative')
            .map((filter) => (
              <DropdownMenuItem
                key={filter.id}
                onClick={() => handleFilterSelect(filter)}
                className={selectedFilter?.id === filter.id ? "bg-blue-50" : ""}
              >
                <div>
                  <div className="font-medium text-sm">{filter.label}</div>
                  <div className="text-xs text-gray-500">{filter.description}</div>
                </div>
              </DropdownMenuItem>
            ))}
          
          <DropdownMenuSeparator />
          
          <Popover open={isCustomPopoverOpen} onOpenChange={setIsCustomPopoverOpen}>
            <PopoverTrigger asChild>
              <DropdownMenuItem
                onClick={() => handleFilterSelect(filterOptions.find(f => f.type === 'custom')!)}
                className={selectedFilter?.type === 'custom' ? "bg-blue-50" : ""}
              >
                <div>
                  <div className="font-medium text-sm">Custom Range</div>
                  <div className="text-xs text-gray-500">Select specific date range</div>
                </div>
              </DropdownMenuItem>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4">
                <h4 className="font-medium mb-3 text-sm">Select Date Range</h4>
                <CalendarComponent
                  mode="range"
                  selected={{
                    from: customDateRange.from,
                    to: customDateRange.to,
                  }}
                  onSelect={(range) => {
                    setCustomDateRange({
                      from: range?.from,
                      to: range?.to,
                    });
                  }}
                  numberOfMonths={2}
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCustomPopoverOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCustomDateApply}
                    disabled={!customDateRange.from || !customDateRange.to}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TimeFilter;
