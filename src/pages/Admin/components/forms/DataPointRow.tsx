
import React from "react";
import { NumberInput } from "@/components/ui/number-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AndroidSelect } from "@/components/ui/android-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { isAndroidWebView } from "@/utils/androidWebViewDetection";

interface DataPointRowProps {
  point: any;
  renderTimeField: (point: any) => React.ReactNode;
  updateDataPoint: (index: number, field: string, value: any) => void;
  removeDataPoint: (index: number) => void;
  validationError: string;
  availableYears?: { value: number; label: string; disabled: boolean }[];
}

const DataPointRow: React.FC<DataPointRowProps> = ({
  point,
  renderTimeField,
  updateDataPoint,
  removeDataPoint,
  validationError,
  availableYears = [],
}) => {
  const useAndroidSelect = isAndroidWebView();

  const yearOptions = availableYears.map(year => ({
    value: year.value.toString(),
    label: year.label,
    disabled: year.disabled
  }));

  return (
    <div
      key={point.originalIndex}
      className={`flex items-center gap-2 p-2 bg-gray-50 rounded ${
        validationError ? "border border-red-500" : ""
      }`}
      aria-invalid={!!validationError}
    >
      <div className="flex-shrink-0 w-20">
        <Label className="text-xs">Year</Label>
        {useAndroidSelect ? (
          <AndroidSelect
            value={point.year?.toString() || ""}
            onValueChange={(value) => updateDataPoint(point.originalIndex, "year", parseInt(value, 10))}
            placeholder="Year"
            options={yearOptions}
            className="h-8"
          />
        ) : (
          <Select
            value={point.year?.toString() || ""}
            onValueChange={(value) => updateDataPoint(point.originalIndex, "year", parseInt(value, 10))}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50 max-h-60">
              {availableYears.map((year) => (
                <SelectItem 
                  key={year.value} 
                  value={year.value.toString()}
                  disabled={year.disabled}
                  className={year.disabled ? "opacity-50" : ""}
                >
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {renderTimeField(point)}

      <div className="flex-shrink-0 w-24">
        <Label className="text-xs">Value</Label>
        <NumberInput
          value={point.value || null}
          onChange={(value) => updateDataPoint(point.originalIndex, "value", value || 0)}
          className="h-8"
          aria-label="Point value"
        />
      </div>

      <Button
        type="button"
        onClick={() => removeDataPoint(point.originalIndex)}
        variant="outline"
        size="sm"
        className="flex-shrink-0"
        aria-label="Remove data point"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {!!validationError && (
        <span className="ml-2 text-xs text-red-500 block">{validationError}</span>
      )}
    </div>
  );
};

export default DataPointRow;
