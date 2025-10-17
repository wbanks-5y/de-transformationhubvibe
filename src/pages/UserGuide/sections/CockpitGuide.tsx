
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3, TrendingUp, Gauge, Filter, Settings, Eye, Info } from 'lucide-react';

const CockpitGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Cockpits & Dashboards</h1>
        <p className="text-gray-600">Master real-time dashboards, KPI monitoring, and data visualization features.</p>
        <Badge className="mt-2">Essential Tier+</Badge>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Cockpit Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Cockpits are real-time dashboards that provide immediate visibility into your business operations. 
            Unlike strategic dashboards that focus on long-term trends, cockpits give you current operational metrics.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Key Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Real-time KPI monitoring
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Interactive data visualization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Customizable layouts and metrics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Section-based organization
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Available Cockpit Types</h4>
              <div className="space-y-2">
                <Badge variant="outline">Sales Dashboard</Badge>
                <Badge variant="outline">Operations Monitor</Badge>
                <Badge variant="outline">Financial Cockpit</Badge>
                <Badge variant="outline">Custom Dashboards</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Setting Up Your First Cockpit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Access Cockpit Selection</h4>
                <p className="text-sm text-gray-600">
                  Navigate to "Cockpits" in the main menu or visit the Cockpit Selection page from the home dashboard.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Choose Your Cockpit Type</h4>
                <p className="text-sm text-gray-600">
                  Select from available cockpit types based on your business needs (Sales, Operations, Financial, etc.).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Configure Initial KPIs</h4>
                <p className="text-sm text-gray-600">
                  Set up your key performance indicators and connect them to your data sources.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Customize Layout</h4>
                <p className="text-sm text-gray-600">
                  Arrange sections and metrics according to your workflow and priorities.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            KPI Types & Visualizations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Different KPI types serve different analytical purposes:</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Single Value KPIs</h4>
                <p className="text-sm text-gray-600 mb-3">Display a single metric with trend indication</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current Value</span>
                    <Badge variant="outline">Number</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Comparison</span>
                    <Badge variant="outline">Progress</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Trend Direction</span>
                    <Badge variant="outline">Arrow</Badge>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Multi-Value KPIs</h4>
                <p className="text-sm text-gray-600 mb-3">Compare multiple data points or categories</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bar Charts</span>
                    <Badge variant="outline">Comparison</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pie Charts</span>
                    <Badge variant="outline">Distribution</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Donut Charts</span>
                    <Badge variant="outline">Composition</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Time-Based KPIs</h4>
                <p className="text-sm text-gray-600 mb-3">Track performance over time periods</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Line Charts</span>
                    <Badge variant="outline">Trends</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Area Charts</span>
                    <Badge variant="outline">Volume</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Sparklines</span>
                    <Badge variant="outline">Mini Trends</Badge>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Gauge KPIs</h4>
                <p className="text-sm text-gray-600 mb-3">Show performance against targets</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Semi-Circle</span>
                    <Badge variant="outline">Target %</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Full Circle</span>
                    <Badge variant="outline">Complete %</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Linear Gauge</span>
                    <Badge variant="outline">Progress</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Interactive Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtering & Time Controls
              </h4>
              <ul className="text-sm space-y-2">
                <li>• <strong>Time Range Selector:</strong> Choose specific periods for analysis</li>
                <li>• <strong>Quick Filters:</strong> Today, This Week, This Month, This Quarter</li>
                <li>• <strong>Custom Date Ranges:</strong> Define specific start and end dates</li>
                <li>• <strong>Real-time Updates:</strong> Auto-refresh intervals for live data</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Chart Interactions
              </h4>
              <ul className="text-sm space-y-2">
                <li>• <strong>Drill-down:</strong> Click charts to see detailed breakdowns</li>
                <li>• <strong>Hover Details:</strong> View exact values and additional context</li>
                <li>• <strong>Zoom & Pan:</strong> Explore time series data in detail</li>
                <li>• <strong>Export Options:</strong> Download charts as images or data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customization Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Personalize your cockpits to match your specific needs and workflow:</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Layout Customization</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className="space-y-1">
                  <li>• Drag and drop sections</li>
                  <li>• Resize KPI cards</li>
                  <li>• Choose grid layouts</li>
                  <li>• Hide/show sections</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Custom section names</li>
                  <li>• Color themes</li>
                  <li>• Font size adjustments</li>
                  <li>• Mobile optimization</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">KPI Configuration</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className="space-y-1">
                  <li>• Custom KPI names</li>
                  <li>• Target setting</li>
                  <li>• Trend direction preferences</li>
                  <li>• Alert thresholds</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Data source connections</li>
                  <li>• Calculation formulas</li>
                  <li>• Display formats</li>
                  <li>• Update frequencies</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Do's</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Focus on 5-7 key metrics per cockpit</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Use consistent color schemes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Set realistic targets and thresholds</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Group related metrics in sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Update data regularly</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">Don'ts</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Overcrowd dashboards with too many metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Use misleading visualizations</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Ignore mobile user experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Set unrealistic targets</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Forget to test with real data</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Tip:</strong> Start with a simple cockpit focusing on your most critical KPIs, then gradually add 
          more metrics and customize the layout as you become more comfortable with the features.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CockpitGuide;
