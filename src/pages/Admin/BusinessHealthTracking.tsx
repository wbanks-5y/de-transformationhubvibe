import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Info } from "lucide-react";
import BackButton from "@/components/ui/back-button";
import ObjectiveHealthTrackingAdmin from "./components/ObjectiveHealthTrackingAdmin";

const BusinessHealthTracking: React.FC = () => {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <BackButton />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-500">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Business Health Tracking</h1>
        </div>
        <p className="text-gray-500">
          Monitor and track health scores and performance status for your strategic objectives across different time periods.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Health Scoring System
          </CardTitle>
          <CardDescription>
            Understand how health scores and RAG (Red, Amber, Green) status work together to provide comprehensive performance insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Health Score Ranges</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-sm"><strong>80-100:</strong> Excellent performance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-sm"><strong>60-79:</strong> Good performance, minor concerns</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-sm"><strong>0-59:</strong> Poor performance, urgent attention needed</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Time Periods</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Current:</strong> Overall current performance assessment</p>
                <p><strong>Q1-Q4:</strong> Quarterly performance tracking</p>
                <p><strong>Year:</strong> Specify the year for historical tracking</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ObjectiveHealthTrackingAdmin />
    </div>
  );
};

export default BusinessHealthTracking;