import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import MetricChart from "@/components/MetricChart";

interface ChartDataPoint {
  name: string;
  value: number;
}

interface ChartConfig {
  chartType: 'bar' | 'line' | 'area';
  color: string;
  showAxis: boolean;
  gradient: boolean;
}

interface ChartDataEditorProps {
  chartData: ChartDataPoint[];
  chartConfig: ChartConfig;
  onChartDataChange: (data: ChartDataPoint[]) => void;
  onChartConfigChange: (config: ChartConfig) => void;
}

const ChartDataEditor: React.FC<ChartDataEditorProps> = ({
  chartData,
  chartConfig,
  onChartDataChange,
  onChartConfigChange,
}) => {
  const [localData, setLocalData] = useState<ChartDataPoint[]>(chartData);

  useEffect(() => {
    setLocalData(chartData);
  }, [chartData]);

  const addDataPoint = () => {
    const newPoint: ChartDataPoint = {
      name: `Point ${localData.length + 1}`,
      value: 0
    };
    const updatedData = [...localData, newPoint];
    setLocalData(updatedData);
    // Don't call onChartDataChange here - only update local state
  };

  const removeDataPoint = (index: number) => {
    const updatedData = localData.filter((_, i) => i !== index);
    setLocalData(updatedData);
    onChartDataChange(updatedData);
  };

  const updateDataPoint = (index: number, field: keyof ChartDataPoint, value: string | number) => {
    const updatedData = localData.map((point, i) => 
      i === index ? { ...point, [field]: value } : point
    );
    setLocalData(updatedData);
    onChartDataChange(updatedData);
  };

  return (
    <div className="space-y-6">
      {/* Data Points Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Data Points
            <Button onClick={addDataPoint} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Point
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {localData.map((point, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={point.name}
                    onChange={(e) => updateDataPoint(index, 'name', e.target.value)}
                    placeholder="Point name"
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Value</Label>
                  <Input
                    type="number"
                    value={point.value}
                    onChange={(e) => updateDataPoint(index, 'value', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeDataPoint(index)}
                  className="mt-6"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {localData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No data points yet. Click "Add Point" to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chart Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chart Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {localData.length > 0 ? (
            <div className="h-64">
              <MetricChart
                type={chartConfig.chartType}
                data={localData}
                dataKey="value"
                color={chartConfig.color}
                height={250}
                showAxis={chartConfig.showAxis}
                gradient={chartConfig.gradient}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 border border-gray-200 rounded">
              Add data points to see chart preview
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartDataEditor;
