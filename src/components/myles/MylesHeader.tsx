
import React from "react";
import { Brain } from "lucide-react";

const MylesHeader = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="mb-3 rounded-full p-3 bg-indigo-100 shadow-md">
        <Brain className="h-10 w-10 text-indigo-600" />
      </div>
      <h1 className="text-3xl font-bold text-center mb-2">Myles - AI Analyst</h1>
      <p className="text-lg text-gray-600 max-w-3xl text-center">
        Your AI-powered business analyst for data-driven insights and strategic recommendations
      </p>
    </div>
  );
};

export default MylesHeader;
