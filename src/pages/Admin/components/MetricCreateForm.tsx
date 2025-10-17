
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { CockpitMetric } from "@/types/cockpit";
import { toast } from "sonner";

interface MetricCreateFormProps {
  sectionId: string;
  onSave: (metric: Partial<CockpitMetric>) => Promise<CockpitMetric>;
  onCancel: () => void;
}

// This is the legacy form - we should redirect users to use the new form structure
const MetricCreateForm: React.FC<MetricCreateFormProps> = ({
  sectionId,
  onSave,
  onCancel,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Legacy Metric Creation
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            This legacy form has been replaced with a new structure-based form.
          </p>
          <p className="text-sm text-gray-500">
            Please use the new metric creation form that properly represents the database table structure.
          </p>
          <Button onClick={onCancel} className="mt-4">
            Return to Metrics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCreateForm;
