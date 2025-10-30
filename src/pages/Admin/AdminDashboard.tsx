
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Settings, 
  BarChart3, 
  Database, 
  Shield, 
  Key,
  Building,
  UserPlus,
  Mail,
  Activity,
  Lightbulb,
  TrendingUp,
  Calendar,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const adminSectionGroups = [
    {
      title: "Organization Settings",
      description: "Manage company profile and organizational configuration",
      sections: [
        {
          title: "Company Profile",
          description: "Manage company information and settings",
          icon: Building,
          path: "/admin/company",
          color: "bg-orange-50 text-orange-600"
        }
      ]
    },
    {
      title: "Business Intelligence & Analytics",
      description: "Configure analytics, insights, and business intelligence tools",
      sections: [
        {
          title: "Analyst Insights",
          description: "Generate and manage PESTLE analysis and market intelligence insights",
          icon: Lightbulb,
          path: "/admin/analyst-insights",
          color: "bg-indigo-50 text-indigo-600"
        },
        {
          title: "Cockpit Management",
          description: "Configure dashboards, KPIs, and metrics",
          icon: BarChart3,
          path: "/admin/cockpits",
          color: "bg-indigo-50 text-indigo-600"
        },
        {
          title: "Process Intelligence",
          description: "Manage business processes, analysis, and optimization",
          icon: Activity,
          path: "/admin/process-intelligence",
          color: "bg-indigo-50 text-indigo-600"
        }
      ]
    },
    {
      title: "Business Health Management",
      description: "Configure and manage business health monitoring systems",
      sections: [
        {
          title: "Dashboard",
          description: "Monitor health scores and RAG status for strategic objectives",
          icon: TrendingUp,
          path: "/admin/health-tracking",
          color: "bg-purple-50 text-purple-600"
        },
        {
          title: "Strategy Map",
          description: "Define and manage organizational strategic goals",
          icon: Target,
          path: "/admin/strategic-objectives",
          color: "bg-purple-50 text-purple-600"
        },
        {
          title: "Initiative Tracker",
          description: "Manage projects and actions driving strategic progress",
          icon: Calendar,
          path: "/admin/strategic-initiatives",
          color: "bg-purple-50 text-purple-600"
        },
        {
          title: "Risk Assessment",
          description: "Identify and manage risks and opportunities",
          icon: Shield,
          path: "/admin/risk-assessment",
          color: "bg-purple-50 text-purple-600"
        }
      ]
    },
    {
      title: "User & Access Management",
      description: "Manage users, roles, permissions, and administrative access",
      sections: [
        {
          title: "Approve Admin",
          description: "Grant administrative privileges to users",
          icon: UserPlus,
          path: "/admin/approve-admin",
          color: "bg-blue-50 text-blue-600"
        },
        {
          title: "Invitations",
          description: "Manage user invitations and onboarding",
          icon: Mail,
          path: "/admin/invitations",
          color: "bg-blue-50 text-blue-600"
        },
        {
          title: "Roles Management",
          description: "Define and assign user roles and permissions",
          icon: Settings,
          path: "/admin/roles",
          color: "bg-blue-50 text-blue-600"
        },
        {
          title: "User Management",
          description: "Manage user accounts, roles, and permissions",
          icon: Users,
          path: "/admin/users",
          color: "bg-blue-50 text-blue-600"
        }
      ]
    },
    {
      title: "System & Security",
      description: "Monitor security, database, and system configurations",
      sections: [
        {
          title: "API Keys",
          description: "Manage API keys and external integrations",
          icon: Key,
          path: "/admin/api-keys",
          color: "bg-green-50 text-green-600"
        },
        {
          title: "Database Management",
          description: "Configure database connections and settings",
          icon: Database,
          path: "/admin/database",
          color: "bg-green-50 text-green-600"
        },
        {
          title: "Security Dashboard",
          description: "Monitor security policies and access controls",
          icon: Shield,
          path: "/admin/security",
          color: "bg-green-50 text-green-600"
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Manage your application settings, users, and configurations
        </p>
      </div>

      <div className="space-y-12">
        {adminSectionGroups.map((group) => (
          <div key={group.title} className="space-y-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-xl font-semibold text-gray-900">{group.title}</h2>
              <p className="text-gray-600 mt-1">{group.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {group.sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Card key={section.path} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full">
                        <Link to={section.path}>
                          Access {section.title}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Security Status</p>
                  <p className="text-2xl font-bold text-green-600">Secure</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">RLS Policies</p>
                  <p className="text-2xl font-bold">28</p>
                </div>
                <Database className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Protected Tables</p>
                  <p className="text-2xl font-bold">21</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Audit Logging</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                </div>
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
