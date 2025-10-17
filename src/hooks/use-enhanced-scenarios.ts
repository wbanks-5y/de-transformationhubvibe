
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook to fetch scenario impact categories
export const useScenarioImpactCategories = () => {
  return useQuery({
    queryKey: ['scenario-impact-categories'],
    queryFn: async () => {
      console.log('Fetching scenario impact categories...');
      const { data, error } = await supabase
        .from('strategic_scenario_impact_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching scenario impact categories:', error);
        throw error;
      }

      console.log('Scenario impact categories fetched:', data);
      return data || [];
    },
  });
};

// Hook to fetch scenario parameters
export const useScenarioParameters = (scenarioId?: string) => {
  return useQuery({
    queryKey: ['scenario-parameters', scenarioId],
    queryFn: async () => {
      if (!scenarioId) return [];
      
      console.log('Fetching scenario parameters for:', scenarioId);
      const { data, error } = await supabase
        .from('strategic_scenario_parameters')
        .select('*')
        .eq('scenario_id', scenarioId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching scenario parameters:', error);
        throw error;
      }

      console.log('Scenario parameters fetched:', data);
      return data || [];
    },
    enabled: !!scenarioId,
  });
};

// Hook to fetch scenario comparisons
export const useScenarioComparisons = () => {
  return useQuery({
    queryKey: ['scenario-comparisons'],
    queryFn: async () => {
      console.log('Fetching scenario comparisons...');
      const { data, error } = await supabase
        .from('strategic_scenario_comparisons')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching scenario comparisons:', error);
        throw error;
      }

      console.log('Scenario comparisons fetched:', data);
      return data || [];
    },
  });
};

// Hook to create/update scenario
export const useCreateUpdateScenario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      console.log('Creating/updating scenario:', data);
      
      // Prepare the scenario data
      const scenarioData = {
        id: data.id,
        name: data.name,
        description: data.description,
        scenario_type: data.scenario_type,
        probability: data.probability,
        assumptions: data.assumptions,
        time_horizon_months: data.time_horizon_months,
        confidence_level: data.confidence_level,
        external_factors: data.external_factors || [],
        is_active: data.is_active ?? true,
        created_by: data.created_by,
      };

      const { data: result, error } = await supabase
        .from('strategic_scenarios')
        .upsert(scenarioData)
        .select()
        .single();

      if (error) {
        console.error('Error saving scenario:', error);
        throw error;
      }

      console.log('Scenario saved successfully:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-scenarios'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-strategic-scenarios'] });
    },
  });
};

// Hook to create/update scenario parameters
export const useCreateUpdateScenarioParameter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      console.log('Creating/updating scenario parameter:', data);
      
      const parameterData = {
        id: data.id,
        scenario_id: data.scenario_id,
        parameter_name: data.parameter_name,
        parameter_type: data.parameter_type,
        base_value: data.base_value,
        min_value: data.min_value,
        max_value: data.max_value,
        unit: data.unit,
        description: data.description,
        sensitivity_weight: data.sensitivity_weight || 1.0,
      };

      const { data: result, error } = await supabase
        .from('strategic_scenario_parameters')
        .upsert(parameterData)
        .select()
        .single();

      if (error) {
        console.error('Error saving scenario parameter:', error);
        throw error;
      }

      console.log('Parameter saved successfully:', result);
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scenario-parameters', variables.scenario_id] });
    },
  });
};

// Hook to delete scenario parameter
export const useDeleteScenarioParameter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (parameterId: string) => {
      console.log('Deleting scenario parameter:', parameterId);
      
      const { error } = await supabase
        .from('strategic_scenario_parameters')
        .delete()
        .eq('id', parameterId);

      if (error) {
        console.error('Error deleting scenario parameter:', error);
        throw error;
      }

      console.log('Parameter deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenario-parameters'] });
    },
  });
};

// Hook to create/update scenario outcome
export const useCreateUpdateScenarioOutcome = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      console.log('Creating/updating scenario outcome:', data);
      
      const outcomeData = {
        id: data.id,
        scenario_id: data.scenario_id,
        metric_name: data.metric_name,
        value_change: data.value_change,
        impact_category_id: data.impact_category_id,
        confidence_score: data.confidence_score || 50,
        time_frame_months: data.time_frame_months || 12,
        baseline_value: data.baseline_value,
        notes: data.notes,
        calculation_method: data.calculation_method || 'manual',
      };

      const { data: result, error } = await supabase
        .from('strategic_scenario_outcomes')
        .upsert(outcomeData)
        .select()
        .single();

      if (error) {
        console.error('Error saving scenario outcome:', error);
        throw error;
      }

      console.log('Outcome saved successfully:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategic-scenarios'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-strategic-scenarios'] });
      queryClient.invalidateQueries({ queryKey: ['strategic-scenario-outcomes'] });
    },
  });
};

// Hook to fetch scenario outcomes for a specific scenario
export const useScenarioOutcomes = (scenarioId?: string) => {
  return useQuery({
    queryKey: ['scenario-outcomes', scenarioId],
    queryFn: async () => {
      if (!scenarioId) return [];
      
      console.log('Fetching scenario outcomes for:', scenarioId);
      const { data, error } = await supabase
        .from('strategic_scenario_outcomes')
        .select(`
          *,
          strategic_scenario_impact_categories(
            id,
            name,
            display_name,
            icon_name,
            color_class
          )
        `)
        .eq('scenario_id', scenarioId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching scenario outcomes:', error);
        throw error;
      }

      console.log('Scenario outcomes fetched:', data);
      return data || [];
    },
    enabled: !!scenarioId,
  });
};

// Hook to delete scenario outcome
export const useDeleteScenarioOutcome = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (outcomeId: string) => {
      console.log('Deleting scenario outcome:', outcomeId);
      
      const { error } = await supabase
        .from('strategic_scenario_outcomes')
        .delete()
        .eq('id', outcomeId);

      if (error) {
        console.error('Error deleting scenario outcome:', error);
        throw error;
      }

      console.log('Outcome deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenario-outcomes'] });
      queryClient.invalidateQueries({ queryKey: ['strategic-scenarios'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-strategic-scenarios'] });
    },
  });
};

// Hook to validate scenario parameters
export const useValidateScenarioParameters = () => {
  return useMutation({
    mutationFn: async (data: { scenarioId: string; parameters: any[] }) => {
      console.log('Validating scenario parameters:', data);
      
      // Perform validation logic
      const validationResults = data.parameters.map(param => {
        const errors = [];
        
        // Validate numeric parameters
        if (param.parameter_type === 'numeric' || param.parameter_type === 'percentage') {
          const baseValue = parseFloat(param.base_value);
          const minValue = param.min_value ? parseFloat(param.min_value) : null;
          const maxValue = param.max_value ? parseFloat(param.max_value) : null;
          
          if (isNaN(baseValue)) {
            errors.push('Base value must be a valid number');
          }
          
          if (minValue !== null && maxValue !== null && minValue >= maxValue) {
            errors.push('Minimum value must be less than maximum value');
          }
          
          if (minValue !== null && baseValue < minValue) {
            errors.push('Base value must be greater than or equal to minimum value');
          }
          
          if (maxValue !== null && baseValue > maxValue) {
            errors.push('Base value must be less than or equal to maximum value');
          }
        }
        
        return {
          parameterId: param.id,
          parameterName: param.parameter_name,
          isValid: errors.length === 0,
          errors
        };
      });
      
      return {
        isValid: validationResults.every(result => result.isValid),
        results: validationResults
      };
    },
  });
};
