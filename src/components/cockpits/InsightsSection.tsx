
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lightbulb, AlertTriangle, Target, Zap } from "lucide-react";
import { CockpitInsight } from "@/types/cockpit";

interface InsightsSectionProps {
  insights: CockpitInsight[];
  cockpitDisplayName: string;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ insights, cockpitDisplayName }) => {
  const [selectedInsight, setSelectedInsight] = useState<CockpitInsight | null>(null);

  console.log('InsightsSection render:', {
    insightsCount: insights.length,
    insights: insights,
    cockpitDisplayName
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'negative':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'neutral':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <Zap className="h-4 w-4 text-orange-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTextColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-800';
      case 'medium':
        return 'text-yellow-800';
      case 'low':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  // Filter for active insights only (is_active === true or null/undefined)
  const activeInsights = insights.filter(insight => insight.is_active === true || insight.is_active == null);

  console.log('Active insights filtered:', {
    totalInsights: insights.length,
    activeInsights: activeInsights.length,
    filteredInsights: activeInsights
  });

  if (activeInsights.length === 0) {
    console.log('No active insights to display');
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">AI {cockpitDisplayName} Insights</h2>
        <div className="text-center py-8 text-gray-500">
          <Lightbulb className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>No insights available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">AI {cockpitDisplayName} Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
          {activeInsights.map((insight) => (
            <div 
              key={insight.id} 
              className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getPriorityColor(insight.priority)}`}
              onClick={() => setSelectedInsight(insight)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getInsightIcon(insight.insight_type)}
                  <h3 className={`font-semibold text-xs ${getTextColor(insight.priority)} truncate`}>
                    {insight.title}
                  </h3>
                </div>
                <Badge className={`${getPriorityColor(insight.priority)} text-xs px-2 py-0 flex-shrink-0 ml-2`}>
                  {insight.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight Detail Modal */}
      <Dialog open={!!selectedInsight} onOpenChange={() => setSelectedInsight(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedInsight && getInsightIcon(selectedInsight.insight_type)}
              {selectedInsight?.title}
              {selectedInsight && (
                <Badge className={getPriorityColor(selectedInsight.priority)}>
                  {selectedInsight.priority}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Insight Type: {selectedInsight?.insight_type}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInsight && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700">{selectedInsight.description}</p>
              </div>
              
              {selectedInsight.confidence_score && (
                <div>
                  <h4 className="font-semibold mb-2">Confidence Score</h4>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 rounded-full h-2 flex-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedInsight.confidence_score * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(selectedInsight.confidence_score * 100)}%
                    </span>
                  </div>
                </div>
              )}
              
              {selectedInsight.generated_at && (
                <div>
                  <h4 className="font-semibold mb-2">Generated</h4>
                  <p className="text-gray-600 text-sm">
                    {new Date(selectedInsight.generated_at).toLocaleString()}
                  </p>
                </div>
              )}
              
              {selectedInsight.insight_data?.generated_by && (
                <div>
                  <h4 className="font-semibold mb-2">Source</h4>
                  <p className="text-gray-600 text-sm">
                    Generated by {selectedInsight.insight_data.generated_by}
                    {selectedInsight.insight_data.model && ` (${selectedInsight.insight_data.model})`}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InsightsSection;
