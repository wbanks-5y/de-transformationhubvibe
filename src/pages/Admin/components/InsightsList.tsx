
import React from "react";
import { AlertTriangle } from "lucide-react";
import { CockpitInsight } from "@/types/cockpit";
import InsightCard from "./InsightCard";

interface InsightsListProps {
  insights?: CockpitInsight[];
  onEdit: (insight: CockpitInsight) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const InsightsList: React.FC<InsightsListProps> = ({
  insights,
  onEdit,
  onDelete,
  isDeleting
}) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No insights configured</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create insights manually or generate them using AI to provide valuable business intelligence.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default InsightsList;
