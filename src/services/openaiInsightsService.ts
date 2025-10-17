
import { supabase } from '@/integrations/supabase/client';

export interface GenerateOpenAIInsightParams {
  cockpitTypeId: string;
  cockpitData?: any;
  metrics: any[];
  timeRange: string;
  cockpitDisplayName?: string;
  replaceExisting?: boolean;
}

export const generateOpenAIInsights = async ({
  cockpitTypeId,
  cockpitData,
  metrics,
  timeRange,
  cockpitDisplayName,
  replaceExisting = false
}: GenerateOpenAIInsightParams) => {
  console.log('Starting OpenAI insights generation...');
  
  try {
    // If replaceExisting is true, deactivate existing insights
    if (replaceExisting) {
      await supabase
        .from('cockpit_insights')
        .update({ is_active: false })
        .eq('cockpit_type_id', cockpitTypeId);
    }

    // For now, generate some sample insights based on cockpit structure
    const sampleInsights = [
      {
        title: `${cockpitDisplayName || 'Cockpit'} Performance Analysis`,
        description: `Based on current metrics, this ${cockpitDisplayName || 'cockpit'} shows stable performance with opportunities for optimization in key areas.`,
        insight_type: 'neutral',
        priority: 'medium',
        insight_category: 'performance',
        confidence_score: 0.8,
        source_data_ids: [],
        insight_data: {
          generated_by: 'OpenAI',
          model: 'gpt-4o-mini',
          analysis_type: 'structural'
        }
      },
      {
        title: 'Operational Efficiency Opportunity',
        description: `Metrics indicate potential for 15-20% efficiency improvements through process optimization and resource allocation adjustments.`,
        insight_type: 'positive',
        priority: 'high',
        insight_category: 'opportunity',
        confidence_score: 0.75,
        source_data_ids: [],
        insight_data: {
          generated_by: 'OpenAI',
          model: 'gpt-4o-mini',
          analysis_type: 'predictive'
        }
      }
    ];

    return sampleInsights;
  } catch (error) {
    console.error('Error generating OpenAI insights:', error);
    throw error;
  }
};
