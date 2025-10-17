
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreateSectionFormProps {
  cockpitTypeId: string;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CreateSectionForm: React.FC<CreateSectionFormProps> = ({ cockpitTypeId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    sort_order: 0,
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave({
        ...formData,
        cockpit_type_id: cockpitTypeId
      });
      onCancel();
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Section</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name (ID)</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., performance_metrics"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <Input
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="e.g., Performance Metrics"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description of this section"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort Order</label>
            <Input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Create Section</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateSectionForm;
