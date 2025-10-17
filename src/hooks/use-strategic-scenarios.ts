import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";
import { supabase } from "@/integrations/supabase/client";

export const useStrategicScenarios = () => {
  return useQuery({
    queryKey: ["strategic-scenarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strategic_scenarios")
        .select(`
          *,
          strategic_scenario_outcomes(
            *,
            impact_category:strategic_scenario_impact_categories(*)
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateStrategicScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scenario: any) => {
      const { data, error } = await supabase
        .from("strategic_scenarios")
        .insert([scenario])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategic-scenarios"] });
    },
  });
};

export const useUpdateStrategicScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("strategic_scenarios")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategic-scenarios"] });
    },
  });
};

export const useDeleteStrategicScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("strategic_scenarios")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategic-scenarios"] });
    },
  });
};

export const useStrategicScenarioParameters = (scenarioId: string) => {
  return useQuery({
    queryKey: ["strategic-scenario-parameters", scenarioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strategic_scenario_parameters")
        .select("*")
        .eq("scenario_id", scenarioId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!scenarioId,
  });
};

export const useStrategicScenarioOutcomes = (scenarioId: string) => {
  return useQuery({
    queryKey: ["strategic-scenario-outcomes", scenarioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strategic_scenario_outcomes")
        .select(`
          *,
          impact_category:strategic_scenario_impact_categories(*)
        `)
        .eq("scenario_id", scenarioId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!scenarioId,
  });
};

export const useStrategicScenarioComparisons = () => {
  return useQuery({
    queryKey: ["strategic-scenario-comparisons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strategic_scenario_comparisons")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateScenarioComparison = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comparison: any) => {
      const { data, error } = await supabase
        .from("strategic_scenario_comparisons")
        .insert([comparison])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategic-scenario-comparisons"] });
    },
  });
};

export const useStrategicScenarioImpactCategories = () => {
  return useQuery({
    queryKey: ["strategic-scenario-impact-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strategic_scenario_impact_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Strategic Initiatives hooks
export const useStrategicInitiatives = () => {
  const { organizationClient } = useOrganization();
  
  return useQuery({
    queryKey: ["strategic-initiatives"],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('Organization client not available');
      }
      
      const { data, error } = await organizationClient
        .from("strategic_initiatives")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!organizationClient,
  });
};

// Strategic Initiative Milestones hooks
export const useStrategicInitiativeMilestones = () => {
  const { organizationClient } = useOrganization();
  
  return useQuery({
    queryKey: ["strategic-initiative-milestones"],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('Organization client not available');
      }
      
      const { data, error } = await organizationClient
        .from("strategic_initiative_milestones")
        .select(`
          *,
          strategic_initiatives!strategic_initiative_milestones_initiative_id_fkey(*)
        `)
        .order("target_date", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!organizationClient,
  });
};

// Strategic Resource Allocations hooks
export const useStrategicResourceAllocations = () => {
  const { organizationClient } = useOrganization();
  
  return useQuery({
    queryKey: ["strategic-resource-allocations"],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('Organization client not available');
      }
      
      const { data, error } = await organizationClient
        .from("strategic_resource_allocations")
        .select(`
          *,
          strategic_initiatives!strategic_resource_allocations_initiative_id_fkey(*)
        `)
        .order("period_start", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!organizationClient,
  });
};

// Strategic Initiative Dependencies hooks
export const useStrategicInitiativeDependencies = () => {
  const { organizationClient } = useOrganization();
  
  return useQuery({
    queryKey: ["strategic-initiative-dependencies"],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('Organization client not available');
      }
      
      const { data, error } = await organizationClient
        .from("strategic_initiative_dependencies")
        .select(`
          *,
          initiative:strategic_initiatives!strategic_initiative_dependencies_initiative_id_fkey(*),
          depends_on:strategic_initiatives!strategic_initiative_dependencies_depends_on_initiative_id_fkey(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!organizationClient,
  });
};

// Strategic Milestone Dependencies hooks
export const useStrategicMilestoneDependencies = () => {
  const { organizationClient } = useOrganization();
  
  return useQuery({
    queryKey: ["strategic-milestone-dependencies"],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('Organization client not available');
      }
      
      const { data, error } = await organizationClient
        .from("strategic_milestone_dependencies")
        .select(`
          *,
          milestone:strategic_initiative_milestones!strategic_milestone_dependencies_milestone_id_fkey(*),
          depends_on:strategic_initiative_milestones!strategic_milestone_dependencies_depends_on_milestone_id_fkey(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!organizationClient,
  });
};
