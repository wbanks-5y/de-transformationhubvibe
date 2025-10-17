
import { BarChart3, Users, GitBranch, Target, Lightbulb, MessageSquare, Settings } from "lucide-react";
import type { UserTier } from "@/types/tiers";

export interface ModuleConfig {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  path: string;
  category: 'analytics' | 'operations' | 'ai';
  requiredTier: UserTier;
  isComingSoon?: boolean;
}

export const moduleData: ModuleConfig[] = [
  {
    id: 'cockpits',
    title: 'Cockpits',
    description: 'Real-time operational dashboards and KPI monitoring',
    icon: BarChart3,
    color: 'bg-blue-500',
    path: '/cockpit/sales',
    category: 'analytics',
    requiredTier: 'essential'
  },
  {
    id: 'process-intelligence', 
    title: 'Process Intelligence',
    description: 'Analyze and optimize your business processes',
    icon: GitBranch,
    color: 'bg-green-500',
    path: '/process-intelligence',
    category: 'operations',
    requiredTier: 'professional'
  },
  {
    id: 'business-health',
    title: 'Business Health',
    description: 'Strategic objectives and performance tracking',
    icon: Target,
    color: 'bg-purple-500',
    path: '/business-health',
    category: 'analytics',
    requiredTier: 'enterprise'
  },
  {
    id: 'insights',
    title: 'Analyst Insights',
    description: 'Market intelligence and external analysis',
    icon: Lightbulb,
    color: 'bg-yellow-500',
    path: '/insights',
    category: 'analytics',
    requiredTier: 'enterprise'
  },
  {
    id: 'myles',
    title: 'Myles AI Assistant',
    description: 'AI-powered business insights and recommendations',
    icon: MessageSquare,
    color: 'bg-indigo-500',
    path: '/myles',
    category: 'ai',
    requiredTier: 'enterprise'
  },
  {
    id: 'admin',
    title: 'Administration',
    description: 'System configuration and user management',
    icon: Settings,
    color: 'bg-gray-500',
    path: '/admin',
    category: 'operations',
    requiredTier: 'admin'
  }
];
