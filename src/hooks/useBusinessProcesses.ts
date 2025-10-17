import { useQuery } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";

export interface BusinessProcess {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  route_path: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProcessStep {
  id: string;
  process_id: string;
  name: string;
  department: string | null;
  icon_name: string | null;
  color_class: string;
  sort_order: number;
  description: string | null;
  is_active: boolean;
}

export interface ProcessVariant {
  id: string;
  process_id: string;
  name: string;
  description: string | null;
  frequency_percentage: number;
  is_active: boolean;
  sort_order: number;
}

export interface ProcessStatistics {
  id: string;
  process_id: string;
  avg_duration: string;
  frequency: string;
  automation_rate: number;
  error_rate: number;
}

export const useBusinessProcesses = () => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['business-processes'],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }

      const { data, error } = await organizationClient
        .from('business_processes')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch business processes: ${error.message}`);
      }

      return data as BusinessProcess[];
    },
    enabled: !!organizationClient,
  });
};

export const useProcessSteps = (processId: string) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['process-steps', processId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }

      const { data, error } = await organizationClient
        .from('process_steps')
        .select('*')
        .eq('process_id', processId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch process steps: ${error.message}`);
      }

      return data as ProcessStep[];
    },
    enabled: !!organizationClient && !!processId,
  });
};

export const useProcessVariants = (processId: string) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['process-variants', processId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }

      const { data, error } = await organizationClient
        .from('process_variants')
        .select('*')
        .eq('process_id', processId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch process variants: ${error.message}`);
      }

      return data as ProcessVariant[];
    },
    enabled: !!organizationClient && !!processId,
  });
};

export const useProcessStatistics = (processId: string) => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['process-statistics', processId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }

      const { data, error } = await organizationClient
        .from('process_statistics')
        .select('*')
        .eq('process_id', processId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch process statistics: ${error.message}`);
      }

      return data as ProcessStatistics;
    },
    enabled: !!organizationClient && !!processId,
  });
};
