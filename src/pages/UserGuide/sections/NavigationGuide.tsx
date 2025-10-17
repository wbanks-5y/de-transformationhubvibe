
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navigation, Home, Gauge, Activity, TrendingUp, Brain, Shield, Smartphone, Info } from 'lucide-react';

const NavigationGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Navigation & Interface</h1>
        <p className="text-gray-600">Learn how to navigate the platform and understand the main interface elements.</p>
      </div>

      {/* Main Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Main Navigation Bar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>The main navigation bar at the top provides access to all major sections of the platform.</p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Home className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold">Home</h4>
                <p className="text-sm text-gray-600">Main dashboard with module overview and business area charts</p>
                <Badge variant="outline" className="mt-1">All Tiers</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Gauge className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold">Cockpits</h4>
                <p className="text-sm text-gray-600">Real-time dashboards with KPIs and data visualization</p>
                <Badge variant="outline" className="mt-1">Essential+</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Activity className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold">Process Intelligence</h4>
                <p className="text-sm text-gray-600">Business process analysis and optimization tools</p>
                <Badge variant="outline" className="mt-1">Professional+</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold">Business Health</h4>
                <p className="text-sm text-gray-600">Strategic planning, objectives, and performance tracking</p>
                <Badge variant="outline" className="mt-1">Enterprise</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Brain className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <h4 className="font-semibold">Insights & Myles</h4>
                <p className="text-sm text-gray-600">AI-powered market intelligence and conversational assistant</p>
                <Badge variant="outline" className="mt-1">Enterprise</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold">Admin</h4>
                <p className="text-sm text-gray-600">User management and system configuration</p>
                <Badge variant="outline" className="mt-1">Admin Only</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Home Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Home Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>The Home dashboard provides a comprehensive overview of your business intelligence platform.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Module Grid</h4>
              <p className="text-sm text-gray-600">
                Interactive cards showing available modules based on your tier. Each card displays:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Module name and description</li>
                <li>• Access tier requirement</li>
                <li>• Quick access link</li>
                <li>• Feature availability status</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Business Area Charts</h4>
              <p className="text-sm text-gray-600">
                Visual representation of different business areas:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Financial metrics overview</li>
                <li>• Operational efficiency indicators</li>
                <li>• Strategic objective progress</li>
                <li>• Process performance summaries</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Interface Elements */}
      <Card>
        <CardHeader>
          <CardTitle>User Interface Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Header Elements</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span><strong>Logo:</strong> Returns to home dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span><strong>Navigation Menu:</strong> Main feature access</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span><strong>User Menu:</strong> Profile and settings</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span><strong>Back Button:</strong> Return to previous page</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Common UI Patterns</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span><strong>Cards:</strong> Information containers</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded"></div>
                  <span><strong>Tabs:</strong> Content organization</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded"></div>
                  <span><strong>Modals:</strong> Detailed views and forms</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span><strong>Filters:</strong> Data refinement controls</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>The platform is optimized for mobile devices with responsive design and touch-friendly interfaces.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Mobile Navigation</h4>
              <ul className="text-sm space-y-2">
                <li>• Bottom navigation bar for easy thumb access</li>
                <li>• Collapsible menu for secondary features</li>
                <li>• Swipe gestures for chart interactions</li>
                <li>• Touch-optimized buttons and controls</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Mobile Features</h4>
              <ul className="text-sm space-y-2">
                <li>• Responsive charts and dashboards</li>
                <li>• Optimized data entry forms</li>
                <li>• Simplified navigation patterns</li>
                <li>• Offline capability for key features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Common keyboard shortcuts to improve your productivity:</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Navigation</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Go to Home</span>
                  <Badge variant="outline">Ctrl + H</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Open Search</span>
                  <Badge variant="outline">Ctrl + K</Badge>
                </div>
                <div className="flex justify-between">
                  <span>User Menu</span>
                  <Badge variant="outline">Ctrl + U</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Actions</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Refresh Data</span>
                  <Badge variant="outline">F5</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Export Data</span>
                  <Badge variant="outline">Ctrl + E</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Help</span>
                  <Badge variant="outline">F1</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Navigation Tip:</strong> Use the breadcrumb navigation at the top of each page to understand your current location 
          and quickly navigate back to parent sections.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NavigationGuide;
