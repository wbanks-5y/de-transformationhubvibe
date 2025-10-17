
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBusinessProcesses } from "@/hooks/useBusinessProcesses";
import { useProcessOptimizationMetrics, useProcessRecommendations } from "@/hooks/useProcessOptimization";

interface ProcessOptimizationProps {
  selectedProcess: string;
}

const ProcessOptimization: React.FC<ProcessOptimizationProps> = ({ selectedProcess }) => {
  const { data: processes = [] } = useBusinessProcesses();
  const currentProcess = processes.find(p => p.name === selectedProcess);
  const processId = currentProcess?.id || "";

  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useProcessOptimizationMetrics(processId);
  const { data: recommendations = [], isLoading: recommendationsLoading, error: recommendationsError } = useProcessRecommendations(processId);

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

  if (metricsLoading || recommendationsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading optimization data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (metricsError || recommendationsError) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            Error loading optimization data. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Process Optimization: {currentProcess.display_name}</h2>
        <p className="text-gray-600">Recommendations to improve process efficiency and outcomes</p>
      </div>
      
      {metrics && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Potential Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{metrics.potential_savings}</div>
              <p className="text-sm text-gray-500">Estimated annual savings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Time Reduction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{metrics.time_reduction}</div>
              <p className="text-sm text-gray-500">Average process time reduction</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quality Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-purple-600">{metrics.quality_improvement}</div>
                <ArrowRight className="h-4 w-4 text-purple-600 mx-2" />
                <div className="text-3xl font-bold text-purple-600">99.8%</div>
              </div>
              <p className="text-sm text-gray-500">Error rate improvement</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <h3 className="text-xl font-semibold mt-8">Optimization Recommendations</h3>
      
      {recommendations.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{recommendation.title}</CardTitle>
                    <CardDescription className="mt-1">{recommendation.description}</CardDescription>
                  </div>
                  <Badge variant={recommendation.impact_level === "High" ? "default" : "outline"}>
                    {recommendation.impact_level} Impact
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span>Implementation Complexity</span>
                      <span className="font-medium">{recommendation.complexity_level}</span>
                    </div>
                    <Progress value={recommendation.complexity_level === "Low" ? 33 : 
                                recommendation.complexity_level === "Medium" ? 66 : 100} 
                            className={recommendation.complexity_level === "Low" ? "bg-green-100" :
                                      recommendation.complexity_level === "Medium" ? "bg-amber-100" : "bg-red-100"} />
                  </div>
                  
                  {recommendation.benefits.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <div className="text-sm font-medium">Expected Benefits:</div>
                      <ul className="space-y-1">
                        {recommendation.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {recommendation.risks.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <div className="text-sm font-medium">Risks to Consider:</div>
                      <ul className="space-y-1">
                        {recommendation.risks.map((risk, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 pt-0">
                <Button variant="outline">Details</Button>
                <Button>Implement</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No optimization recommendations available
        </div>
      )}
    </div>
  );
};

export default ProcessOptimization;
