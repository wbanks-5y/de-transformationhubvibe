
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Edit, Trash2, TrendingUp, TrendingDown, Minus, Database } from "lucide-react";
import { CockpitKPI } from "@/types/cockpit";

interface KPIManagementCardProps {
  kpi: CockpitKPI;
  onEdit: (kpi: CockpitKPI) => void;
  onDelete: (id: string) => void;
  onManageData: (kpi: CockpitKPI) => void;
}

const KPIManagementCard: React.FC<KPIManagementCardProps> = ({ 
  kpi, 
  onEdit,
  onDelete,
  onManageData
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getTrendIcon = () => {
    switch (kpi.trend_direction) {
      case 'higher_is_better':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'lower_is_better':
        return <TrendingDown className="h-4 w-4 text-blue-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleDelete = () => {
    onDelete(kpi.id);
    setShowDeleteDialog(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            {kpi.display_name}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={kpi.is_active ? "default" : "secondary"}>
              {kpi.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>{kpi.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Data Type Information */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Data Type:</span>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              {kpi.kpi_data_type === 'single' ? 'Single Value' : 'Time-based'}
            </Badge>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Format:</span>
            <span className="capitalize">{kpi.format_type}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Trend Direction:</span>
            <span className="capitalize">{kpi.trend_direction.replace('_', ' ')}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Weight:</span>
            <span>{kpi.weight || 1.0}</span>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(kpi)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onManageData(kpi)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Database className="h-4 w-4 mr-1" />
              Manage Data
            </Button>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete KPI</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{kpi.display_name}"? This action cannot be undone.
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
      </CardContent>
    </Card>
  );
};

export default KPIManagementCard;
