
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { CockpitInsight } from "@/types/cockpit";

interface InsightCardProps {
  insight: CockpitInsight;
  onEdit: (insight: CockpitInsight) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  onEdit,
  onDelete,
  isDeleting
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-blue-100 text-blue-800';
      case 'risk': return 'bg-red-100 text-red-800';
      case 'optimization': return 'bg-purple-100 text-purple-800';
      case 'alert': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{insight.title}</h3>
              <Badge className={getPriorityColor(insight.priority)}>
                {insight.priority}
              </Badge>
              <Badge className={getTypeColor(insight.insight_type)}>
                {insight.insight_type}
              </Badge>
              {!insight.is_active && (
                <Badge variant="outline">Inactive</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
            <p className="text-xs text-gray-400">
              Created: {new Date(insight.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(insight)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(insight.id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
