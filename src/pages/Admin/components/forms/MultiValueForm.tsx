
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { NumberInput } from "@/components/ui/number-input";
import ColorPicker from "@/components/ui/color-picker";

interface MultiValueConfig {
  chart_type: string;
  x_axis_label: string;
  y_axis_label: string;
  allow_multiple_series: boolean;
}

interface DataPoint {
  x_axis_value: string;
  y_axis_value: number;
  series_name: string;
  series_color: string;
  sort_order: number;
}

interface SeriesGroup {
  name: string;
  color: string;
  points: DataPoint[];
}

interface MultiValueFormProps {
  data?: MultiValueConfig;
  dataPoints?: DataPoint[];
  onChange: (config: MultiValueConfig, dataPoints: DataPoint[]) => void;
}

const MultiValueForm: React.FC<MultiValueFormProps> = ({ data, dataPoints = [], onChange }) => {
  console.log('MultiValueForm: Rendering with props:', {
    hasData: !!data,
    dataPointsLength: dataPoints?.length || 0,
    dataPoints,
    data
  });

  const [config, setConfig] = useState<MultiValueConfig>(data || {
    chart_type: 'bar',
    x_axis_label: 'Category',
    y_axis_label: 'Value',
    allow_multiple_series: true
  });

  const [series, setSeries] = useState<SeriesGroup[]>(() => {
    console.log('MultiValueForm: Initializing series with dataPoints:', dataPoints);
    
    if (!dataPoints || dataPoints.length === 0) {
      console.log('MultiValueForm: No data points, creating default series');
      return [{
        name: 'Series 1',
        color: '#3B82F6',
        points: [{ x_axis_value: 'Category 1', y_axis_value: 0, series_name: 'Series 1', series_color: '#3B82F6', sort_order: 0 }]
      }];
    }

    // Group existing data points by series
    const grouped = dataPoints.reduce((acc, point) => {
      const key = `${point.series_name}|${point.series_color}`;
      if (!acc[key]) {
        acc[key] = {
          name: point.series_name,
          color: point.series_color,
          points: []
        };
      }
      acc[key].points.push(point);
      return acc;
    }, {} as Record<string, SeriesGroup>);

    const result = Object.values(grouped);
    console.log('MultiValueForm: Grouped series:', result);
    return result;
  });

  // Update config when data prop changes
  useEffect(() => {
    console.log('MultiValueForm: Config useEffect triggered with data:', data);
    if (data) {
      setConfig(data);
    }
  }, [data]);

  // Update series when dataPoints prop changes
  useEffect(() => {
    console.log('MultiValueForm: DataPoints useEffect triggered with:', {
      dataPointsLength: dataPoints?.length || 0,
      dataPoints
    });
    
    if (dataPoints && dataPoints.length > 0) {
      // Group existing data points by series
      const grouped = dataPoints.reduce((acc, point) => {
        const key = `${point.series_name}|${point.series_color}`;
        if (!acc[key]) {
          acc[key] = {
            name: point.series_name,
            color: point.series_color,
            points: []
          };
        }
        acc[key].points.push(point);
        return acc;
      }, {} as Record<string, SeriesGroup>);

      const newSeries = Object.values(grouped);
      console.log('MultiValueForm: Setting new series from dataPoints:', newSeries);
      setSeries(newSeries);
    }
  }, [dataPoints]);

  const updateConfig = (field: keyof MultiValueConfig, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    emitChanges(newConfig, series);
  };

  const emitChanges = (newConfig: MultiValueConfig, newSeries: SeriesGroup[]) => {
    const allPoints = newSeries.flatMap(s => s.points);
    console.log('MultiValueForm: Emitting changes:', {
      config: newConfig,
      pointsLength: allPoints.length,
      points: allPoints
    });
    onChange(newConfig, allPoints);
  };

  const addSeries = () => {
    const newSeries = {
      name: `Series ${series.length + 1}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      points: [{ x_axis_value: 'Category 1', y_axis_value: 0, series_name: `Series ${series.length + 1}`, series_color: `#${Math.floor(Math.random()*16777215).toString(16)}`, sort_order: 0 }]
    };
    const updated = [...series, newSeries];
    setSeries(updated);
    emitChanges(config, updated);
  };

  const removeSeries = (index: number) => {
    if (series.length <= 1) return;
    const updated = series.filter((_, i) => i !== index);
    setSeries(updated);
    emitChanges(config, updated);
  };

  const updateSeries = (seriesIndex: number, field: 'name' | 'color', value: string) => {
    const updated = series.map((s, i) => {
      if (i === seriesIndex) {
        const updatedSeries = { ...s, [field]: value };
        // Update all points in this series
        updatedSeries.points = s.points.map(p => ({
          ...p,
          series_name: field === 'name' ? value : p.series_name,
          series_color: field === 'color' ? value : p.series_color
        }));
        return updatedSeries;
      }
      return s;
    });
    setSeries(updated);
    emitChanges(config, updated);
  };

  const addDataPoint = (seriesIndex: number) => {
    const updated = series.map((s, i) => {
      if (i === seriesIndex) {
        const newPoint = {
          x_axis_value: `Category ${s.points.length + 1}`,
          y_axis_value: 0,
          series_name: s.name,
          series_color: s.color,
          sort_order: s.points.length
        };
        return { ...s, points: [...s.points, newPoint] };
      }
      return s;
    });
    setSeries(updated);
    emitChanges(config, updated);
  };

  const removeDataPoint = (seriesIndex: number, pointIndex: number) => {
    const updated = series.map((s, i) => {
      if (i === seriesIndex) {
        return { ...s, points: s.points.filter((_, pi) => pi !== pointIndex) };
      }
      return s;
    });
    setSeries(updated);
    emitChanges(config, updated);
  };

  const updateDataPoint = (seriesIndex: number, pointIndex: number, field: 'x_axis_value' | 'y_axis_value', value: string | number) => {
    const updated = series.map((s, i) => {
      if (i === seriesIndex) {
        return {
          ...s,
          points: s.points.map((p, pi) => {
            if (pi === pointIndex) {
              return { ...p, [field]: value };
            }
            return p;
          })
        };
      }
      return s;
    });
    setSeries(updated);
    emitChanges(config, updated);
  };

  return (
    <div className="space-y-6">
      {/* Chart Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="chart_type">Chart Type</Label>
              <Select value={config.chart_type} onValueChange={(value) => updateConfig('chart_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="horizontal_bar">Horizontal Bar</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="doughnut">Doughnut Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="x_axis_label">X-Axis Label</Label>
              <Input
                id="x_axis_label"
                value={config.x_axis_label}
                onChange={(e) => updateConfig('x_axis_label', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="y_axis_label">Y-Axis Label</Label>
              <Input
                id="y_axis_label"
                value={config.y_axis_label}
                onChange={(e) => updateConfig('y_axis_label', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="allow_multiple_series"
              checked={config.allow_multiple_series}
              onCheckedChange={(checked) => updateConfig('allow_multiple_series', checked)}
            />
            <Label htmlFor="allow_multiple_series">Allow Multiple Series</Label>
          </div>
        </CardContent>
      </Card>

      {/* Data Series */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Data Series
            {config.allow_multiple_series && (
              <Button type="button" onClick={addSeries} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Series
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {series.map((s, seriesIndex) => (
            <div key={seriesIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <Label>Series Name</Label>
                    <Input
                      value={s.name}
                      onChange={(e) => updateSeries(seriesIndex, 'name', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <div>
                    <ColorPicker
                      label="Color"
                      value={s.color}
                      onChange={(color) => updateSeries(seriesIndex, 'color', color)}
                    />
                  </div>
                </div>
                {config.allow_multiple_series && series.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSeries(seriesIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Data Points</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addDataPoint(seriesIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Point
                  </Button>
                </div>
                <div className="space-y-2">
                  {s.points.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-center gap-2">
                      <Input
                        placeholder="Category"
                        value={point.x_axis_value}
                        onChange={(e) => updateDataPoint(seriesIndex, pointIndex, 'x_axis_value', e.target.value)}
                        className="flex-1"
                      />
                      <NumberInput
                        placeholder="Value"
                        value={point.y_axis_value || null}
                        onChange={(value) => updateDataPoint(seriesIndex, pointIndex, 'y_axis_value', value || 0)}
                        className="flex-1"
                      />
                      {s.points.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDataPoint(seriesIndex, pointIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiValueForm;
