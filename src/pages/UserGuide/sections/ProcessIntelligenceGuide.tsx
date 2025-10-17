
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, GitBranch, AlertTriangle, Target, TrendingUp, Clock, Info } from 'lucide-react';

const ProcessIntelligenceGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Process Intelligence</h1>
        <p className="text-gray-600">Analyze, optimize, and improve your business processes with advanced analytics.</p>
        <Badge className="mt-2">Professional Tier+</Badge>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Process Intelligence Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Process Intelligence provides deep insights into your business processes, helping you identify bottlenecks, 
            inefficiencies, and optimization opportunities through data-driven analysis.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Core Capabilities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-blue-500" />
                  Process visualization and mapping
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Bottleneck identification
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  Duration analysis
                </li>
                <li className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  Optimization recommendations
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Analysis Types</h4>
              <div className="space-y-2">
                <Badge variant="outline">Process Discovery</Badge>
                <Badge variant="outline">Bottleneck Analysis</Badge>
                <Badge variant="outline">Variant Analysis</Badge>
                <Badge variant="outline">Performance Tracking</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Discovery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Process Discovery & Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Understand how your processes actually work with visual process maps and flow diagrams.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Process Flow Visualization</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium">Visual Elements</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Process steps with icons and names</li>
                    <li>• Flow arrows showing sequence</li>
                    <li>• Department/role assignments</li>
                    <li>• Step duration indicators</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Interactive Features</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Click steps for detailed information</li>
                    <li>• Hover for quick statistics</li>
                    <li>• Zoom and pan for complex processes</li>
                    <li>• Export process maps</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Process Statistics</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h5 className="font-medium">Duration Metrics</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Average process duration</li>
                    <li>• Step-by-step timing</li>
                    <li>• Wait time analysis</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Frequency Data</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Execution frequency</li>
                    <li>• Peak usage times</li>
                    <li>• Volume trends</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Quality Metrics</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Automation rate</li>
                    <li>• Error rate</li>
                    <li>• Success rate</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottleneck Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Bottleneck Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Identify process steps that slow down overall performance and create delays.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Bottleneck Identification</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>High Impact Bottlenecks</span>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Medium Impact Issues</span>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Low Impact Delays</span>
                  <Badge variant="outline">Low</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Bottlenecks are ranked by their impact on overall process performance.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Analysis Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Wait Time (hours)</span>
                  <span className="font-medium">Quantifies delays</span>
                </div>
                <div className="flex justify-between">
                  <span>Resource Utilization</span>
                  <span className="font-medium">Capacity usage</span>
                </div>
                <div className="flex justify-between">
                  <span>Queue Length</span>
                  <span className="font-medium">Backlog size</span>
                </div>
                <div className="flex justify-between">
                  <span>Throughput Impact</span>
                  <span className="font-medium">Process velocity</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Process Variants Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Understand different ways your processes are executed and identify the most efficient paths.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Variant Discovery</h4>
              <p className="text-sm text-gray-600 mb-3">
                Process variants represent different execution paths for the same business process.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium">Standard Variants</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Most common execution path</li>
                    <li>• Highest frequency percentage</li>
                    <li>• Baseline for comparison</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Exception Variants</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Alternative execution paths</li>
                    <li>• Special case handling</li>
                    <li>• Performance variations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Variant Comparison</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Variant A (Standard)</span>
                  <div className="flex gap-2">
                    <Badge variant="outline">85% frequency</Badge>
                    <Badge variant="outline">3.2 days avg</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Variant B (Express)</span>
                  <div className="flex gap-2">
                    <Badge variant="outline">10% frequency</Badge>
                    <Badge variant="outline">1.5 days avg</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Variant C (Complex)</span>
                  <div className="flex gap-2">
                    <Badge variant="outline">5% frequency</Badge>
                    <Badge variant="outline">5.8 days avg</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Get actionable recommendations to improve process performance and efficiency.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800">High Impact Recommendations</h4>
                  <p className="text-sm text-green-700 mt-1">Changes that can significantly improve process performance</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Automate manual steps</span>
                      <Badge variant="outline" className="border-green-300">-40% duration</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Parallel processing</span>
                      <Badge variant="outline" className="border-green-300">-25% duration</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800">Medium Impact Recommendations</h4>
                  <p className="text-sm text-blue-700 mt-1">Moderate improvements with reasonable effort</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Resource reallocation</span>
                      <Badge variant="outline" className="border-blue-300">-15% wait time</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Training improvements</span>
                      <Badge variant="outline" className="border-blue-300">-10% error rate</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Process Intelligence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Select a Process</h4>
                <p className="text-sm text-gray-600">
                  Choose from available business processes or upload your own process data.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Explore Process Discovery</h4>
                <p className="text-sm text-gray-600">
                  Review the visual process map, understand the flow, and examine process statistics.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Analyze Bottlenecks</h4>
                <p className="text-sm text-gray-600">
                  Identify performance issues and understand their impact on overall process efficiency.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Review Recommendations</h4>
                <p className="text-sm text-gray-600">
                  Examine optimization suggestions and plan implementation based on impact and complexity.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Best Practice:</strong> Start by analyzing your most critical business processes first. 
          Focus on high-impact bottlenecks that can provide immediate efficiency gains.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ProcessIntelligenceGuide;
