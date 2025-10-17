import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Info } from "lucide-react";
import BackButton from "@/components/ui/back-button";
import StrategicInitiativesAdmin from "./components/StrategicInitiativesAdmin";

const StrategicInitiativesManagement: React.FC = () => {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <BackButton />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-500">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Strategic Initiatives Management</h1>
        </div>
        <p className="text-gray-500">
          Manage specific projects and actions that drive progress toward your strategic objectives.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Initiative Management Guide
          </CardTitle>
          <CardDescription>
            Strategic initiatives are the specific projects, programs, and actions that help you achieve your strategic objectives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Status Types</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span><strong>Planning:</strong> Being designed and scoped</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span><strong>In Progress:</strong> Actively being executed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span><strong>On Hold:</strong> Temporarily paused</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span><strong>Completed:</strong> Successfully finished</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span><strong>Cancelled:</strong> Stopped before completion</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Priority Levels</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span><strong>Critical:</strong> Highest priority, immediate focus</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span><strong>High:</strong> Important, should be prioritized</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span><strong>Medium:</strong> Standard priority</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span><strong>Low:</strong> Can be done when resources allow</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StrategicInitiativesAdmin />
    </div>
  );
};

export default StrategicInitiativesManagement;