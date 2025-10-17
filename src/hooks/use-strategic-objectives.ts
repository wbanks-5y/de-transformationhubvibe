import { useQuery } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";

export const useStrategicObjectives = () => {
  const { organizationClient, currentOrganization } = useOrganization();
  
  return useQuery({
    queryKey: ['strategic-objectives', currentOrganization?.slug],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('Organization client not available');
      }
      
      console.log('Fetching strategic objectives...');
      const { data, error } = await organizationClient
        .from('strategic_objectives')
        .select(`
          *,
          strategic_objective_health(
            id,
            health_score,
            rag_status,
            period_start,
            period_end,
            notes
          ),
          strategic_initiatives!strategic_initiatives_objective_id_fkey(
            id,
            name,
            status,
            progress_percentage,
            priority,
            start_date,
            target_date,
            owner
          )
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching strategic objectives:', error);
        throw error;
      }

      console.log('Strategic objectives fetched:', data);
      return data || [];
    },
    enabled: !!organizationClient,
  });
};

export const useStrategicObjectiveById = (id: string) => {
  const { organizationClient } = useOrganization();
  
  return useQuery({
    queryKey: ['strategic-objective', id],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('Organization client not available');
      }
      
      console.log('Fetching strategic objective by id:', id);
      const { data, error } = await organizationClient
        .from('strategic_objectives')
        .select(`
          *,
          strategic_initiatives!strategic_initiatives_objective_id_fkey(
            id,
            name,
            status,
            progress_percentage,
            priority,
            start_date,
            target_date,
            owner
          ),
          strategic_objective_health(
            id,
            health_score,
            rag_status,
            period_start,
            period_end,
            notes
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching strategic objective:', error);
        throw error;
      }

      console.log('Strategic objective fetched:', data);
      return data;
    },
    enabled: !!id && !!organizationClient,
  });
};

export const useStrategicObjectiveDetails = (objectiveId: string) => {
  const { organizationClient } = useOrganization();
  
  return useQuery({
    queryKey: ['strategic-objective-details', objectiveId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('Organization client not available');
      }
      
      console.log('Fetching strategic objective details for:', objectiveId);
      const { data, error } = await organizationClient
        .from('strategic_objectives')
        .select(`
          *,
          strategic_objective_health(
            id,
            health_score,
            rag_status,
            period_start,
            period_end,
            notes
          ),
          strategic_objective_kpis(
            id,
            is_primary,
            weight,
            cockpit_kpis!strategic_objective_kpis_kpi_id_fkey(
              id,
              name,
              display_name,
              description,
              format_type,
              format_options,
              icon,
              color_class,
              kpi_data_type,
              trend_direction
            )
          ),
          strategic_initiatives!strategic_initiatives_objective_id_fkey(
            id,
            name,
            description,
            status,
            progress_percentage,
            priority,
            start_date,
            target_date,
            owner
          ),
          strategic_objective_processes(
            id,
            relevance_score,
            business_processes!strategic_objective_processes_process_id_fkey(
              id,
              name,
              display_name,
              description
            )
          )
        `)
        .eq('id', objectiveId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching strategic objective details:', error);
        throw error;
      }

      console.log('Strategic objective details fetched:', data);
      return data;
    },
    enabled: !!objectiveId && !!organizationClient,
  });
};

export const useStrategicObjectiveKPIs = (objectiveId: string) => {
  const { organizationClient } = useOrganization();
  
  return useQuery({
    queryKey: ['strategic-objective-kpis', objectiveId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('Organization client not available');
      }
      
      console.log('Fetching strategic objective KPIs for:', objectiveId);
      const { data, error } = await organizationClient
        .from('strategic_objective_kpis')
        .select(`
          *,
          cockpit_kpis!strategic_objective_kpis_kpi_id_fkey(
            id,
            name,
            display_name,
            manual_value,
            target_value,
            format_type,
            format_options,
            icon,
            color_class
          )
        `)
        .eq('objective_id', objectiveId);

      if (error) {
        console.error('Error fetching strategic objective KPIs:', error);
        throw error;
      }

      console.log('Strategic objective KPIs fetched:', data);
      return data || [];
    },
    enabled: !!objectiveId && !!organizationClient,
  });
};

export const useStrategicRisksOpportunities = (objectiveId?: string) => {
  const { organizationClient } = useOrganization();
  
  return useQuery({
    queryKey: ['strategic-risks-opportunities', objectiveId],
    queryFn: async () => {
      if (!organizationClient) {
        throw new Error('Organization client not available');
      }
      
      console.log('Fetching strategic risks and opportunities for:', objectiveId);
      
      let query = organizationClient
        .from('strategic_risks_opportunities')
        .select('*')
        .eq('is_active', true)
        .order('impact_level', { ascending: false });

      if (objectiveId) {
        query = query.eq('objective_id', objectiveId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching strategic risks and opportunities:', error);
        throw error;
      }

      console.log('Strategic risks and opportunities fetched:', data);
      return data || [];
    },
    enabled: !!organizationClient,
  });
};
