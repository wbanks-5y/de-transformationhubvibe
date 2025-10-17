/**
 * Fetches real business data from the database for Myles AI context
 * Enhanced with business intelligence capabilities
 */

import { BusinessIntelligenceEngine } from "./businessIntelligence.ts";

export async function fetchRelevantBusinessData(supabase: any, userId?: string, moduleContext?: string) {
  try {
    console.log('Fetching real business data from database...');
    let contextData = [];
    
    // Always fetch core business context
    const coreContext = await fetchCoreBusinessContext(supabase);
    contextData.push(coreContext);
    
    // If module context is provided, prioritize that data
    if (moduleContext?.toLowerCase()) {
      const moduleContextLower = moduleContext.toLowerCase();
      
      // Cockpit data
      if (moduleContextLower.includes('warehouse') || 
          moduleContextLower.includes('credit') || 
          moduleContextLower.includes('project') || 
          moduleContextLower.includes('supply') || 
          moduleContextLower.includes('sales') || 
          moduleContextLower.includes('manufacturing') || 
          moduleContextLower.includes('logistics') || 
          moduleContextLower.includes('cash') || 
          moduleContextLower.includes('bank') || 
          moduleContextLower.includes('finance') || 
          moduleContextLower.includes('procurement') || 
          moduleContextLower.includes('service')) {
        
        const cockpitData = await fetchCockpitData(supabase, moduleContextLower);
        if (cockpitData) contextData.push(cockpitData);
      }
      
      // Process intelligence data
      else if (moduleContextLower.includes('process') || moduleContextLower.includes('intelligence')) {
        const processData = await fetchProcessIntelligenceData(supabase);
        if (processData) contextData.push(processData);
      }
      
      // Business health/strategy data
      else if (moduleContextLower.includes('health') || moduleContextLower.includes('strategy') || moduleContextLower.includes('objective')) {
        const healthData = await fetchBusinessHealthData(supabase);
        if (healthData) contextData.push(healthData);
      }
      
      // Analyst insights
      else if (moduleContextLower.includes('insight') || moduleContextLower.includes('analyst')) {
        const insightsData = await fetchAnalystInsights(supabase);
        if (insightsData) contextData.push(insightsData);
      }
    } else {
      // No specific module context, fetch overview data from all areas
      const overviewData = await fetchOverviewData(supabase);
      contextData.push(overviewData);
    }
    
    // If user ID is provided, fetch user-specific context and enhanced intelligence
    let userRole: string | undefined;
    if (userId) {
      const userContext = await fetchUserContext(supabase, userId);
      if (userContext) {
        contextData.push(userContext);
        // Extract user role for enhanced intelligence
        const roleMatch = userContext.match(/Role: ([^\n]+)/);
        userRole = roleMatch ? roleMatch[1] : undefined;
      }
    }

    // Generate enhanced business intelligence
    try {
      const biEngine = new BusinessIntelligenceEngine(supabase);
      const businessIntelligence = await biEngine.generateBusinessIntelligence(userRole, moduleContext);
      if (businessIntelligence) {
        contextData.push('\n' + businessIntelligence);
      }
    } catch (error) {
      console.error('Error generating business intelligence:', error);
    }
    
    const result = contextData.filter(data => data).join('\n\n');
    console.log(`Enhanced business data fetched, total length: ${result.length} characters`);
    return result;
  } catch (error) {
    console.error('Error fetching business context data:', error);
    return "Note: I'm currently unable to retrieve specific business data for context, but I can still try to help with general business analysis.";
  }
}

async function fetchCoreBusinessContext(supabase: any) {
  try {
    // Fetch company profile
    const { data: companyProfile } = await supabase
      .from('company_profile')
      .select('*')
      .single();
    
    if (companyProfile) {
      return `
COMPANY PROFILE:
- Company: ${companyProfile.company_name || 'Not specified'}
- Industry: ${companyProfile.industry || 'Not specified'}
- Size: ${companyProfile.company_size || 'Not specified'}
- Mission: ${companyProfile.mission_statement || 'Not specified'}
- Key Markets: ${companyProfile.key_markets || 'Not specified'}
- Strategic Priorities: ${companyProfile.strategic_priorities || 'Not specified'}
      `;
    }
  } catch (error) {
    console.error('Error fetching company profile:', error);
  }
  
  return '';
}

async function fetchCockpitData(supabase: any, moduleContext: string) {
  try {
    console.log(`Fetching cockpit data for context: ${moduleContext}`);
    
    // Map module context to cockpit types
    const cockpitMapping: { [key: string]: string } = {
      'warehouse': 'warehouse',
      'credit': 'credit_control',
      'project': 'projects',
      'supply': 'supply_chain',
      'sales': 'sales',
      'manufacturing': 'manufacturing',
      'logistics': 'logistics',
      'cash': 'cash_bank',
      'bank': 'cash_bank',
      'finance': 'finance',
      'procurement': 'procurement',
      'service': 'field_service'
    };
    
    const cockpitName = Object.keys(cockpitMapping).find(key => 
      moduleContext.includes(key)
    );
    
    if (!cockpitName) return '';
    
    const cockpitType = cockpitMapping[cockpitName];
    
    // Fetch cockpit type
    const { data: cockpitTypeData } = await supabase
      .from('cockpit_types')
      .select('*')
      .eq('name', cockpitType)
      .single();
    
    if (!cockpitTypeData) return '';
    
    // Fetch KPIs for this cockpit
    const { data: kpis } = await supabase
      .from('cockpit_kpis')
      .select('*')
      .eq('cockpit_type_id', cockpitTypeData.id)
      .eq('is_active', true)
      .order('sort_order');
    
    // Fetch sections and metrics with actual data
    const { data: sections } = await supabase
      .from('cockpit_sections')
      .select(`
        *,
        metric_base (
          *,
          metric_single_value (*),
          metric_multi_value (
            *,
            metric_multi_value_data (*)
          ),
          metric_time_based (
            *,
            metric_time_based_data (*)
          )
        )
      `)
      .eq('cockpit_type_id', cockpitTypeData.id)
      .eq('is_active', true);
    
    // Fetch insights for this cockpit
    const { data: insights } = await supabase
      .from('cockpit_insights')
      .select('*')
      .eq('cockpit_type_id', cockpitTypeData.id)
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(5);
    
    let cockpitData = `
${cockpitTypeData.display_name.toUpperCase()} COCKPIT:
Description: ${cockpitTypeData.description}

KEY PERFORMANCE INDICATORS:`;
    
    if (kpis && kpis.length > 0) {
      kpis.forEach((kpi: any) => {
        cockpitData += `
- ${kpi.display_name}: ${kpi.manual_value || 'No current value'} ${kpi.target_value ? `(Target: ${kpi.target_value})` : ''}`;
      });
    } else {
      cockpitData += '\n- No KPIs currently configured';
    }
    
    cockpitData += '\n\nSECTIONS & METRICS:';
    if (sections && sections.length > 0) {
      sections.forEach((section: any) => {
        cockpitData += `\n- ${section.display_name}: ${section.description || 'No description'}`;
        if (section.metric_base && section.metric_base.length > 0) {
          section.metric_base.forEach((metric: any) => {
            cockpitData += `\n  • ${metric.display_name}: `;
            
            // Process single value metrics
            if (metric.metric_single_value && metric.metric_single_value.length > 0) {
              const singleValue = metric.metric_single_value[0];
              if (singleValue.actual_value !== null && singleValue.actual_value !== undefined) {
                const formattedValue = formatMetricValue(singleValue.actual_value, singleValue.metric_type);
                cockpitData += `${formattedValue}`;
                
                if (singleValue.target_value) {
                  const targetFormatted = formatMetricValue(singleValue.target_value, singleValue.metric_type);
                  const achievement = Math.round((singleValue.actual_value / singleValue.target_value) * 100);
                  cockpitData += ` (Target: ${targetFormatted}, Achievement: ${achievement}%)`;
                }
                
                if (singleValue.trend) {
                  const trendText = singleValue.trend === 'up' ? '↗️ trending up' : 
                                  singleValue.trend === 'down' ? '↘️ trending down' : '→ stable';
                  cockpitData += ` - ${trendText}`;
                }
              } else {
                cockpitData += 'No current data available';
              }
            }
            
            // Process time-based metrics  
            else if (metric.metric_time_based && metric.metric_time_based.length > 0) {
              const timeBased = metric.metric_time_based[0];
              if (timeBased.metric_time_based_data && timeBased.metric_time_based_data.length > 0) {
                // Sort by date to get most recent values
                const sortedData = timeBased.metric_time_based_data.sort((a: any, b: any) => {
                  const dateA = new Date(a.year, (a.month || 1) - 1, a.day || 1);
                  const dateB = new Date(b.year, (b.month || 1) - 1, b.day || 1);
                  return dateB.getTime() - dateA.getTime();
                });
                
                const recentData = sortedData.slice(0, 3);
                const currentValue = recentData[0];
                const oldestValue = sortedData[sortedData.length - 1];
                
                cockpitData += `Current: ${formatMetricValue(currentValue.value, 'currency')}`;
                
                // Add trend analysis if we have multiple data points
                if (recentData.length > 1) {
                  const previousValue = recentData[1];
                  const change = currentValue.value - previousValue.value;
                  const percentChange = Math.round((change / previousValue.value) * 100);
                  
                  if (percentChange > 0) {
                    cockpitData += ` (↗️ +${percentChange}% from previous period)`;
                  } else if (percentChange < 0) {
                    cockpitData += ` (↘️ ${percentChange}% from previous period)`;
                  } else {
                    cockpitData += ` (→ unchanged from previous period)`;
                  }
                }
                
                // Add time period context
                const period = currentValue.month ? `${currentValue.year}-${String(currentValue.month).padStart(2, '0')}` : 
                             currentValue.quarter ? `Q${currentValue.quarter} ${currentValue.year}` :
                             `${currentValue.year}`;
                cockpitData += ` (${period})`;
                
                // CRITICAL FOR PLOTTING: Add detailed time-series context
                cockpitData += `\n    📊 CHART DATA AVAILABLE: This metric has ${sortedData.length} historical data points suitable for plotting/visualization`;
                
                // Date range info
                const oldestPeriod = oldestValue.month ? `${oldestValue.year}-${String(oldestValue.month).padStart(2, '0')}` : 
                                   oldestValue.quarter ? `Q${oldestValue.quarter} ${oldestValue.year}` :
                                   `${oldestValue.year}`;
                cockpitData += `\n    📅 Data Range: ${oldestPeriod} to ${period} (${sortedData.length} periods)`;
                
                // Sample data points for context
                cockpitData += `\n    📈 Sample Historical Values:`;
                recentData.forEach((dataPoint: any, index: number) => {
                  const datePeriod = dataPoint.month ? `${dataPoint.year}-${String(dataPoint.month).padStart(2, '0')}` : 
                                   dataPoint.quarter ? `Q${dataPoint.quarter} ${dataPoint.year}` :
                                   `${dataPoint.year}`;
                  cockpitData += `\n      • ${datePeriod}: ${formatMetricValue(dataPoint.value, 'currency')}`;
                });
                
                if (sortedData.length > 3) {
                  cockpitData += `\n      • ... and ${sortedData.length - 3} more data points`;
                }
                
                cockpitData += `\n    💡 This data can be visualized as line charts, bar charts, or trend analysis graphs`;
              } else {
                cockpitData += 'No historical data available';
              }
            }
            
            // Process multi-value metrics
            else if (metric.metric_multi_value && metric.metric_multi_value.length > 0) {
              const multiValue = metric.metric_multi_value[0];
              if (multiValue.metric_multi_value_data && multiValue.metric_multi_value_data.length > 0) {
                const data = multiValue.metric_multi_value_data.sort((a: any, b: any) => b.y_axis_value - a.y_axis_value);
                const topValues = data.slice(0, 3);
                
                cockpitData += 'Top values: ';
                topValues.forEach((item: any, index: number) => {
                  if (index > 0) cockpitData += ', ';
                  cockpitData += `${item.x_axis_value}: ${formatMetricValue(item.y_axis_value, 'number')}`;
                });
              } else {
                cockpitData += 'No data points available';
              }
            }
            
            else {
              cockpitData += `${metric.description || 'No data available'}`;
            }
          });
        }
      });
    } else {
      cockpitData += '\n- No sections currently configured';
    }
    
    if (insights && insights.length > 0) {
      cockpitData += '\n\nRECENT INSIGHTS:';
      insights.forEach((insight: any) => {
        cockpitData += `\n- [${insight.priority.toUpperCase()}] ${insight.title}: ${insight.description}`;
      });
    }
    
    return cockpitData;
    
  } catch (error) {
    console.error('Error fetching cockpit data:', error);
    return '';
  }
}

// Helper function to format metric values
function formatMetricValue(value: number, type: string): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    case 'percentage':
      return `${Math.round(value * 100) / 100}%`;
    case 'number':
    default:
      if (value >= 1000000) {
        return `${Math.round(value / 1000000 * 10) / 10}M`;
      } else if (value >= 1000) {
        return `${Math.round(value / 1000 * 10) / 10}K`;
      }
      return String(Math.round(value * 100) / 100);
  }
}

async function fetchProcessIntelligenceData(supabase: any) {
  try {
    console.log('Fetching process intelligence data...');
    
    // Fetch business processes
    const { data: processes } = await supabase
      .from('business_processes')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(10);
    
    if (!processes || processes.length === 0) {
      return 'PROCESS INTELLIGENCE:\n- No business processes currently configured';
    }
    
    let processData = 'PROCESS INTELLIGENCE:\n';
    
    // For each process, fetch related data
    for (const process of processes.slice(0, 5)) { // Limit to 5 for performance
      processData += `\n${process.display_name.toUpperCase()}:`;
      
      // Fetch process statistics
      const { data: stats } = await supabase
        .from('process_statistics')
        .select('*')
        .eq('process_id', process.id)
        .single();
      
      if (stats) {
        processData += `\n- Average Duration: ${stats.avg_duration}`;
        processData += `\n- Frequency: ${stats.frequency}`;
        processData += `\n- Automation Rate: ${stats.automation_rate}%`;
        processData += `\n- Error Rate: ${stats.error_rate}%`;
      }
      
      // Fetch bottlenecks
      const { data: bottlenecks } = await supabase
        .from('process_bottlenecks')
        .select('*')
        .eq('process_id', process.id)
        .eq('is_active', true)
        .limit(3);
      
      if (bottlenecks && bottlenecks.length > 0) {
        processData += '\n- Key Bottlenecks:';
        bottlenecks.forEach((bottleneck: any) => {
          processData += `\n  • ${bottleneck.step_name} (${bottleneck.wait_time_hours}h wait, ${bottleneck.impact_level} impact)`;
        });
      }
      
      // Fetch recommendations
      const { data: recommendations } = await supabase
        .from('process_recommendations')
        .select('*')
        .eq('process_id', process.id)
        .eq('is_active', true)
        .order('impact_level')
        .limit(2);
      
      if (recommendations && recommendations.length > 0) {
        processData += '\n- Top Recommendations:';
        recommendations.forEach((rec: any) => {
          processData += `\n  • ${rec.title} (${rec.impact_level} impact)`;
        });
      }
    }
    
    return processData;
  } catch (error) {
    console.error('Error fetching process intelligence data:', error);
    return '';
  }
}

async function fetchBusinessHealthData(supabase: any) {
  try {
    console.log('Fetching business health data...');
    
    // Fetch strategic objectives
    const { data: objectives } = await supabase
      .from('strategic_objectives')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(10);
    
    if (!objectives || objectives.length === 0) {
      return 'BUSINESS HEALTH:\n- No strategic objectives currently configured';
    }
    
    let healthData = 'BUSINESS HEALTH & STRATEGY:\n';
    
    // Get health periods for objectives
    for (const objective of objectives.slice(0, 5)) { // Limit for performance
      healthData += `\n${objective.display_name.toUpperCase()}:`;
      healthData += `\n- Perspective: ${objective.perspective}`;
      healthData += `\n- Owner: ${objective.owner || 'Not assigned'}`;
      
      // Fetch recent health data
      const { data: healthPeriods } = await supabase
        .from('strategic_objective_health_periods')
        .select('*')
        .eq('objective_id', objective.id)
        .order('year', { ascending: false })
        .limit(1);
      
      if (healthPeriods && healthPeriods.length > 0) {
        const health = healthPeriods[0];
        healthData += `\n- Current Status: ${health.rag_status.toUpperCase()} (Score: ${health.health_score})`;
      }
      
      // Fetch initiatives
      const { data: initiatives } = await supabase
        .from('strategic_initiatives')
        .select('*')
        .eq('objective_id', objective.id)
        .eq('is_active', true)
        .order('priority')
        .limit(3);
      
      if (initiatives && initiatives.length > 0) {
        healthData += '\n- Key Initiatives:';
        initiatives.forEach((initiative: any) => {
          healthData += `\n  • ${initiative.name} (${initiative.status}, ${initiative.progress_percentage}% complete)`;
        });
      }
      
      // Fetch risks and opportunities
      const { data: risks } = await supabase
        .from('strategic_risks_opportunities')
        .select('*')
        .eq('objective_id', objective.id)
        .eq('is_active', true)
        .eq('type', 'risk')
        .limit(2);
      
      if (risks && risks.length > 0) {
        healthData += '\n- Key Risks:';
        risks.forEach((risk: any) => {
          healthData += `\n  • ${risk.title} (${risk.impact_level} impact, ${risk.probability} probability)`;
        });
      }
    }
    
    return healthData;
  } catch (error) {
    console.error('Error fetching business health data:', error);
    return '';
  }
}

async function fetchAnalystInsights(supabase: any) {
  try {
    console.log('Fetching analyst insights...');
    
    const { data: insights } = await supabase
      .from('analyst_insights')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (!insights || insights.length === 0) {
      return 'ANALYST INSIGHTS:\n- No analyst insights currently available';
    }
    
    let insightsData = 'ANALYST INSIGHTS:\n';
    
    insights.forEach((insight: any) => {
      insightsData += `\n- [${insight.impact.toUpperCase()}] ${insight.title}`;
      insightsData += `\n  Category: ${insight.category}`;
      insightsData += `\n  Description: ${insight.description}`;
      if (insight.source) {
        insightsData += `\n  Source: ${insight.source}`;
      }
    });
    
    return insightsData;
  } catch (error) {
    console.error('Error fetching analyst insights:', error);
    return '';
  }
}

async function fetchOverviewData(supabase: any) {
  try {
    console.log('Fetching overview data from all areas...');
    
    let overviewData = 'BUSINESS OVERVIEW:\n';
    
    // Quick summary of cockpits
    const { data: cockpitTypes } = await supabase
      .from('cockpit_types')
      .select('display_name, description')
      .eq('is_active', true)
      .limit(5);
    
    if (cockpitTypes && cockpitTypes.length > 0) {
      overviewData += '\nAVAILABLE COCKPITS:';
      cockpitTypes.forEach((cockpit: any) => {
        overviewData += `\n- ${cockpit.display_name}: ${cockpit.description}`;
      });
    }
    
    // Quick summary of processes
    const { data: processCount } = await supabase
      .from('business_processes')
      .select('id')
      .eq('is_active', true);
    
    if (processCount) {
      overviewData += `\n\nPROCESS INTELLIGENCE: ${processCount.length} business processes configured`;
    }
    
    // Quick summary of objectives
    const { data: objectiveCount } = await supabase
      .from('strategic_objectives')
      .select('id')
      .eq('is_active', true);
    
    if (objectiveCount) {
      overviewData += `\n\nSTRATEGIC HEALTH: ${objectiveCount.length} strategic objectives being tracked`;
    }
    
    // Recent insights count
    const { data: insightCount } = await supabase
      .from('analyst_insights')
      .select('id')
      .eq('is_active', true);
    
    if (insightCount) {
      overviewData += `\n\nANALYST INSIGHTS: ${insightCount.length} insights available`;
    }
    
    return overviewData;
  } catch (error) {
    console.error('Error fetching overview data:', error);
    return '';
  }
}

async function fetchUserContext(supabase: any, userId: string) {
  try {
    const { data: userData } = await supabase
      .from('profiles')
      .select('full_name, job_title')
      .eq('id', userId)
      .single();
    
    if (userData) {
      return `
USER CONTEXT:
- Name: ${userData.full_name || 'Unknown'}
- Role: ${userData.job_title || 'Unknown'}
      `;
    }
  } catch (error) {
    console.error('Error fetching user context:', error);
  }
  
  return '';
}
