
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  return useQuery({
    queryKey: ['business-processes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_processes')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch business processes: ${error.message}`);
      }

      return data as BusinessProcess[];
    },
  });
};

export const useProcessSteps = (processId: string) => {
  return useQuery({
    queryKey: ['process-steps', processId],
    queryFn: async () => {
      const { data, error } = await supabase
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
    enabled: !!processId,
  });
};

export const useProcessVariants = (processId: string) => {
  return useQuery({
    queryKey: ['process-variants', processId],
    queryFn: async () => {
      const { data, error } = await supabase
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
    enabled: !!processId,
  });
};

export const useProcessStatistics = (processId: string) => {
  return useQuery({
    queryKey: ['process-statistics', processId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_statistics')
        .select('*')
        .eq('process_id', processId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch process statistics: ${error.message}`);
      }

      return data as ProcessStatistics;
    },
    enabled: !!processId,
  });
};
