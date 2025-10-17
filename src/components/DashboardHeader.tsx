import React, { useState } from "react";
import { BarChart3, Download } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export type TimePeriod = "30days" | "quarter" | "ytd" | "12months";

export interface DashboardHeaderProps {
  title: string;
  onPeriodChange?: (period: TimePeriod) => void;
  onExport?: () => void;
  customIcon?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  onPeriodChange,
  onExport,
  customIcon
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("30days");

  const handlePeriodChange = (value: TimePeriod) => {
    setSelectedPeriod(value);
    
    // Show toast notification for period change
    toast.success(`Time period updated: ${getPeriodLabel(value)}`);
    
    // Call the callback if provided
    if (onPeriodChange) {
      onPeriodChange(value);
    }
    
    console.log(`Time period changed to: ${value}`);
  };

  const handleExport = () => {
    // Call the callback if provided
    if (onExport) {
      onExport();
    } else {
      // Default export behavior
      toast.success(`Exporting ${title} data for ${getPeriodLabel(selectedPeriod)}`);
      console.log(`Exporting data for: ${title}, period: ${selectedPeriod}`);
    }
  };

  const getPeriodLabel = (period: TimePeriod): string => {
    const labels = {
      "30days": "Last 30 Days",
      "quarter": "Last Quarter",
      "ytd": "Year to Date",
      "12months": "Last 12 Months"
    };
    return labels[period];
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center mb-4 md:mb-0">
        {customIcon || <BarChart3 className="h-8 w-8 mr-2 text-sky-500" />}
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      <div className="flex space-x-2">
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="12months">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          variant="default" 
          className="bg-sky-500 hover:bg-sky-600 text-white"
          onClick={handleExport}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
