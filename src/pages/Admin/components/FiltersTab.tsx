
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CockpitType } from "@/types/cockpit";
import { useCockpitFilters } from "@/hooks/use-cockpit-filters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FilterEditForm from "./FilterEditForm";

interface FiltersTabProps {
  cockpitTypes?: CockpitType[];
  selectedCockpit: string;
  onSelectedCockpitChange: (cockpit: string) => void;
}

const FiltersTab: React.FC<FiltersTabProps> = ({
  cockpitTypes,
  selectedCockpit,
  onSelectedCockpitChange,
}) => {
  const [editingFilter, setEditingFilter] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const selectedCockpitType = cockpitTypes?.find(c => c.name === selectedCockpit);
  const { data: filters, isLoading } = useCockpitFilters(selectedCockpitType?.id, 'time_period');

  const formatFilterConfig = (config: any) => {
    if (config.type === 'relative') {
      return `${config.label} (${config.period})`;
    }
    return config.label;
  };

  if (!selectedCockpit) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No cockpit selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a cockpit to manage its time period filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cockpit Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Time Period Filters</h2>
          <p className="text-gray-500 mt-1">
            Manage time period filters for cockpit data filtering
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedCockpit} onValueChange={onSelectedCockpitChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a cockpit" />
            </SelectTrigger>
            <SelectContent>
              {cockpitTypes?.map((cockpit) => (
                <SelectItem key={cockpit.id} value={cockpit.name}>
                  {cockpit.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Filter
          </Button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingFilter) && (
        <FilterEditForm
          filter={editingFilter}
          cockpitTypeId={selectedCockpitType?.id}
          isCreating={showCreateForm}
          onSave={() => {
            setShowCreateForm(false);
            setEditingFilter(null);
          }}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingFilter(null);
          }}
        />
      )}

      {/* Filters List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-sm text-gray-500">Loading filters...</div>
        </div>
      ) : filters && filters.length > 0 ? (
        <div className="grid gap-4">
          {filters.map((filter) => (
            <Card key={filter.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {filter.filter_config.label}
                    {filter.is_default && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingFilter(filter)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    {filter.filter_config.description}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Type: {filter.filter_config.type}</span>
                    {filter.filter_config.period && (
                      <span>Period: {filter.filter_config.period}</span>
                    )}
                    <span>Order: {filter.sort_order}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Calendar className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            No time period filters configured for this cockpit
          </p>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="mt-4"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Filter
          </Button>
        </div>
      )}
    </div>
  );
};

export default FiltersTab;
