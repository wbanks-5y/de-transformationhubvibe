
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, X, Edit } from "lucide-react";
import { CockpitType, CockpitSection } from "@/types/cockpit";
import { useCreateCockpitSection, useUpdateCockpitSection, useDeleteCockpitSection } from "@/hooks/use-cockpit-sections";

interface SectionManagementProps {
  cockpit: CockpitType;
  sections: CockpitSection[];
}

const SectionManagement: React.FC<SectionManagementProps> = ({
  cockpit,
  sections
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSection, setEditingSection] = useState<CockpitSection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    sort_order: 0
  });

  const createSection = useCreateCockpitSection();
  const updateSection = useUpdateCockpitSection();
  const deleteSection = useDeleteCockpitSection();

  const resetForm = () => {
    setFormData({
      name: '',
      display_name: '',
      description: '',
      sort_order: 0
    });
    setShowCreateForm(false);
    setEditingSection(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSection.mutateAsync({
        ...formData,
        cockpit_type_id: cockpit.id,
        is_active: true
      });
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleEdit = (section: CockpitSection) => {
    setFormData({
      name: section.name,
      display_name: section.display_name,
      description: section.description || '',
      sort_order: section.sort_order || 0
    });
    setEditingSection(section);
    setShowCreateForm(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    try {
      await updateSection.mutateAsync({
        id: editingSection.id,
        updates: {
          display_name: formData.display_name,
          description: formData.description,
          sort_order: formData.sort_order
        }
      });
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleDelete = async (section: CockpitSection) => {
    if (window.confirm(`Are you sure you want to delete "${section.display_name}"? This action cannot be undone.`)) {
      try {
        await deleteSection.mutateAsync(section.id);
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  };

  const startCreate = () => {
    resetForm();
    setShowCreateForm(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sections for {cockpit.display_name}</CardTitle>
          <Button size="sm" onClick={startCreate} disabled={editingSection !== null}>
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Create Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Create New Section</CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
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
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Edit Form */}
          {editingSection && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Edit Section: {editingSection.display_name}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <Input
                      value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                      placeholder="e.g., Performance Metrics"
                      required
                    />
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
                    <Button type="submit">Update Section</Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Sections List */}
          {sections.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No sections created yet.</p>
              <p className="text-sm text-gray-400">
                Create sections to organize your cockpit metrics.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sections
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((section) => (
                  <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{section.display_name}</h4>
                      <p className="text-sm text-gray-500">{section.description || 'No description'}</p>
                      <div className="mt-1 text-xs text-gray-400">
                        ID: {section.name} | Sort Order: {section.sort_order}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(section)}
                        disabled={showCreateForm || editingSection !== null}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(section)}
                        className="text-red-600 hover:text-red-700"
                        disabled={showCreateForm || editingSection !== null}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionManagement;
