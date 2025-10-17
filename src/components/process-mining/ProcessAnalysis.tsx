
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useBusinessProcesses } from "@/hooks/useBusinessProcesses";
import { useProcessStepDurations, useProcessBottlenecks, useProcessInefficiencies } from "@/hooks/useProcessAnalysis";

interface ProcessAnalysisProps {
  selectedProcess: string;
}

const ProcessAnalysis: React.FC<ProcessAnalysisProps> = ({ selectedProcess }) => {
  const { data: processes = [] } = useBusinessProcesses();
  const currentProcess = processes.find(p => p.name === selectedProcess);
  const processId = currentProcess?.id || "";

  const { data: stepDurations = [], isLoading: durationsLoading, error: durationsError } = useProcessStepDurations(processId);
  const { data: bottlenecks = [], isLoading: bottlenecksLoading, error: bottlenecksError } = useProcessBottlenecks(processId);
  const { data: inefficiencies = [], isLoading: inefficienciesLoading, error: inefficienciesError } = useProcessInefficiencies(processId);

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

  if (durationsLoading || bottlenecksLoading || inefficienciesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading analysis data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (durationsError || bottlenecksError || inefficienciesError) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            Error loading analysis data. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Transform step durations for chart
  const chartData = stepDurations.map(duration => ({
    name: duration.step_name,
    duration: duration.duration_hours
  }));
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Process Analysis: {currentProcess.display_name}</h2>
        <p className="text-gray-600">Analyzing bottlenecks, inefficiencies, and opportunities for improvement</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step Duration Analysis</CardTitle>
            <CardDescription>Average processing time per step (in hours)</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="duration" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No step duration data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bottleneck Analysis</CardTitle>
            <CardDescription>Identifying steps that slow down the process</CardDescription>
          </CardHeader>
          <CardContent>
            {bottlenecks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Process Step</TableHead>
                    <TableHead>Wait Time (h)</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bottlenecks.map((bottleneck) => (
                    <TableRow key={bottleneck.id}>
                      <TableCell>{bottleneck.step_name}</TableCell>
                      <TableCell>{bottleneck.wait_time_hours}</TableCell>
                      <TableCell>
                        <Badge variant={bottleneck.impact_level === "High" ? "destructive" : 
                                       bottleneck.impact_level === "Medium" ? "secondary" : "outline"}>
                          {bottleneck.impact_level}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No bottlenecks identified
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Process Inefficiencies</CardTitle>
            <CardDescription>Issues identified in the current process</CardDescription>
          </CardHeader>
          <CardContent>
            {inefficiencies.length > 0 ? (
              <div className="space-y-4">
                {inefficiencies.map((item) => (
                  <div key={item.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{item.title}</h4>
                      <Badge variant={item.severity_level === "Critical" ? "destructive" : 
                                    item.severity_level === "Major" ? "secondary" : "outline"}>
                        {item.severity_level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Affected Steps:</span> {item.affected_steps.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No inefficiencies identified
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProcessAnalysis;
