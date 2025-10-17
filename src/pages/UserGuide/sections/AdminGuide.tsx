
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, Settings, Database, Key, Building, Info, Brain } from 'lucide-react';

const AdminGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Administration</h1>
        <p className="text-gray-600">Complete guide to system administration, user management, and platform configuration.</p>
        <Badge className="mt-2">Admin Access Required</Badge>
      </div>

      {/* Admin Dashboard Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Dashboard Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The administration dashboard is organized into four main sections to help you efficiently manage 
            all aspects of the platform. Each section groups related administrative tasks for better navigation.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Dashboard Sections</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  User & Access Management
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  System & Security
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  Business Intelligence & Analytics
                </li>
                <li className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-orange-500" />
                  Organization Settings
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Admin Capabilities</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">User Management</Badge>
                <Badge variant="outline">System Configuration</Badge>
                <Badge variant="outline">Analyst Insights</Badge>
                <Badge variant="outline">PESTLE Analysis</Badge>
                <Badge variant="outline">Security Management</Badge>
                <Badge variant="outline">Data Administration</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Intelligence & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Business Intelligence & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Manage AI-powered insights, analytics, and business intelligence features.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Analyst Insights Management</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Insight Operations</h5>
                  <ul className="space-y-1">
                    <li>• Review pending insights for approval</li>
                    <li>• Approve high-quality insights</li>
                    <li>• Reject insights (automatically deleted)</li>
                    <li>• Edit insight content and metadata</li>
                    <li>• Manage insight categories and tags</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Quality Control</h5>
                  <ul className="space-y-1">
                    <li>• Verify source accuracy and credibility</li>
                    <li>• Ensure appropriate impact assessment</li>
                    <li>• Maintain content quality standards</li>
                    <li>• Monitor insight relevance</li>
                    <li>• Track approval/rejection metrics</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">PESTLE Analysis Generation</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">AI-Powered Analysis</h5>
                  <ul className="space-y-1">
                    <li>• Generate comprehensive PESTLE reports</li>
                    <li>• Analyze Political, Economic, Social factors</li>
                    <li>• Evaluate Technology, Legal, Environmental impacts</li>
                    <li>• Create strategic recommendations</li>
                    <li>• Export analysis for stakeholders</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Integration Features</h5>
                  <ul className="space-y-1">
                    <li>• Uses company profile context</li>
                    <li>• Incorporates existing analyst insights</li>
                    <li>• Considers current market conditions</li>
                    <li>• Tailored to industry and business model</li>
                    <li>• Real-time generation capabilities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Manage user accounts, permissions, and access levels across the platform.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">User Account Management</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">User Operations</h5>
                  <ul className="space-y-1">
                    <li>• Create new user accounts</li>
                    <li>• Edit user profiles and information</li>
                    <li>• Activate/deactivate user accounts</li>
                    <li>• Reset user passwords</li>
                    <li>• Delete user accounts</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">User Information</h5>
                  <ul className="space-y-1">
                    <li>• Full name and contact details</li>
                    <li>• Company and job title</li>
                    <li>• Account status and tier</li>
                    <li>• Last login and activity</li>
                    <li>• Assigned roles and permissions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">User Tiers and Access Levels</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="font-medium">Essential Tier</span>
                  <Badge variant="outline">Basic dashboards and KPIs</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="font-medium">Professional Tier</span>
                  <Badge variant="outline">+ Process Intelligence</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="font-medium">Enterprise Tier</span>
                  <Badge variant="outline">+ Business Health & AI</Badge>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Invitation Management</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Sending Invitations</h5>
                  <ul className="space-y-1">
                    <li>• Email invitations to new users</li>
                    <li>• Set initial tier and permissions</li>
                    <li>• Bulk invitation capabilities</li>
                    <li>• Custom invitation messages</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Invitation Tracking</h5>
                  <ul className="space-y-1">
                    <li>• Monitor invitation status</li>
                    <li>• Resend pending invitations</li>
                    <li>• Cancel unaccepted invitations</li>
                    <li>• Track acceptance rates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Configure cockpits, KPIs, and system-wide settings to customize the platform for your organization.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Cockpit Management</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Cockpit Types</h5>
                  <ul className="space-y-1">
                    <li>• Create new cockpit types</li>
                    <li>• Configure cockpit properties</li>
                    <li>• Set display names and descriptions</li>
                    <li>• Assign icons and colors</li>
                    <li>• Manage cockpit routing</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Section Organization</h5>
                  <ul className="space-y-1">
                    <li>• Create cockpit sections</li>
                    <li>• Organize metrics by section</li>
                    <li>• Set section order and layout</li>
                    <li>• Configure section permissions</li>
                    <li>• Manage section visibility</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">KPI Configuration</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">KPI Setup</h5>
                  <ul className="space-y-1">
                    <li>• Define KPI names and descriptions</li>
                    <li>• Set calculation formulas</li>
                    <li>• Configure data sources</li>
                    <li>• Set target values and thresholds</li>
                    <li>• Choose visualization types</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Advanced KPI Features</h5>
                  <ul className="space-y-1">
                    <li>• Time-based calculations</li>
                    <li>• Multi-value KPI configurations</li>
                    <li>• Formula templates and presets</li>
                    <li>• Data validation rules</li>
                    <li>• Automated refresh schedules</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Manage data connections, integrations, and system maintenance tasks.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Database Configuration</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Connection Management</h5>
                  <ul className="space-y-1">
                    <li>• Add database connections</li>
                    <li>• Configure connection parameters</li>
                    <li>• Test connection reliability</li>
                    <li>• Monitor connection health</li>
                    <li>• Manage connection security</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">SQL Query Mapping</h5>
                  <ul className="space-y-1">
                    <li>• Create query mappings for metrics</li>
                    <li>• Set query execution schedules</li>
                    <li>• Monitor query performance</li>
                    <li>• Handle query errors</li>
                    <li>• Optimize query execution</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">API Management</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">API Key Configuration</h5>
                  <ul className="space-y-1">
                    <li>• Generate and manage API keys</li>
                    <li>• Configure external service integrations</li>
                    <li>• Set API rate limits and quotas</li>
                    <li>• Monitor API usage and health</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Security Management</h5>
                  <ul className="space-y-1">
                    <li>• Encryption key management</li>
                    <li>• Audit log monitoring</li>
                    <li>• Access control configuration</li>
                    <li>• Security policy enforcement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Configure company-wide settings and organizational information.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Company Profile</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Basic Information</h5>
                  <ul className="space-y-1">
                    <li>• Company name and industry</li>
                    <li>• Mission and vision statements</li>
                    <li>• Business model description</li>
                    <li>• Company size and structure</li>
                    <li>• Financial year configuration</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Strategic Information</h5>
                  <ul className="space-y-1">
                    <li>• Core values and principles</li>
                    <li>• Strategic priorities</li>
                    <li>• Target markets and customers</li>
                    <li>• Competitive advantages</li>
                    <li>• Current challenges</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">System Preferences</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Display Settings</h5>
                  <ul className="space-y-1">
                    <li>• Default theme and branding</li>
                    <li>• Date and time formats</li>
                    <li>• Currency and number formats</li>
                    <li>• Language preferences</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Operational Settings</h5>
                  <ul className="space-y-1">
                    <li>• Default user tier for new users</li>
                    <li>• Data refresh intervals</li>
                    <li>• Notification preferences</li>
                    <li>• Backup and maintenance schedules</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Security Best Practices</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Regularly review user access and permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Monitor audit logs for suspicious activity</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Keep API keys secure and rotate regularly</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Implement proper backup procedures</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">Operational Best Practices</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Document configuration changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Test changes in development first</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Provide user training and documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Monitor system performance regularly</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Admin Reminder:</strong> Always test configuration changes in a development environment first. 
          Keep detailed logs of changes and maintain regular backups of critical system data.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdminGuide;
