
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBusinessProcesses, useProcessSteps, useProcessVariants, useProcessStatistics } from "@/hooks/useBusinessProcesses";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getIconByName } from "@/utils/iconUtils";

interface ProcessVisualizerProps {
  selectedProcess: string;
  onProcessChange: (processId: string) => void;
}

const ProcessVisualizer: React.FC<ProcessVisualizerProps> = ({ 
  selectedProcess
}) => {
  const { data: processes = [] } = useBusinessProcesses();
  const { data: steps = [], isLoading: stepsLoading, error: stepsError } = useProcessSteps(
    processes.find(p => p.name === selectedProcess)?.id || ""
  );
  const { data: variants = [], isLoading: variantsLoading } = useProcessVariants(
    processes.find(p => p.name === selectedProcess)?.id || ""
  );
  const { data: statistics, isLoading: statsLoading } = useProcessStatistics(
    processes.find(p => p.name === selectedProcess)?.id || ""
  );

  const currentProcess = processes.find(p => p.name === selectedProcess);

  if (!currentProcess) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            Process not found. Please select a valid process.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (stepsLoading || variantsLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading process data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (stepsError) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            Error loading process data: {stepsError.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Process Discovery</h2>
        <p className="text-gray-600">Visualize and understand your business processes</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentProcess.display_name}
            <Badge variant="outline" className="ml-2">{steps.length} steps</Badge>
          </CardTitle>
          <CardDescription>Showing the standard process flow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex items-start gap-2 pb-4 min-w-max">
              {steps.map((step, index) => {
                // Get the appropriate icon component
                const IconComponent = step.icon_name ? getIconByName(step.icon_name) : FileText;
                
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      <div className={`p-3 rounded-lg ${step.color_class} border mb-2`}>
                        <div className="h-20 w-20 flex items-center justify-center flex-col">
                          <IconComponent className="h-6 w-6 mb-2 text-gray-700" />
                          <div className="text-xs font-medium text-center">
                            {step.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {step.department}
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className="flex items-center pt-10">
                        <ArrowRight className="h-5 w-5 text-gray-400 mx-1" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          
          <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h4 className="font-medium mb-2">Process Description</h4>
            <p className="text-sm text-gray-600">{currentProcess.description}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Process Statistics</CardTitle>
            <CardDescription>Key metrics for this process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statistics ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Duration</span>
                  <span className="font-bold">{statistics.avg_duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Execution Frequency</span>
                  <span className="font-bold">{statistics.frequency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Automation Rate</span>
                  <span className="font-bold">{statistics.automation_rate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Error Rate</span>
                  <span className="font-bold">{statistics.error_rate}%</span>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                No statistics available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Process Variants</CardTitle>
            <CardDescription>Common deviations from the standard process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {variants.length > 0 ? (
                variants.map((variant) => (
                  <div key={variant.id} className="flex justify-between items-center pb-2 border-b last:border-b-0">
                    <div>
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-xs text-gray-500">{variant.description}</div>
                    </div>
                    <Badge variant={variant.frequency_percentage > 15 ? "destructive" : "outline"}>
                      {variant.frequency_percentage}%
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No variants defined
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProcessVisualizer;
