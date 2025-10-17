
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";

interface HeatmapFiltersDialogProps {
  selectedPerspectives: string[];
  selectedStatuses: string[];
  onPerspectiveChange: (perspectives: string[]) => void;
  onStatusChange: (statuses: string[]) => void;
  onClearFilters: () => void;
}

const HeatmapFiltersDialog: React.FC<HeatmapFiltersDialogProps> = ({
  selectedPerspectives,
  selectedStatuses,
  onPerspectiveChange,
  onStatusChange,
  onClearFilters
}) => {
  const [open, setOpen] = useState(false);

  const perspectives = [
    { id: 'financial', name: 'Financial', color: 'bg-green-500' },
    { id: 'customer', name: 'Customer', color: 'bg-blue-500' },
    { id: 'internal', name: 'Internal Process', color: 'bg-orange-500' },
    { id: 'learning', name: 'Learning & Growth', color: 'bg-purple-500' }
  ];

  const statuses = [
    { id: 'green', name: 'On Track', color: 'bg-green-500' },
    { id: 'amber', name: 'At Risk', color: 'bg-yellow-500' },
    { id: 'red', name: 'Off Track', color: 'bg-red-500' }
  ];

  const handlePerspectiveToggle = (perspectiveId: string) => {
    if (selectedPerspectives.includes(perspectiveId)) {
      onPerspectiveChange(selectedPerspectives.filter(id => id !== perspectiveId));
    } else {
      onPerspectiveChange([...selectedPerspectives, perspectiveId]);
    }
  };

  const handleStatusToggle = (statusId: string) => {
    if (selectedStatuses.includes(statusId)) {
      onStatusChange(selectedStatuses.filter(id => id !== statusId));
    } else {
      onStatusChange([...selectedStatuses, statusId]);
    }
  };

  const activeFiltersCount = selectedPerspectives.length + selectedStatuses.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Filter Options
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Perspective Filters */}
          <div>
            <h4 className="font-medium mb-3">Perspectives</h4>
            <div className="space-y-2">
              {perspectives.map(perspective => (
                <div key={perspective.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`perspective-${perspective.id}`}
                    checked={selectedPerspectives.includes(perspective.id)}
                    onCheckedChange={() => handlePerspectiveToggle(perspective.id)}
                  />
                  <div className={`w-3 h-3 ${perspective.color} rounded-full`}></div>
                  <label 
                    htmlFor={`perspective-${perspective.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {perspective.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <h4 className="font-medium mb-3">Health Status</h4>
            <div className="space-y-2">
              {statuses.map(status => (
                <div key={status.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.id}`}
                    checked={selectedStatuses.includes(status.id)}
                    onCheckedChange={() => handleStatusToggle(status.id)}
                  />
                  <div className={`w-3 h-3 ${status.color} rounded-full`}></div>
                  <label 
                    htmlFor={`status-${status.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {status.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeatmapFiltersDialog;
