
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Trash2, AlertTriangle, Info, CalendarIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NumberInput } from "@/components/ui/number-input";
import ColorPicker from "@/components/ui/color-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  validateTimeBasedDataPoint, 
  getNextDefaultTimePeriod, 
  getExistingTimePeriods, 
  hasValidationErrors, 
  TimeBasedDataPoint, 
  TimeGranularity,
  getAvailableYears,
  getAvailableMonths,
  getAvailableQuarters,
  getAvailableWeeks
} from "@/utils/timeBasedMetricUtils";
import SeriesManager from "./SeriesManager";
import DataPointRow from "./DataPointRow";

interface TimeBasedConfig {
  chart_type: string;
  y_axis_label: string;
  time_granularity?: string;
  allow_multiple_series?: boolean;
}

interface SeriesConfig {
  id: string;
  name: string;
  color: string;
}

interface TimeBasedFormProps {
  initialChartType: string;
  initialYAxisLabel: string;
  initialDataPoints: any[];
  timeBasedConfig?: TimeBasedConfig;
  onChange: (chartType: string, yAxisLabel: string, dataPoints: TimeBasedDataPoint[], hasErrors?: boolean) => void;
}

const TimeBasedForm: React.FC<TimeBasedFormProps> = ({ 
  initialChartType, 
  initialYAxisLabel, 
  initialDataPoints, 
  timeBasedConfig,
  onChange 
}) => {
  console.log('TimeBasedForm: Props received:', { 
    initialChartType, 
    initialYAxisLabel, 
    initialDataPointsLength: initialDataPoints.length,
    timeBasedConfig
  });

  const [chartType, setChartType] = useState(initialChartType);
  const [yAxisLabel, setYAxisLabel] = useState(initialYAxisLabel);
  const [series, setSeries] = useState<SeriesConfig[]>([{
    id: 'series-1',
    name: 'Series 1',
    color: '#4F46E5'
  }]);
  const [points, setPoints] = useState<TimeBasedDataPoint[]>([]);
  const [validationError, setValidationError] = useState<string>('');
  const [pendingPoint, setPendingPoint] = useState<{seriesName: string, seriesColor: string} | null>(null);
  const [pointValidationErrors, setPointValidationErrors] = useState<{ [k: number]: string }>({});

  // Initialize data when props change
  useEffect(() => {
    console.log('TimeBasedForm: Initializing with data points:', initialDataPoints);
    
    if (initialDataPoints && initialDataPoints.length > 0) {
      // Extract unique series from data points
      const uniqueSeries = new Map<string, SeriesConfig>();
      
      initialDataPoints.forEach((point: any) => {
        const seriesName = point.series_name || 'Series 1';
        const seriesColor = point.series_color || '#4F46E5';
        const seriesId = `series-${seriesName.toLowerCase().replace(/\s+/g, '-')}`;
        
        if (!uniqueSeries.has(seriesId)) {
          uniqueSeries.set(seriesId, {
            id: seriesId,
            name: seriesName,
            color: seriesColor
          });
        }
      });

      if (uniqueSeries.size > 0) {
        const seriesArray = Array.from(uniqueSeries.values());
        console.log('TimeBasedForm: Setting series from data:', seriesArray);
        setSeries(seriesArray);
      }

      // Transform data points to internal format
      const transformedPoints: TimeBasedDataPoint[] = initialDataPoints.map((point: any) => ({
        year: point.year,
        month: point.month,
        quarter: point.quarter,
        week: point.week,
        day: point.day,
        date_value: point.date_value,
        value: Number(point.value),
        series_name: point.series_name || 'Series 1',
        series_color: point.series_color || '#4F46E5'
      }));

      console.log('TimeBasedForm: Setting transformed points:', transformedPoints);
      setPoints(transformedPoints);
    }
  }, [initialDataPoints]);

  // Check for validation errors whenever points or series change
  useEffect(() => {
    const hasErrors = hasValidationErrors(points, (timeBasedConfig?.time_granularity || 'month') as TimeGranularity, series);
    notifyChanges(chartType, yAxisLabel, points, hasErrors);
  }, [points, series]);

  // Notify parent of changes
  const notifyChanges = (newChartType: string, newYAxisLabel: string, newPoints: TimeBasedDataPoint[], hasErrors: boolean = false) => {
    console.log('TimeBasedForm: Notifying parent of changes:', {
      chartType: newChartType,
      yAxisLabel: newYAxisLabel,
      pointsCount: newPoints.length,
      hasErrors
    });
    onChange(newChartType, newYAxisLabel, newPoints, hasErrors);
  };

  const updateChartType = (value: string) => {
    setChartType(value);
    const hasErrors = hasValidationErrors(points, (timeBasedConfig?.time_granularity || 'month') as TimeGranularity, series);
    notifyChanges(value, yAxisLabel, points, hasErrors);
  };

  const updateYAxisLabel = (value: string) => {
    setYAxisLabel(value);
    const hasErrors = hasValidationErrors(points, (timeBasedConfig?.time_granularity || 'month') as TimeGranularity, series);
    notifyChanges(chartType, value, points, hasErrors);
  };

  const addSeries = () => {
    const newSeries: SeriesConfig = {
      id: `series-${series.length + 1}`,
      name: `Series ${series.length + 1}`,
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    };
    setSeries([...series, newSeries]);
  };

  const removeSeries = (seriesId: string) => {
    if (series.length <= 1) return;
    
    const newSeries = series.filter(s => s.id !== seriesId);
    setSeries(newSeries);
    
    // Remove data points for this series
    const seriesInfo = series.find(s => s.id === seriesId);
    const newPoints = points.filter(point => point.series_name !== seriesInfo?.name);
    setPoints(newPoints);
    notifyChanges(chartType, yAxisLabel, newPoints);
  };

  const updateSeries = (seriesId: string, field: keyof SeriesConfig, value: string) => {
    const oldSeries = series.find(s => s.id === seriesId);
    const newSeries = series.map(s => 
      s.id === seriesId ? { ...s, [field]: value } : s
    );
    setSeries(newSeries);
    
    // Update data points that belong to this series
    if (field === 'name' || field === 'color') {
      const newPoints = points.map(point => {
        if (point.series_name === oldSeries?.name) {
          return {
            ...point,
            series_name: field === 'name' ? value : point.series_name,
            series_color: field === 'color' ? value : point.series_color
          };
        }
        return point;
      });
      setPoints(newPoints);
      notifyChanges(chartType, yAxisLabel, newPoints);
    }
  };

  const addDataPoint = (seriesName: string, seriesColor: string) => {
    const granularity = (timeBasedConfig?.time_granularity || 'month') as TimeGranularity;
    const defaultPoint = getNextDefaultTimePeriod(points, granularity, seriesName);
    
    const newPoint: TimeBasedDataPoint = {
      year: defaultPoint.year || new Date().getFullYear(),
      month: defaultPoint.month,
      quarter: defaultPoint.quarter,
      week: defaultPoint.week,
      day: defaultPoint.day,
      date_value: defaultPoint.date_value,
      value: 0,
      series_name: seriesName,
      series_color: seriesColor
    };

    const validation = validateTimeBasedDataPoint(newPoint, points, granularity, seriesName);
    if (!validation.isValid) {
      setValidationError(validation.message || 'Invalid data point');
      setPendingPoint({ seriesName, seriesColor });
      return;
    }

    setValidationError('');
    setPendingPoint(null);
    const newPoints = [...points, newPoint];
    setPoints(newPoints);
  };

  const removeDataPoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
    setValidationError(''); // Clear validation error when removing points
  };

  const updateDataPoint = (index: number, field: keyof TimeBasedDataPoint, value: any) => {
    const newPoints = points.map((point, i) => {
      if (i === index) {
        const updatedPoint = { ...point, [field]: value };
        
        // Handle date field for daily granularity
        if (field === 'date_value' && timeBasedConfig?.time_granularity === 'day' && value) {
          const selectedDate = new Date(value);
          updatedPoint.year = selectedDate.getFullYear();
          updatedPoint.month = selectedDate.getMonth() + 1;
          updatedPoint.day = selectedDate.getDate();
        }

        // Validate the updated point for duplicates
        const granularity = (timeBasedConfig?.time_granularity || 'month') as TimeGranularity;
        const otherPoints = points.filter((_, idx) => idx !== i);
        const validation = validateTimeBasedDataPoint(updatedPoint, otherPoints, granularity, updatedPoint.series_name);
        
        const errors = { ...pointValidationErrors };
        if (!validation.isValid) {
          errors[index] = validation.message || "Invalid data point";
          setValidationError(validation.message || "Invalid data point");
        } else {
          delete errors[index];
          setValidationError(""); // clear global error
        }
        setPointValidationErrors(errors);

        return validation.isValid ? updatedPoint : point; // Only update if valid
      }
      return point;
    });
    setPoints(newPoints);
  };

  const getPointsForSeries = (seriesName: string) => {
    return points
      .map((point, index) => ({ ...point, originalIndex: index }))
      .filter(point => point.series_name === seriesName);
  };

  const canAddDataPoint = (seriesName: string) => {
    const granularity = (timeBasedConfig?.time_granularity || 'month') as TimeGranularity;
    const defaultPoint = getNextDefaultTimePeriod(points, granularity, seriesName);
    
    const testPoint: TimeBasedDataPoint = {
      year: defaultPoint.year || new Date().getFullYear(),
      month: defaultPoint.month,
      quarter: defaultPoint.quarter,
      week: defaultPoint.week,
      day: defaultPoint.day,
      date_value: defaultPoint.date_value,
      value: 0,
      series_name: seriesName,
      series_color: '#000000'
    };

    const validation = validateTimeBasedDataPoint(testPoint, points, granularity, seriesName);
    return validation.isValid;
  };

  const renderTimeField = (point: any) => {
    const granularity = timeBasedConfig?.time_granularity || 'month';
    const seriesName = points.find((_, i) => i === point.originalIndex)?.series_name || '';

    switch (granularity) {
      case 'month':
        const availableMonths = getAvailableMonths(points, seriesName, point.year);
        return (
          <div className="flex-shrink-0 w-28">
            <Label className="text-xs">Month</Label>
            <Select
              value={point.month?.toString() || ""}
              onValueChange={(value) => updateDataPoint(point.originalIndex, "month", parseInt(value, 10))}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Pick..." />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {availableMonths.map((month) => (
                  <SelectItem 
                    key={month.value} 
                    value={month.value.toString()}
                    disabled={month.disabled}
                    className={month.disabled ? "opacity-50" : ""}
                  >
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'quarter':
        const availableQuarters = getAvailableQuarters(points, seriesName, point.year);
        return (
          <div className="flex-shrink-0 w-24">
            <Label className="text-xs">Quarter</Label>
            <Select
              value={point.quarter?.toString() || ""}
              onValueChange={(value) => updateDataPoint(point.originalIndex, "quarter", parseInt(value, 10))}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Pick..." />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {availableQuarters.map((quarter) => (
                  <SelectItem 
                    key={quarter.value} 
                    value={quarter.value.toString()}
                    disabled={quarter.disabled}
                    className={quarter.disabled ? "opacity-50" : ""}
                  >
                    {quarter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'week':
        const availableWeeks = getAvailableWeeks(points, seriesName, point.year);
        return (
          <div className="flex-shrink-0 w-24">
            <Label className="text-xs">Week</Label>
            <Select
              value={point.week?.toString() || ""}
              onValueChange={(value) => updateDataPoint(point.originalIndex, "week", parseInt(value, 10))}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Pick..." />
              </SelectTrigger>
              <SelectContent className="bg-white z-50 max-h-60">
                {availableWeeks.map((week) => (
                  <SelectItem 
                    key={week.value} 
                    value={week.value.toString()}
                    disabled={week.disabled}
                    className={week.disabled ? "opacity-50" : ""}
                  >
                    {week.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'day':
        return (
          <div className="flex-shrink-0 w-36">
            <Label className="text-xs">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-8 justify-start text-left font-normal",
                    !point.date_value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {point.date_value ? format(new Date(point.date_value), "PPP") : <span>Pick date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
                <Calendar
                  mode="single"
                  selected={point.date_value ? new Date(point.date_value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const dateStr = date.toISOString().split('T')[0];
                      updateDataPoint(point.originalIndex, 'date_value', dateStr);
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Validation Error */}
      {validationError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Validation Error:</strong> {validationError}
          </AlertDescription>
        </Alert>
      )}

      {/* Configuration Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Editing Configuration:</strong> You can edit chart type, y-axis label, and data points. 
          Time granularity and other settings are read-only.
        </AlertDescription>
      </Alert>

      {/* Read-only Information */}
      {timeBasedConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration (Read-Only)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">
                  Time Granularity
                  <span className="inline ml-1" tabIndex={0} title="Determines if your points are tracked monthly, weekly, daily, etc.">
                    <Info className="inline h-4 w-4 text-blue-500" aria-label="Time granularity info" />
                  </span>
                </Label>
                <div className="font-medium capitalize">{timeBasedConfig.time_granularity}</div>
              </div>
              <div>
                <Label className="text-gray-600">
                  Multiple Series
                  <span className="inline ml-1" tabIndex={0} title="Enable to track and plot more than one data series.">
                    <Info className="inline h-4 w-4 text-blue-500" aria-label="Allow multiple series info" />
                  </span>
                </Label>
                <div className="font-medium">{timeBasedConfig.allow_multiple_series ? "Enabled" : "Disabled"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editable Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="chart_type">Chart Type</Label>
              <Select value={chartType} onValueChange={updateChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="y_axis_label">Y-Axis Label</Label>
              <Input
                id="y_axis_label"
                value={yAxisLabel}
                onChange={(e) => updateYAxisLabel(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Series Manager */}
      <Card>
        <CardHeader>
          <CardTitle>
            Data Series
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SeriesManager
            series={series}
            allowMultiple={!!timeBasedConfig?.allow_multiple_series}
            addSeries={addSeries}
            removeSeries={removeSeries}
            updateSeries={updateSeries}
          />
        </CardContent>
      </Card>

      {/* Data Points */}
      <Card>
        <CardHeader>
          <CardTitle>Data Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {series.map((seriesItem) => {
            const availableYears = getAvailableYears(points, seriesItem.name, (timeBasedConfig?.time_granularity || 'month') as TimeGranularity);
            
            return (
              <div key={seriesItem.id} className="border rounded-lg p-4 space-y-4 mb-6">
                <Label className="font-medium block mb-2">{seriesItem.name} Points</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getPointsForSeries(seriesItem.name).map((point) => (
                    <DataPointRow
                      key={`${seriesItem.id}-${point.originalIndex}`}
                      point={point}
                      renderTimeField={renderTimeField}
                      updateDataPoint={updateDataPoint}
                      removeDataPoint={removeDataPoint}
                      validationError={pointValidationErrors[point.originalIndex] || ""}
                      availableYears={availableYears}
                    />
                  ))}
                </div>
                <div className="flex items-center mt-2">
                  <Button
                    type="button"
                    onClick={() => addDataPoint(seriesItem.name, seriesItem.color)}
                    variant="outline"
                    size="sm"
                    disabled={!canAddDataPoint(seriesItem.name)}
                    aria-label="Add data point"
                  >
                    + Add Point
                  </Button>
                  {!canAddDataPoint(seriesItem.name) && (
                    <span className="ml-2 text-xs text-red-500">Cannot add: would create duplicate</span>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeBasedForm;
