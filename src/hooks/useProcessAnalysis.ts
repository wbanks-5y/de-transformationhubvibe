
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProcessStepDuration {
  id: string;
  process_id: string;
  step_name: string;
  duration_hours: number;
  sort_order: number;
  is_active: boolean;
}

export interface ProcessBottleneck {
  id: string;
  process_id: string;
  step_name: string;
  wait_time_hours: number;
  impact_level: 'High' | 'Medium' | 'Low';
  sort_order: number;
  is_active: boolean;
}

export interface ProcessInefficiency {
  id: string;
  process_id: string;
  title: string;
  description: string;
  severity_level: 'Critical' | 'Major' | 'Minor';
  affected_steps: string[];
  sort_order: number;
  is_active: boolean;
}

export const useProcessStepDurations = (processId: string) => {
  return useQuery({
    queryKey: ['process-step-durations', processId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_step_durations')
        .select('*')
        .eq('process_id', processId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch process step durations: ${error.message}`);
      }

      return data as ProcessStepDuration[];
    },
    enabled: !!processId,
  });
};

export const useProcessBottlenecks = (processId: string) => {
  return useQuery({
    queryKey: ['process-bottlenecks', processId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_bottlenecks')
        .select('*')
        .eq('process_id', processId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch process bottlenecks: ${error.message}`);
      }

      return data as ProcessBottleneck[];
    },
    enabled: !!processId,
  });
};

export const useProcessInefficiencies = (processId: string) => {
  return useQuery({
    queryKey: ['process-inefficiencies', processId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_inefficiencies')
        .select('*')
        .eq('process_id', processId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch process inefficiencies: ${error.message}`);
      }

      return data as ProcessInefficiency[];
    },
    enabled: !!processId,
  });
};
