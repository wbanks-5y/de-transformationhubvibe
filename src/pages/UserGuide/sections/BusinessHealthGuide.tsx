
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Target, GitBranch, Shield, BarChart3, Calendar, Info } from 'lucide-react';

const BusinessHealthGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Business Health & Strategy</h1>
        <p className="text-gray-600">Strategic planning, performance tracking, and business health monitoring tools.</p>
        <Badge className="mt-2">Enterprise Tier</Badge>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Business Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Business Health provides comprehensive strategic planning and performance monitoring capabilities. 
            Track objectives, manage initiatives, assess risks, and plan scenarios to ensure your business stays on track.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Strategic Capabilities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Strategic objectives management
                </li>
                <li className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-green-500" />
                  Initiative tracking and dependencies
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-500" />
                  Risk assessment and mitigation
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  Performance heatmaps
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Available Tools</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Strategy Dashboard</Badge>
                <Badge variant="outline">Strategy Map</Badge>
                <Badge variant="outline">Initiative Tracker</Badge>
                <Badge variant="outline">Scenario Planning</Badge>
                <Badge variant="outline">Risk Matrix</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Strategy Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Get a comprehensive overview of your strategic performance and business health status.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Key Components</h4>
              <ul className="text-sm space-y-2">
                <li>• <strong>Health Score Overview:</strong> Overall business health rating</li>
                <li>• <strong>Objective Progress:</strong> Strategic objectives status</li>
                <li>• <strong>Initiative Status:</strong> Active initiative progress</li>
                <li>• <strong>Risk Summary:</strong> High-priority risks and opportunities</li>
                <li>• <strong>Performance Trends:</strong> Historical performance data</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Interactive Features</h4>
              <ul className="text-sm space-y-2">
                <li>• <strong>Drill-down Analysis:</strong> Click metrics for details</li>
                <li>• <strong>Time Period Selection:</strong> Choose analysis timeframes</li>
                <li>• <strong>Filter by Perspective:</strong> Financial, Customer, Internal, Learning</li>
                <li>• <strong>Export Capabilities:</strong> Generate reports and presentations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Map */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy Map Visualization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Visualize your strategic objectives and their relationships in an interactive heatmap format.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Balanced Scorecard Perspectives</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="font-medium text-blue-800">Financial</div>
                  <div className="text-blue-600">Revenue, Profit, Cost</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="font-medium text-green-800">Customer</div>
                  <div className="text-green-600">Satisfaction, Retention</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="font-medium text-purple-800">Internal</div>
                  <div className="text-purple-600">Process, Quality</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded">
                  <div className="font-medium text-orange-800">Learning</div>
                  <div className="text-orange-600">Innovation, Growth</div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Health Status Indicators</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span><strong>Green:</strong> On track (80-100%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span><strong>Yellow:</strong> At risk (60-79%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span><strong>Red:</strong> Behind target (&lt;60%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span><strong>Gray:</strong> No data</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Initiative Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Initiative Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Manage strategic initiatives, track progress, and understand dependencies between projects.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Initiative Management</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Core Information</h5>
                  <ul className="space-y-1">
                    <li>• Initiative name and description</li>
                    <li>• Owner and team assignments</li>
                    <li>• Start and target completion dates</li>
                    <li>• Budget allocation and utilization</li>
                    <li>• Priority and risk level</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Progress Tracking</h5>
                  <ul className="space-y-1">
                    <li>• Completion percentage</li>
                    <li>• Milestone achievements</li>
                    <li>• Resource consumption</li>
                    <li>• Status updates and notes</li>
                    <li>• Success criteria evaluation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Initiative Dependencies</h4>
              <p className="text-sm text-gray-600 mb-3">
                Understand how initiatives depend on each other and manage project sequencing.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Finish-to-Start</span>
                  <Badge variant="outline">Initiative B starts when A finishes</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Start-to-Start</span>
                  <Badge variant="outline">Initiatives start simultaneously</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Finish-to-Finish</span>
                  <Badge variant="outline">Initiatives finish together</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scenario Planning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Model different business scenarios and understand potential outcomes under various conditions.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Scenario Types</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="font-medium text-green-800">Optimistic</div>
                  <div className="text-green-600">Best-case outcomes</div>
                  <Badge variant="outline" className="mt-2">High growth</Badge>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="font-medium text-blue-800">Baseline</div>
                  <div className="text-blue-600">Expected outcomes</div>
                  <Badge variant="outline" className="mt-2">Normal growth</Badge>
                </div>
                <div className="text-center p-3 bg-red-50 rounded">
                  <div className="font-medium text-red-800">Pessimistic</div>
                  <div className="text-red-600">Worst-case outcomes</div>
                  <Badge variant="outline" className="mt-2">Challenges</Badge>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Scenario Parameters</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium">External Factors</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Market conditions</li>
                    <li>• Economic indicators</li>
                    <li>• Competitive landscape</li>
                    <li>• Regulatory changes</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Internal Variables</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Resource allocation</li>
                    <li>• Operational capacity</li>
                    <li>• Investment levels</li>
                    <li>• Strategic priorities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Assessment Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Identify, assess, and manage risks and opportunities that could impact your strategic objectives.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Risk Matrix</h4>
              <p className="text-sm text-gray-600 mb-3">
                Risks are plotted based on probability and impact to prioritize attention and resources.
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div></div>
                <div className="text-center font-medium">Low Impact</div>
                <div className="text-center font-medium">High Impact</div>
                <div className="font-medium">High Prob</div>
                <div className="bg-yellow-100 p-2 text-center rounded">Medium Risk</div>
                <div className="bg-red-100 p-2 text-center rounded">High Risk</div>
                <div className="font-medium">Low Prob</div>
                <div className="bg-green-100 p-2 text-center rounded">Low Risk</div>
                <div className="bg-yellow-100 p-2 text-center rounded">Medium Risk</div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Risk Categories</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-red-600">Risks</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Operational disruptions</li>
                    <li>• Market downturns</li>
                    <li>• Resource constraints</li>
                    <li>• Competitive threats</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-600">Opportunities</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Market expansion</li>
                    <li>• Technology adoption</li>
                    <li>• Partnership potential</li>
                    <li>• Efficiency improvements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with Business Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Define Strategic Objectives</h4>
                <p className="text-sm text-gray-600">
                  Start by setting up your strategic objectives using the Balanced Scorecard framework.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Create Strategic Initiatives</h4>
                <p className="text-sm text-gray-600">
                  Add initiatives that support your objectives and establish dependencies between them.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Assess Risks and Opportunities</h4>
                <p className="text-sm text-gray-600">
                  Identify potential risks and opportunities that could affect your strategic success.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Monitor and Review</h4>
                <p className="text-sm text-gray-600">
                  Regularly update progress, review performance, and adjust strategies as needed.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Strategic Tip:</strong> Business Health works best when objectives are SMART (Specific, Measurable, 
          Achievable, Relevant, Time-bound) and regularly reviewed with your leadership team.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default BusinessHealthGuide;
