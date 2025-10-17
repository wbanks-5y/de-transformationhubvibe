
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Lightbulb } from "lucide-react";
import ProcessOptimizationMetricsAdmin from "./Optimization/ProcessOptimizationMetricsAdmin";
import ProcessRecommendationsAdmin from "./Optimization/ProcessRecommendationsAdmin";

interface ProcessOptimizationAdminProps {
  selectedProcessId?: string;
}

const ProcessOptimizationAdmin: React.FC<ProcessOptimizationAdminProps> = ({ selectedProcessId }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Process Optimization Management
          </CardTitle>
          <CardDescription>
            Manage optimization metrics and recommendations for business processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metrics" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Optimization Metrics
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics">
              <ProcessOptimizationMetricsAdmin selectedProcessId={selectedProcessId || ""} />
            </TabsContent>

            <TabsContent value="recommendations">
              <ProcessRecommendationsAdmin selectedProcessId={selectedProcessId || ""} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessOptimizationAdmin;
