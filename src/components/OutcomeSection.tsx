
import React from "react";
import InsightCard from "./InsightCard";

interface InsightType {
  id?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  metric: string;
  trend: "up" | "down" | "neutral";
}

interface OutcomeSectionProps {
  title: string;
  subtitle: string;
  colorClass: string;
  insights: InsightType[];
  onInsightClick?: (id: string) => void;
}

const OutcomeSection: React.FC<OutcomeSectionProps> = ({
  title,
  subtitle,
  colorClass,
  insights,
  onInsightClick,
}) => {
  return (
    <div className={`rounded-3xl p-6 ${colorClass} shadow-sm h-full flex flex-col`}>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      <div className="space-y-4 flex-grow">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            id={insight.id}
            title={insight.title}
            description={insight.description}
            icon={insight.icon}
            metric={insight.metric}
            trend={insight.trend}
            onClick={insight.id && onInsightClick ? () => onInsightClick(insight.id!) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default OutcomeSection;
