
import React from "react";
import StrategyMap from "./StrategyMap";
import BackButton from "@/components/ui/back-button";
import { useScrollTop } from "@/hooks/useScrollTop";

const StrategyMapStandalone: React.FC = () => {
  useScrollTop();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4">
        <BackButton />
        <h1 className="text-3xl font-bold mb-2">Strategy Map</h1>
        <p className="text-gray-600 mb-6">
          Visualizing our corporate strategy and performance across perspectives
        </p>
        <StrategyMap />
      </div>
    </div>
  );
};

export default StrategyMapStandalone;
