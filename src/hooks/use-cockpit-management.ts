
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { CockpitType } from '@/types/cockpit';
import { toast } from 'sonner';

export const useCreateCockpitType = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (data: Omit<CockpitType, 'id' | 'created_at' | 'updated_at'>) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Creating cockpit type:', data);
      const { data: result, error } = await organizationClient
        .from('cockpit_types')
        .insert(data)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating cockpit type:', error);
        throw error;
      }
      console.log('Cockpit type created:', result);
      return result;
    },
    onSuccess: () => {
      console.log('Create cockpit mutation successful, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['cockpit-types'] });
      toast.success("Cockpit created successfully");
    },
    onError: (error) => {
      console.error('Create cockpit error:', error);
      toast.error("Failed to create cockpit");
    }
  });
};

export const useUpdateCockpitType = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CockpitType> }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Updating cockpit type:', id, updates);
      const { data, error } = await organizationClient
        .from('cockpit_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating cockpit type:', error);
        throw error;
      }
      console.log('Cockpit type updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-types'] });
      toast.success("Cockpit updated successfully");
    },
    onError: (error) => {
      console.error('Update cockpit error:', error);
      toast.error("Failed to update cockpit");
    }
  });
};

export const useDeleteCockpitType = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Starting cascading deletion for cockpit type:', id);
      
      try {
        // Step 1: Get all KPIs for this cockpit
        console.log('Step 1: Fetching KPIs for cockpit:', id);
        const { data: kpis, error: kpiError } = await organizationClient
          .from('cockpit_kpis')
          .select('id')
          .eq('cockpit_type_id', id);
        
        if (kpiError) {
          console.error('Error fetching KPIs:', kpiError);
          throw new Error(`Failed to fetch KPIs: ${kpiError.message}`);
        }

        console.log(`Found ${kpis?.length || 0} KPIs to delete`);

        // Step 2: Delete all KPI-related data for each KPI
        if (kpis && kpis.length > 0) {
          const kpiIds = kpis.map(kpi => kpi.id);
          console.log('Step 2: Deleting KPI-related data for KPI IDs:', kpiIds);
          
          // Delete KPI values
          console.log('Deleting KPI values...');
          const { error: valuesError } = await organizationClient
            .from('cockpit_kpi_values')
            .delete()
            .in('kpi_id', kpiIds);
          
          if (valuesError) {
            console.error('Error deleting KPI values:', valuesError);
            throw new Error(`Failed to delete KPI values: ${valuesError.message}`);
          }
          console.log('KPI values deleted successfully');

          // Delete KPI targets
          console.log('Deleting KPI targets...');
          const { error: targetsError } = await organizationClient
            .from('cockpit_kpi_targets')
            .delete()
            .in('kpi_id', kpiIds);
          
          if (targetsError) {
            console.error('Error deleting KPI targets:', targetsError);
            throw new Error(`Failed to delete KPI targets: ${targetsError.message}`);
          }
          console.log('KPI targets deleted successfully');

          // Delete KPI time-based data
          console.log('Deleting KPI time-based data...');
          const { error: timeBasedError } = await organizationClient
            .from('cockpit_kpi_time_based')
            .delete()
            .in('kpi_id', kpiIds);
          
          if (timeBasedError) {
            console.error('Error deleting KPI time-based data:', timeBasedError);
            throw new Error(`Failed to delete KPI time-based data: ${timeBasedError.message}`);
          }
          console.log('KPI time-based data deleted successfully');

          // Delete the KPIs themselves
          console.log('Deleting KPIs...');
          const { error: kpisError } = await organizationClient
            .from('cockpit_kpis')
            .delete()
            .eq('cockpit_type_id', id);
          
          if (kpisError) {
            console.error('Error deleting KPIs:', kpisError);
            throw new Error(`Failed to delete KPIs: ${kpisError.message}`);
          }
          console.log('KPIs deleted successfully');
        }

        // Step 3: Delete cockpit insights
        console.log('Step 3: Deleting cockpit insights...');
        const { error: insightsError } = await organizationClient
          .from('cockpit_insights')
          .delete()
          .eq('cockpit_type_id', id);
        
        if (insightsError) {
          console.error('Error deleting cockpit insights:', insightsError);
          throw new Error(`Failed to delete cockpit insights: ${insightsError.message}`);
        }
        console.log('Cockpit insights deleted successfully');

        // Step 4: Delete cockpit sections
        console.log('Step 4: Deleting cockpit sections...');
        const { error: sectionsError } = await organizationClient
          .from('cockpit_sections')
          .delete()
          .eq('cockpit_type_id', id);
        
        if (sectionsError) {
          console.error('Error deleting cockpit sections:', sectionsError);
          throw new Error(`Failed to delete cockpit sections: ${sectionsError.message}`);
        }
        console.log('Cockpit sections deleted successfully');

        // Step 5: Delete cockpit filters
        console.log('Step 5: Deleting cockpit filters...');
        const { error: filtersError } = await organizationClient
          .from('cockpit_filters')
          .delete()
          .eq('cockpit_type_id', id);
        
        if (filtersError) {
          console.error('Error deleting cockpit filters:', filtersError);
          throw new Error(`Failed to delete cockpit filters: ${filtersError.message}`);
        }
        console.log('Cockpit filters deleted successfully');

        // Step 6: Finally delete the cockpit type itself
        console.log('Step 6: Deleting cockpit type...');
        const { error: cockpitError } = await organizationClient
          .from('cockpit_types')
          .delete()
          .eq('id', id);
        
        if (cockpitError) {
          console.error('Error deleting cockpit type:', cockpitError);
          throw new Error(`Failed to delete cockpit type: ${cockpitError.message}`);
        }
        
        console.log('Successfully deleted cockpit type and all related data:', id);
        return id;
      } catch (error) {
        console.error('Error in cascading deletion:', error);
        // Re-throw the error to be handled by the mutation's onError
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Delete mutation successful, invalidating queries...');
      // Simplified invalidation strategy - no delays or complex timing
      queryClient.invalidateQueries({ queryKey: ['cockpit-types'] });
      queryClient.invalidateQueries({ queryKey: ['cockpit-kpis'] });
      queryClient.invalidateQueries({ queryKey: ['cockpit-sections'] });
      queryClient.invalidateQueries({ queryKey: ['cockpit-insights'] });
      toast.success("Cockpit deleted successfully");
    },
    onError: (error) => {
      console.error('Delete cockpit mutation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to delete cockpit: ${errorMessage}`);
    }
  });
};

export const useToggleCockpitStatus = () => {
  const queryClient = useQueryClient();
  const { organizationClient } = useOrganization();
  
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      console.log('Toggling cockpit status:', id, isActive);
      const { data, error } = await organizationClient
        .from('cockpit_types')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error toggling cockpit status:', error);
        throw error;
      }
      console.log('Cockpit status toggled:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit-types'] });
      toast.success("Cockpit status updated");
    },
    onError: (error) => {
      console.error('Toggle status error:', error);
      toast.error("Failed to update cockpit status");
    }
  });
};
