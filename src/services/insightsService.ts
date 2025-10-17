
import { supabase } from '@/integrations/supabase/client';
import { MetricData } from '@/types/cockpit';

interface InsightGenerationParams {
  kpiData: any[];
  metricData: MetricData[];
  cockpitType: string;
}

interface GeneratedInsight {
  title: string;
  description: string;
  insight_type: 'positive' | 'negative' | 'neutral' | 'warning';
  priority: 'low' | 'medium' | 'high';
  confidence_score: number;
}

export const generateInsightsFromData = async (params: InsightGenerationParams): Promise<GeneratedInsight[]> => {
  const { kpiData, metricData, cockpitType } = params;
  
  console.log('Generating insights for:', cockpitType);
  console.log('KPI Data:', kpiData);
  console.log('Metric Data:', metricData);
  
  const insights: GeneratedInsight[] = [];
  
  try {
    // Analyze KPI performance
    if (kpiData && Array.isArray(kpiData)) {
      for (const kpi of kpiData) {
        if (kpi.current_value && kpi.target_value) {
          const performance = (kpi.current_value / kpi.target_value) * 100;
          
          if (performance >= 110) {
            insights.push({
              title: `${kpi.display_name} Exceeding Target`,
              description: `${kpi.display_name} is performing at ${performance.toFixed(1)}% of target, showing excellent results.`,
              insight_type: 'positive',
              priority: 'medium',
              confidence_score: 0.9
            });
          } else if (performance <= 80) {
            insights.push({
              title: `${kpi.display_name} Below Target`,
              description: `${kpi.display_name} is at ${performance.toFixed(1)}% of target. Consider reviewing strategies to improve performance.`,
              insight_type: 'negative',
              priority: 'high',
              confidence_score: 0.85
            });
          }
        }
      }
    }
    
    // Analyze metric trends
    if (metricData && Array.isArray(metricData) && metricData.length > 1) {
      const sortedData = metricData.sort((a, b) => 
        new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
      );
      
      const recent = sortedData.slice(-2);
      if (recent.length === 2) {
        const trend = ((recent[1].value - recent[0].value) / recent[0].value) * 100;
        
        if (Math.abs(trend) > 10) {
          insights.push({
            title: `Significant Trend Detected`,
            description: `Recent data shows a ${trend > 0 ? 'positive' : 'negative'} trend of ${Math.abs(trend).toFixed(1)}% in key metrics.`,
            insight_type: trend > 0 ? 'positive' : 'warning',
            priority: 'medium',
            confidence_score: 0.75
          });
        }
      }
    }
    
    // Add contextual insights based on cockpit type
    if (cockpitType) {
      insights.push(...generateContextualInsights(cockpitType, kpiData, metricData));
    }
    
  } catch (error) {
    console.error('Error generating insights:', error);
  }
  
  return insights.slice(0, 5); // Limit to 5 insights
};

const generateContextualInsights = (cockpitType: string, kpiData: any[], metricData: MetricData[]): GeneratedInsight[] => {
  const insights: GeneratedInsight[] = [];
  
  switch (cockpitType.toLowerCase()) {
    case 'sales':
      insights.push({
        title: 'Sales Performance Review',
        description: 'Regular review of sales metrics indicates stable performance with opportunities for growth in key segments.',
        insight_type: 'neutral',
        priority: 'low',
        confidence_score: 0.6
      });
      break;
      
    case 'finance':
      insights.push({
        title: 'Financial Health Check',
        description: 'Financial indicators suggest maintaining current trajectory while monitoring cash flow patterns.',
        insight_type: 'positive',
        priority: 'medium',
        confidence_score: 0.7
      });
      break;
      
    case 'operations':
      insights.push({
        title: 'Operational Efficiency',
        description: 'Current operational metrics show room for process optimization and efficiency improvements.',
        insight_type: 'warning',
        priority: 'medium',
        confidence_score: 0.65
      });
      break;
      
    default:
      insights.push({
        title: 'General Performance Overview',
        description: 'Overall performance metrics are within expected ranges. Continue monitoring for emerging trends.',
        insight_type: 'neutral',
        priority: 'low',
        confidence_score: 0.5
      });
  }
  
  return insights;
};

export const saveGeneratedInsights = async (insights: GeneratedInsight[], cockpitTypeId: string) => {
  try {
    const insightsToSave = insights.map(insight => ({
      cockpit_type_id: cockpitTypeId,
      title: insight.title,
      description: insight.description,
      insight_type: insight.insight_type,
      priority: insight.priority,
      confidence_score: insight.confidence_score,
      insight_category: 'generated',
      is_active: true,
      generated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('cockpit_insights')
      .insert(insightsToSave)
      .select();

    if (error) throw error;
    
    console.log('Successfully saved insights:', data);
    return data;
  } catch (error) {
    console.error('Error saving insights:', error);
    throw error;
  }
};
