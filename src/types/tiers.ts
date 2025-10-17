
export type UserTier = 'essential' | 'professional' | 'enterprise' | 'admin';

export interface TierConfig {
  name: string;
  displayName: string;
  description: string;
  features: string[];
  order: number;
}

export const TIER_CONFIGS: Record<UserTier, TierConfig> = {
  essential: {
    name: 'essential',
    displayName: 'Essential',
    description: 'Access to Home and Cockpits',
    features: ['Home Dashboard', 'Cockpits'],
    order: 1
  },
  professional: {
    name: 'professional', 
    displayName: 'Professional',
    description: 'Essential features plus Process Intelligence',
    features: ['Home Dashboard', 'Cockpits', 'Process Intelligence'],
    order: 2
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise', 
    description: 'Professional features plus Business Health, Insights, and Myles',
    features: ['Home Dashboard', 'Cockpits', 'Process Intelligence', 'Business Health', 'Insights', 'Myles'],
    order: 3
  },
  admin: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full system access including administration',
    features: ['All Features', 'Administration'],
    order: 4
  }
};

export const hasRequiredTier = (userTier: UserTier, requiredTier: UserTier): boolean => {
  // Admin users always have access to everything
  if (userTier === 'admin') return true;
  
  const userOrder = TIER_CONFIGS[userTier]?.order || 0;
  const requiredOrder = TIER_CONFIGS[requiredTier]?.order || 0;
  return userOrder >= requiredOrder;
};
