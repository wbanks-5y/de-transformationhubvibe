
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
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
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['kpi-formulas'],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data, error } = await organizationClient
        .from('cockpit_kpi_formulas')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as CockpitKPIFormula[];
    },
    enabled: !!organizationClient,
  });
};

export const useCreateKPIFormula = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (data: Omit<CockpitKPIFormula, 'id' | 'created_at' | 'updated_at'>) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      const { data: result, error } = await organizationClient
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
