
import { NavIcons } from "@/components/navigation/icons";

// Icon recommendations based on cockpit name patterns
const ICON_RECOMMENDATIONS: Record<string, string> = {
  // Finance related
  'finance': 'DollarSign',
  'financial': 'DollarSign',
  'accounting': 'DollarSign',
  'revenue': 'TrendingUp',
  'profit': 'TrendingUp',
  'budget': 'Wallet',
  'cost': 'CircleDollarSign',
  'cash': 'Wallet',
  'credit': 'CreditCard',
  
  // Sales related
  'sales': 'TrendingUp',
  'customer': 'Users',
  'crm': 'Users',
  'marketing': 'Target',
  'lead': 'Target',
  
  // Operations
  'operations': 'Gauge',
  'operational': 'Gauge',
  'manufacturing': 'Factory',
  'production': 'Factory',
  'supply': 'Truck',
  'logistics': 'Truck',
  'warehouse': 'Package',
  'inventory': 'Package',
  'procurement': 'ShoppingCart',
  'purchase': 'ShoppingCart',
  
  // HR & People
  'hr': 'Users',
  'human': 'Users',
  'people': 'Users',
  'employee': 'Users',
  'staff': 'Users',
  
  // IT & Technology
  'it': 'Settings',
  'technology': 'Zap',
  'tech': 'Zap',
  'digital': 'Zap',
  'system': 'Settings',
  
  // Project Management
  'project': 'ClipboardList',
  'portfolio': 'ClipboardList',
  'program': 'ClipboardList',
  
  // Quality & Compliance
  'quality': 'Shield',
  'compliance': 'Shield',
  'audit': 'Shield',
  'risk': 'Shield',
  
  // Default fallback
  'default': 'Gauge'
};

// Color recommendations to ensure variety
const COLOR_SEQUENCE = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#059669', // Teal
  '#DC2626', // Red-600
  '#7C3AED', // Violet-600
  '#0891B2', // Cyan-600
  '#16A34A', // Green-600
  '#CA8A04', // Yellow-600
  '#9333EA', // Purple-600
  '#6B7280', // Gray
  '#1F2937', // Dark gray
  '#3B82F6', // Blue
];

export const recommendIcon = (cockpitName: string): string => {
  const nameLower = cockpitName.toLowerCase();
  
  // Check for exact matches first
  for (const [key, icon] of Object.entries(ICON_RECOMMENDATIONS)) {
    if (nameLower.includes(key)) {
      return icon;
    }
  }
  
  // Return default if no match found
  return ICON_RECOMMENDATIONS.default;
};

export const recommendColor = (existingColors: string[]): string => {
  // Find the first color in our sequence that's not already used
  for (const color of COLOR_SEQUENCE) {
    if (!existingColors.includes(color)) {
      return color;
    }
  }
  
  // If all colors are used, cycle back to the beginning
  return COLOR_SEQUENCE[existingColors.length % COLOR_SEQUENCE.length];
};

export const getAvailableIcons = (): Array<{ name: string; component: any }> => {
  return Object.entries(NavIcons).map(([name, component]) => ({
    name,
    component
  }));
};
