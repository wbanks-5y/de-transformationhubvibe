
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Users, Zap, Crown, Shield, Info } from 'lucide-react';

const GettingStartedGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Getting Started</h1>
        <p className="text-gray-600">Welcome to your Business Intelligence Platform. This guide will help you understand the platform and get started with your tier's features.</p>
      </div>

      {/* Platform Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Platform Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This business intelligence platform provides comprehensive analytics, process management, and strategic planning tools. 
            Features are organized into tiers to match different business needs and growth stages.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Core Capabilities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Real-time dashboards and KPI monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Business process analysis and optimization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Strategic planning and performance tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  AI-powered insights and recommendations
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Key Benefits</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Data-driven decision making
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Process efficiency improvements
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Strategic alignment and tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Automated insights and alerts
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Tier System */}
      <Card>
        <CardHeader>
          <CardTitle>User Tier System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Features are organized into tiers that build upon each other. Each higher tier includes all features from lower tiers.</p>
          
          <div className="grid gap-4">
            {/* Essential Tier */}
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-800">Essential Tier</h4>
                  <Badge variant="outline" className="text-green-700 border-green-300">Entry Level</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-green-700">Perfect for getting started with business intelligence.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Home Dashboard</Badge>
                  <Badge variant="secondary" className="text-xs">Cockpits & KPIs</Badge>
                  <Badge variant="secondary" className="text-xs">Real-time Monitoring</Badge>
                  <Badge variant="secondary" className="text-xs">Basic Charts</Badge>
                </div>
              </div>
            </div>

            {/* Professional Tier */}
            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-800">Professional Tier</h4>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">Business Growth</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-blue-700">Includes Essential features plus advanced process management.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Process Intelligence</Badge>
                  <Badge variant="secondary" className="text-xs">Bottleneck Analysis</Badge>
                  <Badge variant="secondary" className="text-xs">Process Optimization</Badge>
                  <Badge variant="secondary" className="text-xs">Workflow Mapping</Badge>
                </div>
              </div>
            </div>

            {/* Enterprise Tier */}
            <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-semibold text-purple-800">Enterprise Tier</h4>
                  <Badge variant="outline" className="text-purple-700 border-purple-300">Full Suite</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-purple-700">Complete business intelligence suite with AI-powered features.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Business Health</Badge>
                  <Badge variant="secondary" className="text-xs">Strategic Planning</Badge>
                  <Badge variant="secondary" className="text-xs">Analyst Insights</Badge>
                  <Badge variant="secondary" className="text-xs">Myles AI Assistant</Badge>
                  <Badge variant="secondary" className="text-xs">Scenario Planning</Badge>
                </div>
              </div>
            </div>

            {/* Admin Access */}
            <div className="border rounded-lg p-4 bg-gray-50 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Admin Access</h4>
                  <Badge variant="outline" className="text-gray-700 border-gray-300">System Management</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">Administrative features for system configuration and user management.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">User Management</Badge>
                  <Badge variant="secondary" className="text-xs">System Configuration</Badge>
                  <Badge variant="secondary" className="text-xs">Data Management</Badge>
                  <Badge variant="secondary" className="text-xs">Company Settings</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* First Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Your First Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Explore Your Dashboard</h4>
                <p className="text-sm text-gray-600">Start with the Home dashboard to get an overview of available modules and business areas.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Set Up Your First Cockpit</h4>
                <p className="text-sm text-gray-600">Visit the Cockpit Selection page to choose and configure your first real-time dashboard.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Configure Key Metrics</h4>
                <p className="text-sm text-gray-600">Add and configure KPIs that matter most to your business operations.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Explore Advanced Features</h4>
                <p className="text-sm text-gray-600">Based on your tier, explore Process Intelligence, Business Health, or AI-powered features.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Tip:</strong> Use the search function in this guide to quickly find information about specific features. 
          Each section includes detailed step-by-step instructions and best practices.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GettingStartedGuide;
