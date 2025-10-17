
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SingleValueForm from "./SingleValueForm";
import MultiValueForm from "./MultiValueForm";
import TimeBasedCreateForm from "./TimeBasedCreateForm";

interface MetricFormData {
  name: string;
  display_name: string;
  description?: string;
  size_config: 'small' | 'medium' | 'large' | 'xl';
  sort_order: number;
  is_active: boolean;
  metric_type: 'single_value' | 'multi_value' | 'time_based';
  single_value?: any;
  multi_value?: any;
  time_based?: any;
  data_points?: any[];
}

interface MetricFormProps {
  sectionId: string;
  initialData?: MetricFormData;
  onSave: (data: any) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const MetricForm: React.FC<MetricFormProps> = ({
  sectionId,
  initialData,
  onSave,
  onCancel,
  isEdit = false
}) => {
  console.log('MetricForm: Rendering with initialData:', {
    hasInitialData: !!initialData,
    metricType: initialData?.metric_type,
    dataPointsLength: initialData?.data_points?.length || 0,
    dataPoints: initialData?.data_points,
    fullInitialData: initialData
  });

  const [formData, setFormData] = useState<MetricFormData>(
    initialData || {
      name: '',
      display_name: '',
      description: '',
      size_config: 'medium',
      sort_order: 0,
      is_active: true,
      metric_type: 'single_value'
    }
  );

  const [typeSpecificData, setTypeSpecificData] = useState<any>(null);
  const [dataPoints, setDataPoints] = useState<any[]>([]);

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    console.log('MetricForm: useEffect for initialData triggered', {
      hasInitialData: !!initialData,
      metricType: initialData?.metric_type,
      dataPointsLength: initialData?.data_points?.length || 0
    });
    
    if (initialData) {
      console.log('MetricForm: Setting form data from initialData:', initialData);
      setFormData(initialData);
    }
  }, [initialData]);

  // Initialize type-specific data and data points when form data changes
  useEffect(() => {
    console.log('MetricForm: useEffect for formData triggered', {
      metricType: formData.metric_type,
      hasTypeSpecificData: !!formData[formData.metric_type],
      dataPointsLength: formData.data_points?.length || 0
    });

    if (formData.metric_type === 'single_value' && formData.single_value) {
      console.log('MetricForm: Setting single value data:', formData.single_value);
      setTypeSpecificData(formData.single_value);
    } else if (formData.metric_type === 'multi_value' && formData.multi_value) {
      console.log('MetricForm: Setting multi value data:', {
        config: formData.multi_value,
        dataPoints: formData.data_points
      });
      setTypeSpecificData(formData.multi_value);
      setDataPoints(formData.data_points || []);
    } else if (formData.metric_type === 'time_based' && formData.time_based) {
      console.log('MetricForm: Setting time-based data:', {
        config: formData.time_based,
        dataPoints: formData.data_points,
        dataPointsLength: formData.data_points?.length || 0
      });
      setTypeSpecificData(formData.time_based);
      setDataPoints(formData.data_points || []);
    } else {
      // Reset if no type-specific data exists
      console.log('MetricForm: No type-specific data found, resetting');
      setTypeSpecificData(null);
      setDataPoints([]);
    }
  }, [formData, formData.metric_type, formData.single_value, formData.multi_value, formData.time_based, formData.data_points]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseData = {
      name: formData.name,
      display_name: formData.display_name,
      description: formData.description || null,
      size_config: formData.size_config,
      sort_order: formData.sort_order,
      is_active: formData.is_active,
      section_id: sectionId
    };

    const submitData = {
      base: baseData,
      metricType: formData.metric_type,
      singleValue: formData.metric_type === 'single_value' ? typeSpecificData : null,
      multiValue: formData.metric_type === 'multi_value' ? typeSpecificData : null,
      timeBased: formData.metric_type === 'time_based' ? typeSpecificData : null,
      dataPoints: ['multi_value', 'time_based'].includes(formData.metric_type) ? dataPoints : []
    };

    console.log('MetricForm: Submitting data:', submitData);
    onSave(submitData);
  };

  const handleTypeSpecificChange = (data: any, points?: any[]) => {
    console.log('MetricForm: Type-specific data changed:', {
      metricType: formData.metric_type,
      data,
      pointsLength: points?.length || 0,
      points
    });
    
    setTypeSpecificData(data);
    if (points !== undefined) {
      console.log('MetricForm: Setting data points:', points);
      setDataPoints(points);
    }
  };

  const updateFormField = (field: keyof MetricFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderTypeSpecificForm = () => {
    console.log('MetricForm: Rendering type-specific form for:', {
      metricType: formData.metric_type,
      hasTypeSpecificData: !!typeSpecificData,
      dataPointsLength: dataPoints.length,
      typeSpecificData,
      dataPoints
    });

    switch (formData.metric_type) {
      case 'single_value':
        return (
          <SingleValueForm
            data={typeSpecificData}
            onChange={(data) => handleTypeSpecificChange(data)}
          />
        );
      case 'multi_value':
        console.log('MetricForm: Rendering MultiValueForm with:', {
          data: typeSpecificData,
          dataPoints: dataPoints,
          dataPointsLength: dataPoints.length
        });
        return (
          <MultiValueForm
            data={typeSpecificData}
            dataPoints={dataPoints}
            onChange={(data, points) => handleTypeSpecificChange(data, points)}
          />
        );
      case 'time_based':
        console.log('MetricForm: Rendering TimeBasedCreateForm with:', {
          data: typeSpecificData,
          dataPoints: dataPoints,
          dataPointsLength: dataPoints.length
        });
        return (
          <TimeBasedCreateForm
            data={typeSpecificData}
            dataPoints={dataPoints}
            onChange={(data, points) => handleTypeSpecificChange(data, points)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit' : 'Create'} Metric</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => updateFormField('display_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => updateFormField('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="metric_type">Metric Type</Label>
              <Select 
                value={formData.metric_type} 
                onValueChange={(value) => updateFormField('metric_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_value">Single Value</SelectItem>
                  <SelectItem value="multi_value">Multi Value</SelectItem>
                  <SelectItem value="time_based">Time Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="size_config">Size</Label>
              <Select 
                value={formData.size_config} 
                onValueChange={(value) => updateFormField('size_config', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => updateFormField('sort_order', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => updateFormField('is_active', checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Type-specific configuration */}
      {renderTypeSpecificForm()}

      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update' : 'Create'} Metric
        </Button>
      </div>
    </form>
  );
};

export default MetricForm;
