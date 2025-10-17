
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Edit, 
  Trash2, 
  BarChart3, 
  Target, 
  Lightbulb, 
  Settings,
  AlertTriangle
} from "lucide-react";
import { CockpitType } from "@/types/cockpit";
import { NavIcons } from "@/components/navigation/icons";

interface CockpitTypeCardProps {
  cockpit: CockpitType;
  onEditMetrics: (cockpit: CockpitType) => void;
  onEditKPIs: (cockpit: CockpitType) => void;
  onEditInsights: (cockpit: CockpitType) => void;
  onEditCockpit: (cockpit: CockpitType) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onDeleteCockpit: (id: string) => void;
  onManageSections: (cockpit: CockpitType) => void;
}

const CockpitTypeCard: React.FC<CockpitTypeCardProps> = ({
  cockpit,
  onEditMetrics,
  onEditKPIs,
  onEditInsights,
  onEditCockpit,
  onToggleStatus,
  onDeleteCockpit,
  onManageSections,
}) => {
  const IconComponent = NavIcons[cockpit.icon as keyof typeof NavIcons];

  const handleDelete = () => {
    console.log('Delete button clicked for cockpit:', cockpit.id);
    
    const confirmed = window.confirm(
      `⚠️ PERMANENT DELETION WARNING ⚠️\n\n` +
      `This will permanently delete "${cockpit.display_name}" and ALL related data:\n\n` +
      `• All KPIs and their historical data\n` +
      `• All KPI targets and values\n` +
      `• All sections and metrics\n` +
      `• All insights and filters\n\n` +
      `This action CANNOT be undone!\n\n` +
      `Are you absolutely sure you want to proceed?`
    );
    
    console.log('User confirmation result:', confirmed);
    
    if (confirmed) {
      console.log('Proceeding with deletion...');
      try {
        onDeleteCockpit(cockpit.id);
      } catch (error) {
        console.error('Error in handleDelete:', error);
      }
    } else {
      console.log('Deletion cancelled by user');
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div 
                className="p-2 rounded-lg"
                style={{ 
                  backgroundColor: cockpit.color_class?.startsWith('#') 
                    ? `${cockpit.color_class}20` 
                    : undefined,
                  color: cockpit.color_class?.startsWith('#') 
                    ? cockpit.color_class 
                    : undefined
                }}
              >
                <IconComponent className="h-5 w-5" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold">
                {cockpit.display_name}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {cockpit.name} • {cockpit.route_path}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={cockpit.is_active ? "default" : "secondary"}>
              {cockpit.is_active ? "Active" : "Inactive"}
            </Badge>
            <Switch
              checked={cockpit.is_active}
              onCheckedChange={(checked) => onToggleStatus(cockpit.id, checked)}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {cockpit.description && (
          <p className="text-sm text-gray-600">{cockpit.description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditMetrics(cockpit)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Metrics
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditKPIs(cockpit)}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            KPIs
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditInsights(cockpit)}
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            Insights
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManageSections(cockpit)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Sections
          </Button>
        </div>
        
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditCockpit(cockpit)}
            className="flex-1 flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <AlertTriangle className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 pt-2 border-t">
          Sort Order: {cockpit.sort_order}
        </div>
      </CardContent>
    </Card>
  );
};

export default CockpitTypeCard;
