import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
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

interface TimeBasedData {
  chart_type: string;
  y_axis_label: string;
  time_granularity: string;
  allow_multiple_series: boolean;
}

interface SeriesConfig {
  id: string;
  name: string;
  color: string;
}

interface DataPoint {
  year: number;
  month?: number;
  quarter?: number;
  week?: number;
  day?: number;
  date_value?: string;
  value: number;
  series_name: string;
  series_color: string;
}

interface TimeBasedCreateFormProps {
  data?: TimeBasedData;
  dataPoints?: TimeBasedDataPoint[];
  onChange: (data: TimeBasedData, dataPoints: TimeBasedDataPoint[], hasErrors?: boolean) => void;
}

const TimeBasedCreateForm: React.FC<TimeBasedCreateFormProps> = ({ 
  data, 
  dataPoints = [], 
  onChange 
}) => {
  const [chartType, setChartType] = useState(data?.chart_type || 'line');
  const [yAxisLabel, setYAxisLabel] = useState(data?.y_axis_label || 'Value');
  const [timeGranularity, setTimeGranularity] = useState(data?.time_granularity || 'month');
  const [allowMultipleSeries, setAllowMultipleSeries] = useState(data?.allow_multiple_series || false);
  const [series, setSeries] = useState<SeriesConfig[]>([{
    id: 'series-1',
    name: 'Series 1',
    color: '#4F46E5'
  }]);
  const [points, setPoints] = useState<TimeBasedDataPoint[]>(dataPoints);
  const [validationError, setValidationError] = useState<string>('');

  // Initialize from existing data
  useEffect(() => {
    if (data) {
      setChartType(data.chart_type);
      setYAxisLabel(data.y_axis_label);
      setTimeGranularity(data.time_granularity);
      setAllowMultipleSeries(data.allow_multiple_series);
    }

    if (dataPoints && dataPoints.length > 0) {
      // Extract unique series from data points
      const uniqueSeries = new Map<string, SeriesConfig>();
      
      dataPoints.forEach((point: TimeBasedDataPoint) => {
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
        setSeries(Array.from(uniqueSeries.values()));
      }

      setPoints(dataPoints);
    }
  }, [data, dataPoints]);

  // Check for validation errors whenever points or series change
  useEffect(() => {
    const hasErrors = hasValidationErrors(points, timeGranularity as TimeGranularity, series);
    notifyChanges(getCurrentData(), points, hasErrors);
  }, [points, series, timeGranularity]);

  const getCurrentData = (): TimeBasedData => ({
    chart_type: chartType,
    y_axis_label: yAxisLabel,
    time_granularity: timeGranularity,
    allow_multiple_series: allowMultipleSeries
  });

  // Notify parent of changes
  const notifyChanges = (newData: TimeBasedData, newPoints: TimeBasedDataPoint[], hasErrors: boolean = false) => {
    onChange(newData, newPoints, hasErrors);
  };

  const updateConfig = (field: keyof TimeBasedData, value: any) => {
    const newData = {
      chart_type: chartType,
      y_axis_label: yAxisLabel,
      time_granularity: timeGranularity,
      allow_multiple_series: allowMultipleSeries,
      [field]: value
    };

    // Update local state
    switch (field) {
      case 'chart_type':
        setChartType(value);
        break;
      case 'y_axis_label':
        setYAxisLabel(value);
        break;
      case 'time_granularity':
        setTimeGranularity(value);
        // Clear existing points when granularity changes
        setPoints([]);
        setValidationError('');
        break;
      case 'allow_multiple_series':
        setAllowMultipleSeries(value);
        break;
    }

    const newPoints = field === 'time_granularity' ? [] : points;
    const hasErrors = hasValidationErrors(newPoints, (field === 'time_granularity' ? value : timeGranularity) as TimeGranularity, series);
    notifyChanges(newData, newPoints, hasErrors);
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
    
    const currentData = {
      chart_type: chartType,
      y_axis_label: yAxisLabel,
      time_granularity: timeGranularity,
      allow_multiple_series: allowMultipleSeries
    };
    notifyChanges(currentData, newPoints);
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
      
      const currentData = {
        chart_type: chartType,
        y_axis_label: yAxisLabel,
        time_granularity: timeGranularity,
        allow_multiple_series: allowMultipleSeries
      };
      notifyChanges(currentData, newPoints);
    }
  };

  const addDataPoint = (seriesName: string, seriesColor: string) => {
    const granularity = timeGranularity as TimeGranularity;
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
      return;
    }

    setValidationError('');
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
        if (field === 'date_value' && timeGranularity === 'day' && value) {
          const selectedDate = new Date(value);
          updatedPoint.year = selectedDate.getFullYear();
          updatedPoint.month = selectedDate.getMonth() + 1;
          updatedPoint.day = selectedDate.getDate();
        }

        // Validate the updated point for duplicates
        const granularity = timeGranularity as TimeGranularity;
        const otherPoints = points.filter((_, idx) => idx !== i);
        const validation = validateTimeBasedDataPoint(updatedPoint, otherPoints, granularity, updatedPoint.series_name);
        
        if (!validation.isValid) {
          setValidationError(validation.message || 'Invalid data point');
          return point; // Return original point if validation fails
        } else {
          setValidationError('');
        }
        
        return updatedPoint;
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

  const renderTimeField = (point: any) => {
    const seriesName = points.find((_, i) => i === point.originalIndex)?.series_name || '';

    switch (timeGranularity) {
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
              value={point.quarter?.toString() || ''} 
              onValueChange={(value) => updateDataPoint(point.originalIndex, 'quarter', parseInt(value))}
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

  const canAddDataPoint = (seriesName: string) => {
    const granularity = timeGranularity as TimeGranularity;
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

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Time-Based Chart Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="chart_type">Chart Type</Label>
              <Select value={chartType} onValueChange={(value) => updateConfig('chart_type', value)}>
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
                onChange={(e) => updateConfig('y_axis_label', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time_granularity">Time Granularity</Label>
              <Select value={timeGranularity} onValueChange={(value) => updateConfig('time_granularity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allow_multiple_series"
                checked={allowMultipleSeries}
                onCheckedChange={(checked) => updateConfig('allow_multiple_series', checked)}
              />
              <Label htmlFor="allow_multiple_series">Allow Multiple Series</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Series Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Data Series
            {allowMultipleSeries && (
              <Button type="button" onClick={addSeries} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2"  />
                Add Series
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {series.map((seriesItem) => {
            const existingPeriods = getExistingTimePeriods(
              points, 
              timeGranularity as TimeGranularity, 
              seriesItem.name
            );
            const availableYears = getAvailableYears(points, seriesItem.name, timeGranularity as TimeGranularity);
            
            return (
              <div key={seriesItem.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <Label htmlFor={`series-name-${seriesItem.id}`}>Series Name</Label>
                      <Input
                        id={`series-name-${seriesItem.id}`}
                        value={seriesItem.name}
                        onChange={(e) => updateSeries(seriesItem.id, 'name', e.target.value)}
                        placeholder="Series name"
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`series-color-${seriesItem.id}`}>Color</Label>
                      <ColorPicker
                        value={seriesItem.color}
                        onChange={(color) => updateSeries(seriesItem.id, 'color', color)}
                      />
                    </div>
                  </div>
                  {allowMultipleSeries && series.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeSeries(seriesItem.id)}
                      variant="outline"
                      size="sm"
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Show existing periods info */}
                {existingPeriods.length > 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Existing periods:</strong> {existingPeriods.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Data Points for this series */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Data Points</Label>
                    <Button
                      type="button"
                      onClick={() => addDataPoint(seriesItem.name, seriesItem.color)}
                      variant="outline"
                      size="sm"
                      disabled={!canAddDataPoint(seriesItem.name)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Point
                    </Button>
                  </div>

                  {!canAddDataPoint(seriesItem.name) && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Cannot add new data point: The next suggested time period would create a duplicate.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {getPointsForSeries(seriesItem.name).map((point) => (
                      <div key={`${seriesItem.id}-${point.originalIndex}`} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <div className="flex-shrink-0 w-20">
                          <Label className="text-xs">Year</Label>
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
                        </div>
                        
                        {renderTimeField(point)}
                        
                        <div className="flex-shrink-0 w-24">
                          <Label className="text-xs">Value</Label>
                          <NumberInput
                            value={point.value || null}
                            onChange={(value) => updateDataPoint(point.originalIndex, 'value', value || 0)}
                            className="h-8"
                          />
                        </div>
                        
                        <Button
                          type="button"
                          onClick={() => removeDataPoint(point.originalIndex)}
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeBasedCreateForm;
