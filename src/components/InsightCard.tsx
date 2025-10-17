
import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  metric: string;
  trend: "up" | "down" | "neutral";
  onClick?: () => void;
  id?: string;
}

const InsightCard = ({
  title,
  description,
  icon,
  metric,
  trend,
  onClick,
  id
}: InsightCardProps) => {
  const getBgColor = () => {
    switch (trend) {
      case "up":
        return "bg-green-500";
      case "down":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-blue-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const isClickable = !!onClick;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
        isClickable ? "cursor-pointer hover:shadow-md transform hover:-translate-y-1" : ""
      }`}
      onClick={handleClick}
      data-id={id}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`${getBgColor()} p-2 rounded-full`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">{title}</h3>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-bold">{metric}</span>
          {getTrendIcon()}
        </div>
      </div>
      
      {isClickable && (
        <div className="mt-3 flex justify-end">
          <span className="text-xs text-amber-600 font-medium flex items-center">
            View Details
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </span>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
