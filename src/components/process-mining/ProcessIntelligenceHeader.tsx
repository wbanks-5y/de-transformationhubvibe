
import React from "react";
import { Workflow } from "lucide-react";

const ProcessIntelligenceHeader = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="mb-3 rounded-full p-3 bg-indigo-100 shadow-sm">
        <Workflow className="h-10 w-10 text-indigo-600" />
      </div>
      <h1 className="text-3xl font-bold text-center mb-2">Business Process Intelligence</h1>
      <p className="text-lg text-gray-600 max-w-3xl text-center">
        Discover, analyze, and optimize your business processes through data-driven insights
      </p>
    </div>
  );
};

export default ProcessIntelligenceHeader;
