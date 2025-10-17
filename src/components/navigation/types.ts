
import { LucideIcon } from 'lucide-react';
import type { UserTier } from '@/types/tiers';

export interface NavigationSubItem {
  name: string;
  href: string;
  icon: LucideIcon;
  requiredTier?: UserTier;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  requiredTier?: UserTier;
  isAdmin?: boolean;
  subItems?: NavigationSubItem[];
}

export interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}
