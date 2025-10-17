import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface EnhancedScenarioRequest {
  scenarioType: 'economic_downturn' | 'market_expansion' | 'operational_efficiency' | 'competitive_pressure' | 'custom';
  customScenarioDescription?: string;
  timeframe: '3_months' | '6_months' | '12_months' | '24_months';
  companyProfile?: {
    name: string;
    industry: string;
    location: string;
    business_type: string;
    description?: string;
  };
}

export interface EnhancedScenarioResponse {
  success: boolean;
  companyProfile: any;
  baseline: any;
  marketIntelligence: any;
  scenarioAnalysis: any;
  recommendations: any;
  metadata: {
    cockpitCount: number;
    totalKpis: number;
    generatedAt: string;
    timeframe: string;
    scenarioType: string;
  };
}

export const useEnhancedScenarioIntelligence = () => {
  return useMutation({
    mutationFn: async (request: EnhancedScenarioRequest): Promise<EnhancedScenarioResponse> => {
      console.log('Generating enhanced scenario intelligence:', request);
      
      const { data, error } = await supabase.functions.invoke('enhanced-scenario-intelligence', {
        body: request
      });

      if (error) {
        console.error('Error calling enhanced scenario intelligence:', error);
        throw new Error(`Failed to generate scenario intelligence: ${error.message}`);
      }

      if (!data || !data.success) {
        throw new Error('Invalid response from scenario intelligence service');
      }

      return data as EnhancedScenarioResponse;
    },
    onSuccess: (data) => {
      toast.success(`Enhanced scenario analysis completed successfully! Analyzed ${data.metadata.totalKpis} KPIs across ${data.metadata.cockpitCount} cockpits.`);
    },
    onError: (error) => {
      console.error('Enhanced scenario intelligence error:', error);
      toast.error(`Failed to generate scenario intelligence: ${error.message}`);
    }
  });
};

export const getTimeframeLabel = (timeframe: string): string => {
  const labels = {
    '3_months': '3 Months',
    '6_months': '6 Months', 
    '12_months': '12 Months',
    '24_months': '24 Months'
  };
  return labels[timeframe] || timeframe;
};

export const getScenarioTypeLabel = (scenarioType: string): string => {
  const labels = {
    'economic_downturn': 'Economic Downturn',
    'market_expansion': 'Market Expansion',
    'operational_efficiency': 'Operational Efficiency',
    'competitive_pressure': 'Competitive Pressure',
    'custom': 'Custom Scenario'
  };
  return labels[scenarioType] || scenarioType;
};