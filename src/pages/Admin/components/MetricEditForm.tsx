import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import TimeBasedForm from "./forms/TimeBasedForm";
import { useMetricDirectUpdate } from "@/hooks/use-metric-direct-update";
import { MetricDisplay, TimeBasedMetricDisplay } from "@/types/metrics";

// Define the allowed chart types
type ChartType = "line" | "area" | "bar" | "stacked_area" | "stepped_line" | "smooth_line" | "stacked_bar" | "waterfall" | "scatter" | "bubble" | "candlestick" | "ohlc" | "heatmap" | "calendar_heatmap" | "stream_graph";

interface MetricEditFormProps {
  metric: MetricDisplay;
  onClose: () => void;
}

const MetricEditForm: React.FC<MetricEditFormProps> = ({ metric, onClose }) => {
  console.log('MetricEditForm: Editing metric:', {
    metricId: metric.id,
    metricType: metric.metric_type,
    fullMetric: metric
  });

  // Type guard function to ensure we have a valid chart type
  const getValidChartType = (type: string | undefined): ChartType => {
    const validTypes: ChartType[] = ["line", "area", "bar", "stacked_area", "stepped_line", "smooth_line", "stacked_bar", "waterfall", "scatter", "bubble", "candlestick", "ohlc", "heatmap", "calendar_heatmap", "stream_graph"];
    return validTypes.includes(type as ChartType) ? (type as ChartType) : "line";
  };

  const [isActive, setIsActive] = useState(metric.is_active);
  const [chartType, setChartType] = useState<ChartType>(
    metric.metric_type === 'time_based' 
      ? getValidChartType(metric.time_based_data?.chart_type)
      : "line"
  );
  const [yAxisLabel, setYAxisLabel] = useState(metric.metric_type === 'time_based' ? metric.time_based_data?.y_axis_label || 'Value' : 'Value');
  const [dataPoints, setDataPoints] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  const updateMetric = useMetricDirectUpdate();

  // Initialize data points for time-based metrics
  React.useEffect(() => {
    if (metric.metric_type === 'time_based') {
      const metricWithDataPoints = metric as TimeBasedMetricDisplay;
      if (metricWithDataPoints.data_points && metricWithDataPoints.data_points.length > 0) {
        console.log('MetricEditForm: Setting initial data points:', metricWithDataPoints.data_points);
        setDataPoints(metricWithDataPoints.data_points);
      }
    }
  }, [metric]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if there are validation errors
    if (hasValidationErrors) {
      alert('Please fix validation errors before submitting.');
      return;
    }
    
    // Prevent multiple submissions
    if (isSubmitting || updateMetric.isPending) {
      console.log('MetricEditForm: Submit prevented - already submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    console.log('MetricEditForm: Submit triggered');
    console.log('MetricEditForm: Current state:', {
      isActive,
      chartType,
      yAxisLabel,
      dataPointsCount: dataPoints.length
    });
    
    try {
      if (metric.metric_type === 'time_based') {
        await updateMetric.mutateAsync({
          metricId: metric.id,
          baseUpdate: {
            is_active: isActive
          },
          configUpdate: {
            chart_type: chartType,
            y_axis_label: yAxisLabel
          },
          dataPoints: dataPoints
        });
        
        console.log('MetricEditForm: Update completed successfully');
        onClose();
      } else {
        console.log('MetricEditForm: Non-time-based metrics not supported in this form');
      }
    } catch (error) {
      console.error('MetricEditForm: Error updating metric:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, updateMetric.isPending, isActive, chartType, yAxisLabel, dataPoints, metric.id, metric.metric_type, updateMetric, onClose, hasValidationErrors]);

  const handleTimeBasedDataChange = useCallback((newChartType: string, newYAxisLabel: string, newDataPoints: any[], hasErrors: boolean = false) => {
    console.log('MetricEditForm: Time-based data changed:', {
      chartType: newChartType,
      yAxisLabel: newYAxisLabel,
      dataPointsCount: newDataPoints.length,
      hasErrors
    });
    
    setChartType(getValidChartType(newChartType));
    setYAxisLabel(newYAxisLabel);
    setDataPoints(newDataPoints);
    setHasValidationErrors(hasErrors);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Validation Error Alert */}
      {hasValidationErrors && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Cannot Save:</strong> Please fix the validation errors shown below before saving the metric.
          </AlertDescription>
        </Alert>
      )}

      {/* Edit Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Limited Editing:</strong> You can edit the Active status, chart type, y-axis label, and data points. 
          To change core properties like name or description, please delete and recreate the metric.
        </AlertDescription>
      </Alert>

      {/* Read-only Information */}
      <Card>
        <CardHeader>
          <CardTitle>Metric Information (Read-Only)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-gray-600">Name</Label>
              <div className="font-medium">{metric.name}</div>
            </div>
            <div>
              <Label className="text-gray-600">Display Name</Label>
              <div className="font-medium">{metric.display_name}</div>
            </div>
            <div>
              <Label className="text-gray-600">Type</Label>
              <div className="font-medium capitalize">{metric.metric_type}</div>
            </div>
            <div>
              <Label className="text-gray-600">Size</Label>
              <div className="font-medium capitalize">{metric.size_config}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Active Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Time-based specific configuration */}
      {metric.metric_type === 'time_based' && (
        <TimeBasedForm
          initialChartType={chartType}
          initialYAxisLabel={yAxisLabel}
          initialDataPoints={dataPoints}
          timeBasedConfig={metric.time_based_data}
          onChange={handleTimeBasedDataChange}
        />
      )}

      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting || updateMetric.isPending}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || updateMetric.isPending || hasValidationErrors}
          className={hasValidationErrors ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {isSubmitting || updateMetric.isPending ? 'Updating...' : 'Update Metric'}
        </Button>
      </div>
    </form>
  );
};

export default MetricEditForm;
