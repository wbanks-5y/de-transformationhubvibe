import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface InitiativeHealth {
  id: string;
  name: string;
  status: string;
  progress_percentage: number;
  milestone_progress_percentage: number;
  resource_utilization_percentage: number;
  overdue_milestones: number;
  health_score: number;
}

export const useInitiativeHealthScores = () => {
  return useQuery({
    queryKey: ['initiative-health-scores'],
    queryFn: async (): Promise<InitiativeHealth[]> => {
      const { data, error } = await supabase.rpc('get_initiative_health_scores');

      if (error) {
        console.error('Error fetching initiative health scores:', error);
        throw error;
      }

      const items = (data || []) as any[];
      return items
        .map((row) => ({
          id: String(row.id),
          name: row.name,
          status: row.status,
          progress_percentage: Number(row.progress_percentage ?? 0),
          milestone_progress_percentage: Number(row.milestone_progress_percentage ?? 0),
          resource_utilization_percentage: Number(row.resource_utilization_percentage ?? 0),
          overdue_milestones: Number(row.overdue_milestones ?? 0),
          health_score: Number(row.health_score ?? 0),
        }))
        .sort((a, b) => b.health_score - a.health_score);
    },
  });
};

export const useInitiativeKpiLinks = (initiativeId?: string) => {
  return useQuery({
    queryKey: ['initiative-kpi-links', initiativeId],
    queryFn: async () => {
      let query = supabase
        .from('initiative_kpi_links')
        .select(`
          *,
          strategic_initiatives!inner(id, name),
          cockpit_kpis!inner(id, display_name, format_type, trend_direction)
        `);

      if (initiativeId) {
        query = query.eq('initiative_id', initiativeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching initiative KPI links:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!initiativeId || initiativeId === undefined,
  });
};

export const useMilestoneTemplates = () => {
  return useQuery({
    queryKey: ['milestone-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('milestone_templates')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching milestone templates:', error);
        throw error;
      }

      return data || [];
    },
  });
};