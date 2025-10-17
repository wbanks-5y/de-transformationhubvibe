import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CockpitData {
  id: string;
  name: string;
  display_name: string;
  kpis: Array<{
    id: string;
    name: string;
    display_name: string;
    current_value?: number;
    target_value?: number;
    trend_direction: string;
    format_type: string;
    weight?: number;
  }>;
}

interface CompanyProfile {
  name: string;
  industry: string;
  location: string;
  business_type: string;
  description?: string;
}

interface ScenarioRequest {
  companyProfile?: CompanyProfile;
  cockpitData: CockpitData[];
  scenarioType: 'economic_downturn' | 'market_expansion' | 'operational_efficiency' | 'competitive_pressure' | 'custom';
  customScenarioDescription?: string;
  timeframe: '3_months' | '6_months' | '12_months' | '24_months';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey || !openaiApiKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { scenarioType, customScenarioDescription, timeframe, companyProfile } = await req.json() as ScenarioRequest;

    console.log('Processing enhanced scenario intelligence request:', { scenarioType, timeframe });

    // Step 1: Fetch all active cockpit data dynamically
    const cockpitData = await fetchDynamicCockpitData(supabase);
    console.log('Fetched cockpit data:', cockpitData.length, 'cockpits');

    // Step 2: Extract company profile if not provided
    const profile = companyProfile || await extractCompanyProfile(cockpitData);
    console.log('Company profile:', profile);

    // Step 3: Generate market intelligence using OpenAI
    const marketIntelligence = await generateMarketIntelligence(openaiApiKey, profile, scenarioType, customScenarioDescription);
    console.log('Generated market intelligence');

    // Step 4: Create baseline from real data
    const baseline = createDataBaseline(cockpitData);
    console.log('Created baseline from real data');

    // Step 5: Generate scenario impacts using AI
    const scenarioAnalysis = await generateScenarioImpacts(
      openaiApiKey, 
      baseline, 
      marketIntelligence, 
      scenarioType, 
      customScenarioDescription,
      timeframe
    );

    // Step 6: Create actionable recommendations
    const recommendations = await generateActionableRecommendations(
      openaiApiKey,
      scenarioAnalysis,
      baseline,
      profile,
      timeframe
    );

    const response = {
      success: true,
      companyProfile: profile,
      baseline,
      marketIntelligence,
      scenarioAnalysis,
      recommendations,
      metadata: {
        cockpitCount: cockpitData.length,
        totalKpis: cockpitData.reduce((sum, cockpit) => sum + cockpit.kpis.length, 0),
        generatedAt: new Date().toISOString(),
        timeframe,
        scenarioType
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced-scenario-intelligence:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchDynamicCockpitData(supabase: any): Promise<CockpitData[]> {
  // Fetch all active cockpit types
  const { data: cockpitTypes, error: typesError } = await supabase
    .from('cockpit_types')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (typesError) throw typesError;

  const cockpitData: CockpitData[] = [];

  for (const cockpitType of cockpitTypes) {
    // Fetch KPIs for this cockpit
    const { data: kpis, error: kpisError } = await supabase
      .from('cockpit_kpis')
      .select('*')
      .eq('cockpit_type_id', cockpitType.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (kpisError) {
      console.warn(`Error fetching KPIs for cockpit ${cockpitType.name}:`, kpisError);
      continue;
    }

    const enrichedKpis = [];
    
    for (const kpi of kpis) {
      let currentValue = null;
      let targetValue = null;

      // Fetch current value based on KPI data type
      if (kpi.kpi_data_type === 'single') {
        const { data: valueData } = await supabase
          .from('cockpit_kpi_values')
          .select('current_value')
          .eq('kpi_id', kpi.id)
          .order('recorded_at', { ascending: false })
          .limit(1);
        
        currentValue = valueData?.[0]?.current_value || null;
      } else if (kpi.kpi_data_type === 'time_based') {
        const { data: timeData } = await supabase
          .from('cockpit_kpi_time_based')
          .select('actual_value')
          .eq('kpi_id', kpi.id)
          .order('period_start', { ascending: false })
          .limit(1);
        
        currentValue = timeData?.[0]?.actual_value || null;
      }

      // Fetch target value
      const { data: targetData } = await supabase
        .from('cockpit_kpi_targets')
        .select('target_value')
        .eq('kpi_id', kpi.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      targetValue = targetData?.[0]?.target_value || null;

      enrichedKpis.push({
        id: kpi.id,
        name: kpi.name,
        display_name: kpi.display_name,
        current_value: currentValue,
        target_value: targetValue,
        trend_direction: kpi.trend_direction,
        format_type: kpi.format_type,
        weight: kpi.weight || 1
      });
    }

    cockpitData.push({
      id: cockpitType.id,
      name: cockpitType.name,
      display_name: cockpitType.display_name,
      kpis: enrichedKpis
    });
  }

  return cockpitData;
}

function extractCompanyProfile(cockpitData: CockpitData[]): CompanyProfile {
  // Extract basic company profile from available data
  return {
    name: "Precision Industries", // Could be extracted from settings or user data
    industry: "Manufacturing", // Could be inferred from cockpit types
    location: "Detroit, MI", // Could be from user profile
    business_type: "B2B", // Could be inferred from sales patterns
    description: "Manufacturing company with focus on precision components"
  };
}

async function generateMarketIntelligence(
  apiKey: string, 
  profile: CompanyProfile, 
  scenarioType: string,
  customDescription?: string
): Promise<any> {
  const prompt = `Provide market intelligence analysis for ${profile.name}, a ${profile.business_type} ${profile.industry} company located in ${profile.location}.

Scenario focus: ${scenarioType}${customDescription ? ` - ${customDescription}` : ''}

Please provide:
1. Industry trends affecting ${profile.industry} sector
2. Economic factors impacting this business type
3. Competitive landscape considerations
4. Market opportunities and threats
5. Sector-specific risk factors

Keep the response concise and actionable, focusing on factors that would impact business KPIs. Format as JSON with sections: industry_trends, economic_factors, competitive_landscape, opportunities, threats, risk_factors.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a business intelligence analyst providing concise market insights. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch {
    // Fallback if JSON parsing fails
    return {
      industry_trends: [content.substring(0, 200)],
      economic_factors: ["Market conditions vary"],
      competitive_landscape: ["Competitive environment analysis needed"],
      opportunities: ["Market opportunities to explore"],
      threats: ["Market threats to monitor"],
      risk_factors: ["Standard industry risks"]
    };
  }
}

function createDataBaseline(cockpitData: CockpitData[]): any {
  const baseline = {
    total_cockpits: cockpitData.length,
    total_kpis: 0,
    kpis_with_data: 0,
    kpis_with_targets: 0,
    average_target_achievement: 0,
    cockpit_summary: [] as any[],
    key_metrics: {} as any
  };

  let totalAchievement = 0;
  let achievementCount = 0;

  for (const cockpit of cockpitData) {
    baseline.total_kpis += cockpit.kpis.length;
    
    const cockpitSummary = {
      name: cockpit.display_name,
      kpi_count: cockpit.kpis.length,
      kpis_with_data: 0,
      kpis_with_targets: 0,
      performance_score: 0
    };

    let cockpitPerformance = 0;
    let cockpitPerformanceCount = 0;

    for (const kpi of cockpit.kpis) {
      if (kpi.current_value !== null) {
        baseline.kpis_with_data++;
        cockpitSummary.kpis_with_data++;
        
        // Store key metrics
        baseline.key_metrics[`${cockpit.name}_${kpi.name}`] = {
          current_value: kpi.current_value,
          target_value: kpi.target_value,
          format_type: kpi.format_type,
          trend_direction: kpi.trend_direction
        };
      }

      if (kpi.target_value !== null) {
        baseline.kpis_with_targets++;
        cockpitSummary.kpis_with_targets++;

        if (kpi.current_value !== null && kpi.target_value && kpi.target_value > 0 && kpi.current_value !== undefined) {
          const achievement = kpi.trend_direction === 'lower_is_better' 
            ? Math.min((kpi.target_value / kpi.current_value) * 100, 100)
            : Math.min((kpi.current_value / kpi.target_value) * 100, 100);
          
          totalAchievement += achievement;
          achievementCount++;
          cockpitPerformance += achievement;
          cockpitPerformanceCount++;
        }
      }
    }

    cockpitSummary.performance_score = cockpitPerformanceCount > 0 
      ? Math.round(cockpitPerformance / cockpitPerformanceCount) 
      : 0;

    baseline.cockpit_summary.push(cockpitSummary);
  }

  baseline.average_target_achievement = achievementCount > 0 
    ? Math.round(totalAchievement / achievementCount) 
    : 0;

  return baseline;
}

async function generateScenarioImpacts(
  apiKey: string,
  baseline: any,
  marketIntelligence: any,
  scenarioType: string,
  customDescription: string | undefined,
  timeframe: string
): Promise<any> {
  const prompt = `Based on the following business baseline and market intelligence, generate realistic scenario impact projections.

BASELINE DATA:
- Total KPIs: ${baseline.total_kpis}
- Average target achievement: ${baseline.average_target_achievement}%
- Cockpit performance summary: ${JSON.stringify(baseline.cockpit_summary)}

MARKET INTELLIGENCE:
${JSON.stringify(marketIntelligence)}

SCENARIO: ${scenarioType}${customDescription ? ` - ${customDescription}` : ''}
TIMEFRAME: ${timeframe}

Generate specific impact percentages for each cockpit area and key metrics. Consider:
1. Realistic progression over the timeframe
2. Cross-cockpit dependencies (how changes in one area affect others)
3. Industry-specific factors from market intelligence
4. Recovery patterns and adaptation phases

Provide response as JSON with:
- scenario_name: descriptive name
- probability: estimated probability (0-100)
- impact_timeline: month-by-month progression
- cockpit_impacts: specific impacts for each cockpit
- key_assumptions: underlying assumptions
- confidence_level: confidence in projections (0-100)`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a business analyst specializing in scenario modeling. Provide realistic, data-driven projections in valid JSON format.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 1500
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch {
    // Fallback scenario
    return {
      scenario_name: `${scenarioType} Impact Analysis`,
      probability: 65,
      impact_timeline: ["Initial impact", "Adaptation phase", "Stabilization"],
      cockpit_impacts: baseline.cockpit_summary.map((c: any) => ({
        name: c.name,
        impact_percentage: scenarioType.includes('downturn') ? -15 : 10
      })),
      key_assumptions: ["Standard market conditions", "Normal operational response"],
      confidence_level: 70
    };
  }
}

async function generateActionableRecommendations(
  apiKey: string,
  scenarioAnalysis: any,
  baseline: any,
  profile: CompanyProfile,
  timeframe: string
): Promise<any> {
  const prompt = `Generate actionable business recommendations for ${profile.name} based on the scenario analysis.

SCENARIO: ${JSON.stringify(scenarioAnalysis)}
BASELINE PERFORMANCE: ${baseline.average_target_achievement}% target achievement
COMPANY TYPE: ${profile.business_type} ${profile.industry} company
TIMEFRAME: ${timeframe}

Provide specific, actionable recommendations including:
1. Immediate actions (0-30 days)
2. Short-term initiatives (1-3 months)
3. Long-term strategies (3+ months)
4. Risk mitigation steps
5. Key performance indicators to monitor
6. Resource allocation suggestions

Format as JSON with sections: immediate_actions, short_term_initiatives, long_term_strategies, risk_mitigation, kpis_to_monitor, resource_allocation, success_metrics.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a strategic business consultant providing actionable recommendations. Respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1200
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch {
    return {
      immediate_actions: ["Monitor key metrics closely", "Assess current performance"],
      short_term_initiatives: ["Optimize operational efficiency", "Review strategic priorities"],
      long_term_strategies: ["Develop resilience capabilities", "Explore growth opportunities"],
      risk_mitigation: ["Diversify revenue streams", "Build contingency plans"],
      kpis_to_monitor: ["Revenue trends", "Operational metrics", "Market indicators"],
      resource_allocation: ["Focus on core competencies", "Invest in critical capabilities"],
      success_metrics: ["Performance improvement", "Target achievement", "Market position"]
    };
  }
}