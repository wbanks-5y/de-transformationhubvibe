
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { CockpitMetric } from "@/types/cockpit";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MetricCardProps {
  metric: CockpitMetric;
  onDelete: (metricId: string) => void;
  onEdit: (metric: CockpitMetric) => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  onDelete,
  onEdit,
}) => {
  const handleDelete = () => {
    onDelete(metric.id);
  };

  const handleEdit = () => {
    onEdit(metric);
  };

  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-1 truncate">{metric.display_name}</h4>
          {metric.description && (
            <div className="text-xs text-gray-600 line-clamp-2">{metric.description}</div>
          )}
        </div>
        
        <div className="flex gap-1 flex-shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEdit}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="h-3 w-3" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Metric</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{metric.display_name}"? This action cannot be undone and will remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
