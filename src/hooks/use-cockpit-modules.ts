
import { useMemo } from 'react';
import { useCockpitTypes } from '@/hooks/use-cockpit-data';
import { ModuleConfig } from '@/components/home/moduleData';
import { getIconByName } from '@/utils/iconUtils';

// Color mapping for cockpit modules
export const cockpitColorMap: Record<string, string> = {
  'sales': 'bg-blue-500',
  'finance': 'bg-green-500',
  'operations': 'bg-purple-500',
  'manufacturing': 'bg-orange-500',
  'supply-chain': 'bg-teal-500',
  'hr': 'bg-pink-500',
  'customer': 'bg-indigo-500',
  'default': 'bg-gray-500'
};

export const useCockpitModules = (): ModuleConfig[] => {
  const { data: cockpitTypes, isLoading } = useCockpitTypes();

  const cockpitModules = useMemo(() => {
    if (!cockpitTypes || isLoading) return [];

    return cockpitTypes.map(cockpit => ({
      id: `${cockpit.name}-cockpit`,
      title: cockpit.display_name,
      description: cockpit.description || `${cockpit.display_name} metrics and performance indicators`,
      path: cockpit.route_path,
      icon: getIconByName(cockpit.icon || cockpit.name),
      category: 'analytics' as const,
      color: cockpit.color_class || cockpitColorMap[cockpit.name] || cockpitColorMap['default'],
      requiredTier: 'essential' as const
    }));
  }, [cockpitTypes, isLoading]);

  return cockpitModules;
};
