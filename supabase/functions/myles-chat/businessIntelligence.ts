/**
 * Enhanced Business Intelligence Module for Myles AI
 * Provides advanced analytics, trend analysis, and predictive insights
 */

interface TrendAnalysis {
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  percentage: number;
  direction: string;
  insight: string;
}

interface KPICorrelation {
  kpi1: string;
  kpi2: string;
  correlation: number;
  strength: 'strong' | 'moderate' | 'weak';
  insight: string;
}

interface PredictiveInsight {
  metric: string;
  prediction: string;
  confidence: number;
  recommendation: string;
  timeframe: string;
}

interface BusinessAlert {
  type: 'critical' | 'warning' | 'opportunity';
  title: string;
  description: string;
  priority: number;
  actionRequired: boolean;
  relatedMetrics: string[];
}

export class BusinessIntelligenceEngine {
  constructor(private supabase: any) {}

  /**
   * Generate comprehensive business intelligence analysis
   */
  async generateBusinessIntelligence(userRole?: string, moduleContext?: string): Promise<string> {
    try {
      const analyses = await Promise.all([
        this.performTrendAnalysis(moduleContext),
        this.analyzeKPICorrelations(moduleContext),
        this.generatePredictiveInsights(moduleContext),
        this.identifyBusinessAlerts(moduleContext),
        this.createBusinessSummary(userRole, moduleContext)
      ]);

      return this.combineAnalyses(analyses, userRole);
    } catch (error) {
      console.error('Error generating business intelligence:', error);
      return '';
    }
  }

  /**
   * Analyze trends across metrics and KPIs
   */
  private async performTrendAnalysis(moduleContext?: string): Promise<TrendAnalysis[]> {
    try {
      const trends: TrendAnalysis[] = [];

      // Analyze KPI trends
      const { data: kpiValues } = await this.supabase
        .from('cockpit_kpi_values')
        .select(`
          current_value,
          recorded_at,
          cockpit_kpis (
            display_name,
            trend_direction,
            cockpit_types (name)
          )
        `)
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (kpiValues && kpiValues.length > 0) {
        // Group by KPI and analyze trends
        const kpiGroups = this.groupBy(kpiValues, (item: any) => item.cockpit_kpis?.display_name);
        
        for (const [kpiName, values] of Object.entries(kpiGroups)) {
          if (Array.isArray(values) && values.length >= 2) {
            const trend = this.calculateTrend(values as any[]);
            if (trend) {
              trends.push({
                ...trend,
                insight: this.generateTrendInsight(kpiName, trend)
              });
            }
          }
        }
      }

      // Analyze time-based metric trends
      const { data: timeMetrics } = await this.supabase
        .from('metric_time_based_data')
        .select(`
          value,
          date_value,
          series_name,
          metric_time_based (
            base_metric_id,
            metric_base (display_name)
          )
        `)
        .order('date_value', { ascending: false })
        .limit(200);

      if (timeMetrics && timeMetrics.length > 0) {
        const metricGroups = this.groupBy(timeMetrics, (item: any) => 
          item.metric_time_based?.metric_base?.display_name
        );

        for (const [metricName, values] of Object.entries(metricGroups)) {
          if (Array.isArray(values) && values.length >= 3) {
            const trend = this.calculateTrend(values as any[], 'value');
            if (trend) {
              trends.push({
                ...trend,
                insight: this.generateTrendInsight(metricName, trend)
              });
            }
          }
        }
      }

      return trends.slice(0, 5); // Return top 5 trends
    } catch (error) {
      console.error('Error performing trend analysis:', error);
      return [];
    }
  }

  /**
   * Analyze correlations between KPIs
   */
  private async analyzeKPICorrelations(moduleContext?: string): Promise<KPICorrelation[]> {
    try {
      const correlations: KPICorrelation[] = [];

      // Get KPI values with timestamps
      const { data: kpiData } = await this.supabase
        .from('cockpit_kpi_values')
        .select(`
          current_value,
          recorded_at,
          cockpit_kpis (
            display_name,
            cockpit_type_id,
            cockpit_types (name)
          )
        `)
        .order('recorded_at', { ascending: false })
        .limit(200);

      if (kpiData && kpiData.length > 10) {
        // Group by time periods and calculate correlations
        const timeGroups = this.groupByTimeWindow(kpiData);
        
        for (const timeWindow of Object.values(timeGroups)) {
          if (Array.isArray(timeWindow) && timeWindow.length >= 3) {
            const kpiPairs = this.generateKPIPairs(timeWindow as any[]);
            
            for (const pair of kpiPairs) {
              const correlation = this.calculateCorrelation(pair.values1, pair.values2);
              if (Math.abs(correlation) > 0.3) { // Only significant correlations
                correlations.push({
                  kpi1: pair.kpi1,
                  kpi2: pair.kpi2,
                  correlation,
                  strength: this.getCorrelationStrength(correlation),
                  insight: this.generateCorrelationInsight(pair.kpi1, pair.kpi2, correlation)
                });
              }
            }
          }
        }
      }

      return correlations.slice(0, 3); // Return top 3 correlations
    } catch (error) {
      console.error('Error analyzing KPI correlations:', error);
      return [];
    }
  }

  /**
   * Generate predictive insights
   */
  private async generatePredictiveInsights(moduleContext?: string): Promise<PredictiveInsight[]> {
    try {
      const insights: PredictiveInsight[] = [];

      // Analyze KPI trajectories for predictions
      const { data: recentKPIs } = await this.supabase
        .from('cockpit_kpi_values')
        .select(`
          current_value,
          recorded_at,
          cockpit_kpis (
            display_name,
            trend_direction,
            cockpit_kpi_targets (target_value)
          )
        `)
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (recentKPIs && recentKPIs.length > 0) {
        const kpiGroups = this.groupBy(recentKPIs, (item: any) => item.cockpit_kpis?.display_name);

        for (const [kpiName, values] of Object.entries(kpiGroups)) {
          if (Array.isArray(values) && values.length >= 3) {
            const prediction = this.generatePrediction(values as any[]);
            if (prediction) {
              insights.push({
                metric: kpiName,
                prediction: prediction.forecast,
                confidence: prediction.confidence,
                recommendation: prediction.recommendation,
                timeframe: '30 days'
              });
            }
          }
        }
      }

      return insights.slice(0, 3); // Return top 3 predictions
    } catch (error) {
      console.error('Error generating predictive insights:', error);
      return [];
    }
  }

  /**
   * Identify business alerts and opportunities
   */
  private async identifyBusinessAlerts(moduleContext?: string): Promise<BusinessAlert[]> {
    try {
      const alerts: BusinessAlert[] = [];

      // Check for critical KPI deviations
      const { data: kpiAlerts } = await this.supabase
        .from('cockpit_kpi_values')
        .select(`
          current_value,
          cockpit_kpis (
            display_name,
            trend_direction,
            cockpit_kpi_targets (target_value)
          )
        `)
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (kpiAlerts) {
        for (const kpi of kpiAlerts) {
          const target = kpi.cockpit_kpis?.cockpit_kpi_targets?.[0]?.target_value;
          if (target && kpi.current_value) {
            const deviation = Math.abs((kpi.current_value - target) / target * 100);
            
            if (deviation > 20) {
              alerts.push({
                type: deviation > 40 ? 'critical' : 'warning',
                title: `${kpi.cockpit_kpis.display_name} Deviation Alert`,
                description: `Current value (${kpi.current_value}) deviates ${deviation.toFixed(1)}% from target (${target})`,
                priority: deviation > 40 ? 1 : 2,
                actionRequired: deviation > 30,
                relatedMetrics: [kpi.cockpit_kpis.display_name]
              });
            }
          }
        }
      }

      // Check for process inefficiencies
      const { data: processIssues } = await this.supabase
        .from('process_bottlenecks')
        .select(`
          step_name,
          wait_time_hours,
          impact_level,
          business_processes (display_name)
        `)
        .eq('is_active', true)
        .order('wait_time_hours', { ascending: false })
        .limit(10);

      if (processIssues) {
        for (const issue of processIssues) {
          if (issue.wait_time_hours > 24) {
            alerts.push({
              type: issue.impact_level === 'high' ? 'critical' : 'warning',
              title: `Process Bottleneck: ${issue.step_name}`,
              description: `${issue.wait_time_hours}h wait time in ${issue.business_processes?.display_name}`,
              priority: issue.impact_level === 'high' ? 1 : 3,
              actionRequired: issue.impact_level === 'high',
              relatedMetrics: [issue.business_processes?.display_name]
            });
          }
        }
      }

      // Look for improvement opportunities
      const opportunities = await this.identifyOpportunities();
      alerts.push(...opportunities);

      return alerts.sort((a, b) => a.priority - b.priority).slice(0, 5);
    } catch (error) {
      console.error('Error identifying business alerts:', error);
      return [];
    }
  }

  /**
   * Create role-based business summary
   */
  private async createBusinessSummary(userRole?: string, moduleContext?: string): Promise<string> {
    try {
      let summary = 'INTELLIGENT BUSINESS ANALYSIS:\n';

      // Tailor summary based on user role
      if (userRole?.toLowerCase().includes('ceo') || userRole?.toLowerCase().includes('executive')) {
        summary += await this.createExecutiveSummary();
      } else if (userRole?.toLowerCase().includes('manager')) {
        summary += await this.createManagerSummary(moduleContext);
      } else if (userRole?.toLowerCase().includes('analyst')) {
        summary += await this.createAnalystSummary();
      } else {
        summary += await this.createGeneralSummary();
      }

      return summary;
    } catch (error) {
      console.error('Error creating business summary:', error);
      return '';
    }
  }

  // Helper methods
  private calculateTrend(values: any[], valueField: string = 'current_value'): TrendAnalysis | null {
    if (values.length < 2) return null;

    const sortedValues = values.sort((a, b) => 
      new Date(a.recorded_at || a.date_value).getTime() - 
      new Date(b.recorded_at || b.date_value).getTime()
    );

    const firstValue = sortedValues[0][valueField];
    const lastValue = sortedValues[sortedValues.length - 1][valueField];
    
    if (!firstValue || !lastValue) return null;

    const percentage = ((lastValue - firstValue) / firstValue) * 100;
    const absPercentage = Math.abs(percentage);

    let trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    let direction: string;

    if (absPercentage < 5) {
      trend = 'stable';
      direction = 'relatively stable';
    } else if (absPercentage > 25) {
      trend = 'volatile';
      direction = 'highly volatile';
    } else if (percentage > 0) {
      trend = 'increasing';
      direction = 'upward trend';
    } else {
      trend = 'decreasing';
      direction = 'downward trend';
    }

    return {
      trend,
      percentage: Math.round(percentage * 100) / 100,
      direction,
      insight: ''
    };
  }

  private generateTrendInsight(metricName: string, trend: TrendAnalysis): string {
    const absPercentage = Math.abs(trend.percentage);
    
    if (trend.trend === 'stable') {
      return `${metricName} is performing consistently with minimal variation (${absPercentage.toFixed(1)}%)`;
    } else if (trend.trend === 'volatile') {
      return `${metricName} shows high volatility (${absPercentage.toFixed(1)}% change) - investigate causes`;
    } else if (trend.trend === 'increasing') {
      return `${metricName} is improving with a ${absPercentage.toFixed(1)}% increase - positive momentum`;
    } else {
      return `${metricName} is declining by ${absPercentage.toFixed(1)}% - requires attention`;
    }
  }

  private calculateCorrelation(values1: number[], values2: number[]): number {
    if (values1.length !== values2.length || values1.length < 3) return 0;

    const n = values1.length;
    const sum1 = values1.reduce((a, b) => a + b, 0);
    const sum2 = values2.reduce((a, b) => a + b, 0);
    const sum1Sq = values1.reduce((a, b) => a + b * b, 0);
    const sum2Sq = values2.reduce((a, b) => a + b * b, 0);
    const pSum = values1.reduce((acc, val, i) => acc + val * values2[i], 0);

    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

    return den === 0 ? 0 : num / den;
  }

  private getCorrelationStrength(correlation: number): 'strong' | 'moderate' | 'weak' {
    const abs = Math.abs(correlation);
    if (abs > 0.7) return 'strong';
    if (abs > 0.4) return 'moderate';
    return 'weak';
  }

  private generateCorrelationInsight(kpi1: string, kpi2: string, correlation: number): string {
    const strength = this.getCorrelationStrength(correlation);
    const direction = correlation > 0 ? 'positive' : 'negative';
    return `${strength} ${direction} correlation between ${kpi1} and ${kpi2} (${(correlation * 100).toFixed(1)}%)`;
  }

  private generatePrediction(values: any[]): { forecast: string; confidence: number; recommendation: string } | null {
    if (values.length < 3) return null;

    const trend = this.calculateTrend(values);
    if (!trend) return null;

    const confidence = Math.max(60, 90 - Math.abs(trend.percentage) * 2);
    
    let forecast: string;
    let recommendation: string;

    if (trend.trend === 'increasing') {
      forecast = `Expected to continue growing at ${Math.abs(trend.percentage).toFixed(1)}% rate`;
      recommendation = 'Monitor for sustainability and potential acceleration opportunities';
    } else if (trend.trend === 'decreasing') {
      forecast = `May continue declining at ${Math.abs(trend.percentage).toFixed(1)}% rate without intervention`;
      recommendation = 'Implement corrective measures to reverse the decline';
    } else if (trend.trend === 'volatile') {
      forecast = 'High variability expected to continue';
      recommendation = 'Focus on stabilization and identifying root causes of volatility';
    } else {
      forecast = 'Expected to remain stable in the near term';
      recommendation = 'Maintain current performance levels and watch for early indicators of change';
    }

    return { forecast, confidence, recommendation };
  }

  private async identifyOpportunities(): Promise<BusinessAlert[]> {
    const opportunities: BusinessAlert[] = [];

    // Look for high-performing metrics that could be leveraged
    const { data: topPerformers } = await this.supabase
      .from('cockpit_kpi_values')
      .select(`
        current_value,
        cockpit_kpis (
          display_name,
          cockpit_kpi_targets (target_value)
        )
      `)
      .order('recorded_at', { ascending: false })
      .limit(30);

    if (topPerformers) {
      for (const kpi of topPerformers) {
        const target = kpi.cockpit_kpis?.cockpit_kpi_targets?.[0]?.target_value;
        if (target && kpi.current_value && kpi.current_value > target * 1.1) {
          opportunities.push({
            type: 'opportunity',
            title: `${kpi.cockpit_kpis.display_name} Exceeding Targets`,
            description: `Performance is ${((kpi.current_value / target - 1) * 100).toFixed(1)}% above target - consider raising goals`,
            priority: 4,
            actionRequired: false,
            relatedMetrics: [kpi.cockpit_kpis.display_name]
          });
        }
      }
    }

    return opportunities.slice(0, 2);
  }

  private async createExecutiveSummary(): Promise<string> {
    return '\n- Strategic Overview: Focus on high-level performance indicators and strategic alignment\n- Key Performance Trends: Executive dashboard metrics and critical success factors\n- Risk Assessment: Strategic risks and opportunities requiring executive attention';
  }

  private async createManagerSummary(moduleContext?: string): Promise<string> {
    return '\n- Operational Focus: Day-to-day performance metrics and team productivity\n- Process Efficiency: Bottlenecks and improvement opportunities in your area\n- Team Performance: KPIs relevant to your department and responsibilities';
  }

  private async createAnalystSummary(): Promise<string> {
    return '\n- Detailed Analytics: Comprehensive data analysis and trend identification\n- Statistical Insights: Correlations, patterns, and predictive indicators\n- Data Quality: Metrics reliability and data completeness assessment';
  }

  private async createGeneralSummary(): Promise<string> {
    return '\n- Business Health: Overall company performance and key metrics\n- Trend Analysis: Recent changes and patterns in business data\n- Actionable Insights: Recommendations based on current performance';
  }

  private combineAnalyses(analyses: any[], userRole?: string): string {
    const [trends, correlations, predictions, alerts, summary] = analyses;
    
    let result = summary;

    if (trends && trends.length > 0) {
      result += '\n\nKEY TRENDS IDENTIFIED:';
      trends.slice(0, 3).forEach((trend: TrendAnalysis, index: number) => {
        result += `\n${index + 1}. ${trend.insight}`;
      });
    }

    if (correlations && correlations.length > 0) {
      result += '\n\nCORRELATION INSIGHTS:';
      correlations.slice(0, 2).forEach((corr: KPICorrelation, index: number) => {
        result += `\n${index + 1}. ${corr.insight}`;
      });
    }

    if (predictions && predictions.length > 0) {
      result += '\n\nPREDICTIVE INSIGHTS:';
      predictions.slice(0, 2).forEach((pred: PredictiveInsight, index: number) => {
        result += `\n${index + 1}. ${pred.metric}: ${pred.prediction} (${pred.confidence}% confidence)`;
      });
    }

    if (alerts && alerts.length > 0) {
      const criticalAlerts = alerts.filter((a: any) => a.type === 'critical');
      const opportunities = alerts.filter((a: any) => a.type === 'opportunity');
      
      if (criticalAlerts.length > 0) {
        result += '\n\nCRITICAL ALERTS:';
        criticalAlerts.slice(0, 2).forEach((alert: BusinessAlert, index: number) => {
          result += `\n${index + 1}. ${alert.title}: ${alert.description}`;
        });
      }

      if (opportunities.length > 0) {
        result += '\n\nOPPORTUNITIES IDENTIFIED:';
        opportunities.slice(0, 2).forEach((opp: BusinessAlert, index: number) => {
          result += `\n${index + 1}. ${opp.title}: ${opp.description}`;
        });
      }
    }

    return result;
  }

  // Utility methods
  private groupBy<T>(array: T[], keySelector: (item: T) => string): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const key = keySelector(item);
      if (!key) return groups;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  private groupByTimeWindow(data: any[]): Record<string, any[]> {
    return this.groupBy(data, (item) => {
      const date = new Date(item.recorded_at);
      return `${date.getFullYear()}-${Math.floor(date.getMonth() / 3)}`; // Quarterly grouping
    });
  }

  private generateKPIPairs(data: any[]): Array<{
    kpi1: string;
    kpi2: string;
    values1: number[];
    values2: number[];
  }> {
    const kpiGroups = this.groupBy(data, (item) => item.cockpit_kpis?.display_name);
    const kpiNames = Object.keys(kpiGroups);
    const pairs: Array<{
      kpi1: string;
      kpi2: string;
      values1: number[];
      values2: number[];
    }> = [];

    for (let i = 0; i < kpiNames.length; i++) {
      for (let j = i + 1; j < kpiNames.length; j++) {
        const values1 = kpiGroups[kpiNames[i]]?.map(item => item.current_value).filter(v => v != null) || [];
        const values2 = kpiGroups[kpiNames[j]]?.map(item => item.current_value).filter(v => v != null) || [];
        
        if (values1.length >= 3 && values2.length >= 3) {
          pairs.push({
            kpi1: kpiNames[i],
            kpi2: kpiNames[j],
            values1,
            values2
          });
        }
      }
    }

    return pairs;
  }
}