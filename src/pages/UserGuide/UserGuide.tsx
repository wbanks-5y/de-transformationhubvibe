
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Book, Users, Settings, BarChart3, Brain, Activity, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/ui/back-button';

// Import guide sections
import GettingStartedGuide from './sections/GettingStartedGuide';
import NavigationGuide from './sections/NavigationGuide';
import CockpitGuide from './sections/CockpitGuide';
import ProcessIntelligenceGuide from './sections/ProcessIntelligenceGuide';
import BusinessHealthGuide from './sections/BusinessHealthGuide';
import AnalystInsightsGuide from './sections/AnalystInsightsGuide';
import PestleAnalysisGuide from './sections/PestleAnalysisGuide';
import MylesGuide from './sections/MylesGuide';
import AdminGuide from './sections/AdminGuide';
import TroubleshootingGuide from './sections/TroubleshootingGuide';

interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  requiredTier?: 'essential' | 'professional' | 'enterprise';
  isAdmin?: boolean;
  component: React.ComponentType;
  keywords: string[];
}

const UserGuide: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const guideSections: GuideSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Platform overview, account setup, and first steps',
      icon: Book,
      component: GettingStartedGuide,
      keywords: ['setup', 'account', 'login', 'first time', 'overview', 'tier']
    },
    {
      id: 'navigation',
      title: 'Navigation & Interface',
      description: 'Understanding the main interface and navigation',
      icon: Activity,
      component: NavigationGuide,
      keywords: ['navigation', 'interface', 'menu', 'dashboard', 'mobile']
    },
    {
      id: 'cockpits',
      title: 'Cockpits & Dashboards',
      description: 'Real-time dashboards, KPIs, and data visualization',
      icon: BarChart3,
      requiredTier: 'essential',
      component: CockpitGuide,
      keywords: ['cockpit', 'dashboard', 'kpi', 'metrics', 'charts', 'visualization']
    },
    {
      id: 'process-intelligence',
      title: 'Process Intelligence',
      description: 'Business process analysis and optimization',
      icon: Activity,
      requiredTier: 'professional',
      component: ProcessIntelligenceGuide,
      keywords: ['process', 'analysis', 'bottleneck', 'optimization', 'workflow']
    },
    {
      id: 'business-health',
      title: 'Business Health & Strategy',
      description: 'Strategic planning, objectives, and performance tracking',
      icon: Activity,
      requiredTier: 'enterprise',
      component: BusinessHealthGuide,
      keywords: ['strategy', 'objectives', 'initiatives', 'planning', 'risk', 'scenarios']
    },
    {
      id: 'analyst-insights',
      title: 'Analyst Insights',
      description: 'AI-powered market intelligence and external data analysis',
      icon: Brain,
      requiredTier: 'enterprise',
      component: AnalystInsightsGuide,
      keywords: ['insights', 'ai', 'market', 'intelligence', 'analysis', 'trends']
    },
    {
      id: 'pestle-analysis',
      title: 'PESTLE Analysis',
      description: 'Comprehensive external environment analysis for strategic planning',
      icon: Brain,
      requiredTier: 'enterprise',
      component: PestleAnalysisGuide,
      keywords: ['pestle', 'political', 'economic', 'social', 'technological', 'legal', 'environmental', 'strategy']
    },
    {
      id: 'myles',
      title: 'Myles AI Assistant',
      description: 'Conversational business intelligence and data queries',
      icon: Brain,
      requiredTier: 'enterprise',
      component: MylesGuide,
      keywords: ['myles', 'ai', 'assistant', 'chat', 'queries', 'analysis']
    },
    {
      id: 'admin',
      title: 'Administration',
      description: 'User management, system configuration, and settings',
      icon: Shield,
      isAdmin: true,
      component: AdminGuide,
      keywords: ['admin', 'users', 'configuration', 'settings', 'management']
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Common issues, solutions, and best practices',
      icon: Settings,
      component: TroubleshootingGuide,
      keywords: ['troubleshooting', 'issues', 'problems', 'help', 'support', 'faq']
    }
  ];

  const filteredSections = useMemo(() => {
    return guideSections.filter(section => {
      // Filter by search term
      if (searchTerm) {
        const matchesSearch = 
          section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.keywords.some(keyword => 
            keyword.toLowerCase().includes(searchTerm.toLowerCase())
          );
        if (!matchesSearch) return false;
      }

      // Filter by user permissions (simplified - in real app, check actual user tier)
      if (section.isAdmin) {
        // In real app, check if user is admin
        return true; // For demo purposes
      }

      return true;
    });
  }, [searchTerm]);

  const ActiveComponent = guideSections.find(s => s.id === activeSection)?.component || GettingStartedGuide;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <BackButton />
        <div className="flex items-center gap-3 mb-4 mt-4">
          <Book className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">User Guide</h1>
            <p className="text-gray-600">Comprehensive guide to all platform features and capabilities</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search guide sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Guide Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredSections.map(section => {
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className="w-full justify-start text-left h-auto p-3 overflow-hidden"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className="flex items-start gap-3 w-full min-w-0">
                      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="font-medium text-sm break-words">{section.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 break-words leading-relaxed">
                          {section.description}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {section.requiredTier && (
                            <Badge variant="outline" className="text-xs">
                              {section.requiredTier}
                            </Badge>
                          )}
                          {section.isAdmin && (
                            <Badge variant="outline" className="text-xs">
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <ActiveComponent />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
