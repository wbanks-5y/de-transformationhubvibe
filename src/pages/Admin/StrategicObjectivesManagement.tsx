import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import BackButton from "@/components/ui/back-button";
import StrategicObjectivesAdmin from "./components/StrategicObjectivesAdmin";

const StrategicObjectivesManagement: React.FC = () => {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <BackButton />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Strategic Objectives Management</h1>
        </div>
        <p className="text-gray-500">
          Define and manage your organization's key strategic goals across Financial, Customer, Internal Process, and Learning & Growth perspectives.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Strategic Foundation</CardTitle>
          <CardDescription>
            Strategic objectives form the foundation of your business health tracking system. 
            These goals define what success looks like across different business perspectives 
            and serve as the basis for measuring organizational performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900">Financial</h4>
              <p className="text-blue-700 mt-1">Revenue growth, profitability, cost management</p>
            </div>
            <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
              <h4 className="font-semibold text-green-900">Customer</h4>
              <p className="text-green-700 mt-1">Satisfaction, retention, market share</p>
            </div>
            <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-500">
              <h4 className="font-semibold text-purple-900">Internal Process</h4>
              <p className="text-purple-700 mt-1">Efficiency, quality, innovation</p>
            </div>
            <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900">Learning & Growth</h4>
              <p className="text-orange-700 mt-1">Skills, culture, capabilities</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <StrategicObjectivesAdmin />
    </div>
  );
};

export default StrategicObjectivesManagement;