
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Database, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import SecurityMonitor from '@/components/admin/SecurityMonitor';
import { SecurityThreatMonitor } from '@/components/admin/SecurityThreatMonitor';
import { SecurityReportsPanel } from '@/components/admin/SecurityReportsPanel';
import BackButton from '@/components/ui/back-button';

const SecurityDashboard: React.FC = () => {
  const securityMetrics = [
    {
      title: "RLS Policies Active",
      value: "28",
      description: "Row Level Security policies protecting data",
      icon: Shield,
      status: "secure"
    },
    {
      title: "Protected Tables",
      value: "21",
      description: "Database tables with security policies",
      icon: Database,
      status: "secure"
    },
    {
      title: "User Access Levels",
      value: "4",
      description: "Admin, Manager, Approved, Pending tiers",
      icon: Users,
      status: "secure"
    },
    {
      title: "Audit Logging",
      value: "Active",
      description: "All KPI data access is monitored",
      icon: Lock,
      status: "secure"
    }
  ];

  const recentSecurityUpdates = [
    {
      title: "KPI Data Protection Enhanced",
      description: "Added RLS policies to cockpit_kpi_targets, cockpit_kpi_time_based, and cockpit_kpi_values tables",
      timestamp: "Just now",
      type: "enhancement"
    },
    {
      title: "Duplicate Policies Cleaned Up",
      description: "Removed conflicting RLS policies and standardized access patterns",
      timestamp: "Just now",
      type: "maintenance"
    },
    {
      title: "Audit Logging Expanded",
      description: "All KPI data operations are now logged for security monitoring",
      timestamp: "Just now",
      type: "monitoring"
    }
  ];

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <BackButton />
        <div className="flex items-center gap-3 mb-4 mt-4">
          <Shield className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold">Security Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Monitor and manage application security policies and access controls
            </p>
          </div>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {securityMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {metric.description}
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Secure
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Security Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Updates</CardTitle>
            <CardDescription>
              Latest security enhancements and policy changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSecurityUpdates.map((update, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-1">
                    {update.type === 'enhancement' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {update.type === 'maintenance' && <Shield className="h-4 w-4 text-blue-600" />}
                    {update.type === 'monitoring' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{update.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {update.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {update.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Activity Monitor */}
        <SecurityMonitor />
      </div>

      {/* Enhanced Security Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <SecurityThreatMonitor />
        <SecurityReportsPanel />
      </div>

      {/* Security Policy Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Security Policy Summary</CardTitle>
          <CardDescription>
            Overview of implemented security controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Data Access Controls</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• KPI data requires user approval status</li>
                <li>• Admin users have full data management access</li>
                <li>• Managers can modify operational data</li>
                <li>• Regular users have read-only access to approved data</li>
                <li>• All data access is logged and monitored</li>
                <li>• Session management with automatic threat detection</li>
                <li>• Automated security response for high-risk activities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Security Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Row Level Security (RLS) on all sensitive tables</li>
                <li>• Secure database functions prevent SQL injection</li>
                <li>• Comprehensive audit logging system</li>
                <li>• Multi-tier user approval workflow</li>
                <li>• Real-time security threat monitoring</li>
                <li>• Advanced security reporting and analytics</li>
                <li>• Automated threat response system</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
