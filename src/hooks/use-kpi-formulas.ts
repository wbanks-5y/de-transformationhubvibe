
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the formula type based on the actual database schema
export interface CockpitKPIFormula {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  category: string;
  formula_template: string;
  parameter_schema: any;
  example_usage?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useKPIFormulas = () => {
  return useQuery({
    queryKey: ['kpi-formulas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cockpit_kpi_formulas')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as CockpitKPIFormula[];
    },
  });
};

export const useCreateKPIFormula = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<CockpitKPIFormula, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('cockpit_kpi_formulas')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-formulas'] });
      toast.success('KPI formula created successfully');
    },
    onError: (error) => {
      console.error('Create KPI formula error:', error);
      toast.error('Failed to create KPI formula');
    }
  });
};
