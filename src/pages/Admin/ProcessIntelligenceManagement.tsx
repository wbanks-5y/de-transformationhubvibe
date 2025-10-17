
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, GitBranch, Settings, BarChart3, TrendingUp, AlertTriangle, Clock, Zap, Target, ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useBusinessProcesses } from "@/hooks/useBusinessProcesses";
import BusinessProcessesAdmin from "./components/ProcessIntelligence/BusinessProcessesAdmin";
import ProcessStepsAdmin from "./components/ProcessIntelligence/ProcessStepsAdmin";
import ProcessVariantsAdmin from "./components/ProcessIntelligence/ProcessVariantsAdmin";
import ProcessStatisticsAdmin from "./components/ProcessIntelligence/ProcessStatisticsAdmin";
import ProcessAnalysisAdmin from "./components/ProcessIntelligence/ProcessAnalysisAdmin";
import ProcessOptimizationAdmin from "./components/ProcessIntelligence/ProcessOptimizationAdmin";

const ProcessIntelligenceManagement: React.FC = () => {
  const [selectedProcessId, setSelectedProcessId] = useState<string>("");
  const { data: processes = [] } = useBusinessProcesses();

  const selectedProcess = processes.find(p => p.id === selectedProcessId);

  const handleBackToProcessManagement = () => {
    setSelectedProcessId("");
  };

  const handleManageProcess = (processId: string) => {
    setSelectedProcessId(processId);
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <BackButton />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <GitBranch className="h-8 w-8 text-emerald-600" />
          Process Intelligence Administration
        </h1>
        <p className="text-gray-500 mt-2">
          Complete management of business processes, analysis, and optimization data
        </p>
      </div>

      {!selectedProcessId ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Process Management
            </CardTitle>
            <CardDescription>
              Create and manage business processes, or select one to manage its detailed data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BusinessProcessesAdmin onManageProcess={handleManageProcess} />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Process Data Management
                </CardTitle>
                <CardDescription>
                  Managing detailed data for: <span className="font-medium">{selectedProcess?.display_name}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handleBackToProcessManagement}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Process Management
                  </Button>
                  <div className="flex-1">
                    <Select value={selectedProcessId} onValueChange={setSelectedProcessId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a process to manage its data" />
                      </SelectTrigger>
                      <SelectContent>
                        {processes.map((process) => (
                          <SelectItem key={process.id} value={process.id}>
                            {process.display_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="discovery" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="discovery" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Process Discovery
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Process Analysis
              </TabsTrigger>
              <TabsTrigger value="optimization" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Process Optimization
              </TabsTrigger>
            </TabsList>

            {/* Process Discovery Tab */}
            <TabsContent value="discovery">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Process Discovery & Structure
                    </CardTitle>
                    <CardDescription>
                      Manage the structure and components of {selectedProcess?.display_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="steps" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="steps" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Process Steps
                        </TabsTrigger>
                        <TabsTrigger value="variants" className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4" />
                          Process Variants
                        </TabsTrigger>
                        <TabsTrigger value="statistics" className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Basic Statistics
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="steps">
                        <ProcessStepsAdmin selectedProcessId={selectedProcessId} />
                      </TabsContent>

                      <TabsContent value="variants">
                        <ProcessVariantsAdmin selectedProcessId={selectedProcessId} />
                      </TabsContent>

                      <TabsContent value="statistics">
                        <ProcessStatisticsAdmin selectedProcessId={selectedProcessId} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Process Analysis Tab */}
            <TabsContent value="analysis">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Process Analysis & Performance
                    </CardTitle>
                    <CardDescription>
                      Analyze performance metrics and identify issues in {selectedProcess?.display_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProcessAnalysisAdmin selectedProcessId={selectedProcessId} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Process Optimization Tab */}
            <TabsContent value="optimization">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Process Optimization & Recommendations
                    </CardTitle>
                    <CardDescription>
                      Optimize {selectedProcess?.display_name} with improvement metrics and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProcessOptimizationAdmin selectedProcessId={selectedProcessId} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ProcessIntelligenceManagement;
