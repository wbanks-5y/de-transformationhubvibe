
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, AlertTriangle, Zap } from "lucide-react";
import ProcessStepDurationsAdmin from "./Analysis/ProcessStepDurationsAdmin";
import ProcessBottlenecksAdmin from "./Analysis/ProcessBottlenecksAdmin";
import ProcessInefficienciesAdmin from "./Analysis/ProcessInefficienciesAdmin";

interface ProcessAnalysisAdminProps {
  selectedProcessId?: string;
}

const ProcessAnalysisAdmin: React.FC<ProcessAnalysisAdminProps> = ({ selectedProcessId }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Process Analysis Data Management
          </CardTitle>
          <CardDescription>
            Manage step durations, bottlenecks, and inefficiencies across all processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="durations" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="durations" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Step Durations
              </TabsTrigger>
              <TabsTrigger value="bottlenecks" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Bottlenecks
              </TabsTrigger>
              <TabsTrigger value="inefficiencies" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Inefficiencies
              </TabsTrigger>
            </TabsList>

            <TabsContent value="durations">
              <ProcessStepDurationsAdmin selectedProcessId={selectedProcessId || ""} />
            </TabsContent>

            <TabsContent value="bottlenecks">
              <ProcessBottlenecksAdmin selectedProcessId={selectedProcessId || ""} />
            </TabsContent>

            <TabsContent value="inefficiencies">
              <ProcessInefficienciesAdmin selectedProcessId={selectedProcessId || ""} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessAnalysisAdmin;
