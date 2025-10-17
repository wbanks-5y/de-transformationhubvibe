
import React from "react";
import { NavigationItem as NavigationItemType } from "./types";
import DesktopNavigationItems from "./DesktopNavigationItems";
import type { UserTier } from '@/types/tiers';
import { Home, TrendingUp, DollarSign, Settings, GitBranch, Target, Lightbulb, MessageSquare, User, Shield } from 'lucide-react';

interface NavigationItemsProps {
  navigation: NavigationItemType[];
  isActive: (path: string) => boolean;
}

const NavigationItems: React.FC<NavigationItemsProps> = ({ navigation, isActive }) => {
  return <DesktopNavigationItems navigation={navigation} isActive={isActive} />;
};

export const navigationItems: NavigationItemType[] = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    requiredTier: 'essential'
  },
  {
    name: 'Sales Cockpit',
    href: '/cockpit/sales',
    icon: TrendingUp,
    requiredTier: 'essential'
  },
  {
    name: 'Finance Cockpit', 
    href: '/cockpit/finance',
    icon: DollarSign,
    requiredTier: 'essential'
  },
  {
    name: 'Operations Cockpit',
    href: '/cockpit/operations', 
    icon: Settings,
    requiredTier: 'essential'
  },
  {
    name: 'Process Intelligence',
    href: '/process-intelligence',
    icon: GitBranch,
    requiredTier: 'professional'
  },
  {
    name: 'Business Health',
    href: '/business-health',
    icon: Target,
    requiredTier: 'enterprise'
  },
  {
    name: 'Insights',
    href: '/insights', 
    icon: Lightbulb,
    requiredTier: 'enterprise'
  },
  {
    name: 'Myles',
    href: '/myles',
    icon: MessageSquare,
    requiredTier: 'enterprise'
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    requiredTier: 'essential'
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: Shield,
    isAdmin: true
  }
];

export default NavigationItems;
