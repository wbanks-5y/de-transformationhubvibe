
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CockpitKPI, CockpitMetric } from "@/types/cockpit";
import KPIBasicFields from "./forms/KPIBasicFields";
import KPIDisplayFields from "./forms/KPIDisplayFields";
import KPIDataTypeFields from "./forms/KPIDataTypeFields";
import KPIFormatFields from "./forms/KPIFormatFields";

interface KPIEditFormProps {
  kpi?: CockpitKPI;
  availableMetrics: CockpitMetric[];
  isCreating: boolean;
  onSave: (data: Partial<CockpitKPI>) => Promise<void>;
  onCancel: () => void;
}

const KPIEditForm: React.FC<KPIEditFormProps> = ({
  kpi,
  availableMetrics,
  isCreating,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<CockpitKPI>>({
    name: kpi?.name || '',
    display_name: kpi?.display_name || '',
    description: kpi?.description || '',
    kpi_data_type: kpi?.kpi_data_type || 'single',
    trend_direction: kpi?.trend_direction || 'higher_is_better',
    format_type: kpi?.format_type || 'number',
    format_options: kpi?.format_options || {},
    icon: kpi?.icon || '',
    color_class: kpi?.color_class || 'text-blue-600',
    sort_order: kpi?.sort_order || 0,
    is_active: kpi?.is_active !== false,
    size_config: kpi?.size_config || 'medium',
    weight: kpi?.weight || 1.0,
    cockpit_type_id: kpi?.cockpit_type_id || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate request');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting KPI form:', { isCreating, formData });
      
      const saveData = isCreating 
        ? formData
        : { id: kpi?.id, ...formData };
      
      await onSave(saveData);
      
      console.log('KPI save successful, closing form');
      onCancel();
    } catch (error) {
      console.error('Error saving KPI:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (updates: Partial<CockpitKPI>) => {
    setFormData({ ...formData, ...updates });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {isCreating ? "Create New KPI" : "Edit KPI"}
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <KPIBasicFields formData={formData} onChange={updateFormData} />
          
          <KPIDataTypeFields formData={formData} onChange={updateFormData} />
          
          <KPIFormatFields formData={formData} onChange={updateFormData} />
          
          <KPIDisplayFields formData={formData} onChange={updateFormData} />

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isCreating ? "Create KPI" : "Update KPI")}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default KPIEditForm;
