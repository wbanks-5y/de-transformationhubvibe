
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SingleValueData {
  metric_type: 'number' | 'percentage' | 'currency';
  actual_value?: number;
  target_value?: number;
  trend?: 'up' | 'down' | 'stable';
}

interface SingleValueFormProps {
  data?: SingleValueData;
  onChange: (data: SingleValueData) => void;
}

const SingleValueForm: React.FC<SingleValueFormProps> = ({ data, onChange }) => {
  const formData = data || {
    metric_type: 'number',
    actual_value: 0,
    target_value: 0,
    trend: 'stable'
  };

  const handleChange = (field: keyof SingleValueData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Single Value Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="metric_type">Value Type</Label>
          <Select
            value={formData.metric_type}
            onValueChange={(value) => handleChange('metric_type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="currency">Currency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="actual_value">Current Value</Label>
            <NumberInput
              id="actual_value"
              value={formData.actual_value || null}
              onChange={(value) => handleChange('actual_value', value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="target_value">Target Value</Label>
            <NumberInput
              id="target_value"
              value={formData.target_value || null}
              onChange={(value) => handleChange('target_value', value)}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="trend">Trend</Label>
          <Select
            value={formData.trend}
            onValueChange={(value) => handleChange('trend', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="up">Up</SelectItem>
              <SelectItem value="down">Down</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default SingleValueForm;
