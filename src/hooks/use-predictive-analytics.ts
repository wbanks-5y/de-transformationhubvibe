import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';

export interface PredictiveInsight {
  initiative_id: string;
  initiative_name: string;
  predicted_completion_date: string;
  completion_probability: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  velocity_trend: 'improving' | 'declining' | 'stable';
  budget_forecast: number;
  potential_delays: string[];
  recommendations: string[];
}

export const usePredictiveAnalytics = () => {
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['predictive-analytics'],
    queryFn: async (): Promise<PredictiveInsight[]> => {
      if (!organizationClient) {
        throw new Error('No organization client available');
      }
      try {
        // Get initiatives with milestones and resources
        const { data: initiatives, error: initiativesError } = await organizationClient
          .from('strategic_initiatives')
          .select(`
            *,
            strategic_initiative_milestones!strategic_initiative_milestones_initiative_id_fkey(*),
            strategic_resource_allocations!strategic_resource_allocations_initiative_id_fkey(*)
          `)
          .eq('is_active', true);

        if (initiativesError) {
          console.error('Initiatives query error:', initiativesError);
          throw initiativesError;
        }
        
        console.log('Predictive Analytics Data:', {
          initiativesCount: initiatives?.length || 0,
          hasData: !!initiatives,
          firstInitiative: initiatives?.[0] ? {
            name: initiatives[0].name,
            milestones: initiatives[0].strategic_initiative_milestones?.length || 0
          } : null
        });
        
        if (!initiatives || initiatives.length === 0) {
          console.log('No initiatives found, returning empty array');
          return [];
        }

        // Calculate predictive insights for each initiative
        const insights: PredictiveInsight[] = [];
        
        for (const initiative of initiatives) {
          const milestones = initiative.strategic_initiative_milestones || [];
          const resources = initiative.strategic_resource_allocations || [];
          
          // Always generate an insight for every initiative
          const completedMilestones = milestones.filter(m => m.status === 'completed');
          const totalMilestones = milestones.length;
          const completionRate = totalMilestones > 0 ? completedMilestones.length / totalMilestones : 0;
          
          // Calculate remaining milestones and estimated completion
          const remainingMilestones = milestones.filter(m => m.status !== 'completed');
          const avgDuration = milestones.length > 0 
            ? milestones.reduce((sum, m) => sum + (m.estimated_duration_days || 7), 0) / milestones.length
            : 7;
          
          const daysToComplete = remainingMilestones.length * avgDuration;
          const predictedDate = new Date();
          predictedDate.setDate(predictedDate.getDate() + daysToComplete);
          
          // Calculate completion probability
          const overdueMilestones = milestones.filter(m => 
            m.target_date && new Date(m.target_date) < new Date() && m.status !== 'completed'
          ).length;
          
          let completionProbability = 50; // Base probability
          if (totalMilestones > 0) {
            completionProbability = Math.max(10, Math.min(95, 
              (completionRate * 60) + (overdueMilestones === 0 ? 30 : -20) + 10
            ));
          }
          
          // Determine risk level
          let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
          if (overdueMilestones > 2 || completionProbability < 30) riskLevel = 'critical';
          else if (overdueMilestones > 0 || completionProbability < 50) riskLevel = 'high';
          else if (completionProbability < 70) riskLevel = 'medium';
          
          // Calculate budget forecast
          const totalBudget = resources.reduce((sum, r) => sum + (r.allocated_amount || 0), 0);
          const budgetForecast = totalBudget > 0 ? totalBudget : (initiative.budget_allocated || 0);
          
          // Generate recommendations
          const recommendations: string[] = [];
          const potentialDelays: string[] = [];
          
          if (milestones.length === 0) {
            recommendations.push('Add milestones to track progress');
            potentialDelays.push('No milestones defined');
          }
          if (overdueMilestones > 0) {
            recommendations.push('Address overdue milestones');
            potentialDelays.push(`${overdueMilestones} milestones overdue`);
          }
          if (completionRate < 0.3) {
            recommendations.push('Review project scope and timeline');
          }
          
          insights.push({
            initiative_id: initiative.id,
            initiative_name: initiative.name,
            predicted_completion_date: predictedDate.toISOString().split('T')[0],
            completion_probability: Math.round(completionProbability),
            risk_level: riskLevel,
            velocity_trend: 'stable',
            budget_forecast: Math.round(budgetForecast),
            potential_delays: potentialDelays,
            recommendations: recommendations.length > 0 ? recommendations : ['Continue current execution plan']
          });
        }

        return insights;
      } catch (error) {
        console.error('Predictive analytics error:', error);
        return [];
      }
    },
    enabled: !!organizationClient,
  });
};