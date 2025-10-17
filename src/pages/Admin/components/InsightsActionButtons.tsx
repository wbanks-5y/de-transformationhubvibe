
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Loader2 } from "lucide-react";

interface InsightsActionButtonsProps {
  onCreateClick: () => void;
  onGenerateAI: () => void;
  isGeneratingAI: boolean;
}

const InsightsActionButtons: React.FC<InsightsActionButtonsProps> = ({
  onCreateClick,
  onGenerateAI,
  isGeneratingAI
}) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onCreateClick}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Create Insight
      </Button>
      <Button
        onClick={onGenerateAI}
        disabled={isGeneratingAI}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isGeneratingAI ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Zap className="h-4 w-4" />
        )}
        Generate AI Insights
      </Button>
    </div>
  );
};

export default InsightsActionButtons;
