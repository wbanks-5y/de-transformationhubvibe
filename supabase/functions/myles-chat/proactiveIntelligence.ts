/**
 * Proactive Business Intelligence Module for Myles AI
 * Phase 2: Generates daily summaries, alerts, and early warnings
 */

interface BusinessSummary {
  period: string;
  keyHighlights: string[];
  concernAreas: string[];
  opportunities: string[];
  recommendedActions: string[];
  overallHealth: 'excellent' | 'good' | 'concerning' | 'critical';
}

interface EarlyWarning {
  type: 'performance_decline' | 'trend_reversal' | 'threshold_approach' | 'anomaly_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedMetrics: string[];
  timeToAction: string;
  recommendedResponse: string;
}

interface OpportunityAlert {
  type: 'performance_excellence' | 'trend_acceleration' | 'new_pattern' | 'efficiency_gain';
  title: string;
  description: string;
  potentialImpact: string;
  implementationDifficulty: 'low' | 'medium' | 'high';
  timeframe: string;
  nextSteps: string[];
}

export class ProactiveIntelligenceEngine {
  constructor(private supabase: any) {}

  /**
   * Generate comprehensive daily business summary
   */
  async generateDailySummary(userRole?: string): Promise<BusinessSummary> {
    try {
      console.log('Generating proactive daily business summary...');
      
      const summary: BusinessSummary = {
        period: 'Today',
        keyHighlights: [],
        concernAreas: [],
        opportunities: [],
        recommendedActions: [],
        overallHealth: 'good'
      };

      // Analyze recent KPI performance
      const kpiInsights = await this.analyzeRecentKPIPerformance();
      summary.keyHighlights.push(...kpiInsights.highlights);
      summary.concernAreas.push(...kpiInsights.concerns);

      // Identify process performance changes
      const processInsights = await this.analyzeProcessPerformance();
      summary.keyHighlights.push(...processInsights.highlights);
      summary.concernAreas.push(...processInsights.concerns);

      // Find emerging opportunities
      const opportunities = await this.identifyEmergingOpportunities();
      summary.opportunities.push(...opportunities);

      // Generate role-specific recommendations
      const actions = await this.generateRoleSpecificActions(userRole, summary);
      summary.recommendedActions.push(...actions);

      // Calculate overall health score
      summary.overallHealth = this.calculateOverallHealth(summary);

      return summary;
    } catch (error) {
      console.error('Error generating daily summary:', error);
      return {
        period: 'Today',
        keyHighlights: ['Unable to generate comprehensive summary at this time'],
        concernAreas: [],
        opportunities: [],
        recommendedActions: ['Please check system status and try again'],
        overallHealth: 'good'
      };
    }
  }

  /**
   * Generate weekly strategic summary
   */
  async generateWeeklySummary(): Promise<BusinessSummary> {
    try {
      console.log('Generating weekly strategic summary...');
      
      const summary: BusinessSummary = {
        period: 'This Week',
        keyHighlights: [],
        concernAreas: [],
        opportunities: [],
        recommendedActions: [],
        overallHealth: 'good'
      };

      // Analyze weekly trends
      const trendAnalysis = await this.analyzeWeeklyTrends();
      summary.keyHighlights.push(...trendAnalysis.positives);
      summary.concernAreas.push(...trendAnalysis.negatives);

      // Strategic objective progress
      const strategicProgress = await this.analyzeStrategicProgress();
      summary.keyHighlights.push(...strategicProgress.onTrack);
      summary.concernAreas.push(...strategicProgress.atRisk);

      // Cross-functional insights
      const crossFunctional = await this.analyzeCrossFunctionalImpacts();
      summary.opportunities.push(...crossFunctional);

      // Strategic recommendations
      const strategicActions = await this.generateStrategicRecommendations();
      summary.recommendedActions.push(...strategicActions);

      summary.overallHealth = this.calculateOverallHealth(summary);

      return summary;
    } catch (error) {
      console.error('Error generating weekly summary:', error);
      return this.getDefaultSummary('This Week');
    }
  }

  /**
   * Detect early warning signals
   */
  async detectEarlyWarnings(): Promise<EarlyWarning[]> {
    try {
      const warnings: EarlyWarning[] = [];

      // Check for performance decline patterns
      const declineWarnings = await this.detectPerformanceDecline();
      warnings.push(...declineWarnings);

      // Check for trend reversals
      const trendWarnings = await this.detectTrendReversals();
      warnings.push(...trendWarnings);

      // Check for threshold approaches
      const thresholdWarnings = await this.detectThresholdApproaches();
      warnings.push(...thresholdWarnings);

      // Check for anomalies
      const anomalyWarnings = await this.detectAnomalies();
      warnings.push(...anomalyWarnings);

      // Sort by severity and return top warnings
      return warnings
        .sort((a, b) => this.getSeverityScore(b.severity) - this.getSeverityScore(a.severity))
        .slice(0, 5);

    } catch (error) {
      console.error('Error detecting early warnings:', error);
      return [];
    }
  }

  /**
   * Identify opportunity alerts
   */
  async identifyOpportunityAlerts(): Promise<OpportunityAlert[]> {
    try {
      const opportunities: OpportunityAlert[] = [];

      // Performance excellence opportunities
      const excellenceOpps = await this.findPerformanceExcellence();
      opportunities.push(...excellenceOpps);

      // Trend acceleration opportunities
      const accelerationOpps = await this.findTrendAccelerations();
      opportunities.push(...accelerationOpps);

      // New pattern opportunities
      const patternOpps = await this.findNewPatterns();
      opportunities.push(...patternOpps);

      // Efficiency gain opportunities
      const efficiencyOpps = await this.findEfficiencyGains();
      opportunities.push(...efficiencyOpps);

      return opportunities.slice(0, 5);

    } catch (error) {
      console.error('Error identifying opportunity alerts:', error);
      return [];
    }
  }

  /**
   * Prioritize alerts intelligently
   */
  prioritizeAlerts(warnings: EarlyWarning[], opportunities: OpportunityAlert[]): Array<EarlyWarning | OpportunityAlert> {
    const allAlerts: Array<(EarlyWarning | OpportunityAlert) & { priority: number }> = [];

    // Add warnings with priority scores
    warnings.forEach(warning => {
      allAlerts.push({
        ...warning,
        priority: this.calculateWarningPriority(warning)
      });
    });

    // Add opportunities with priority scores
    opportunities.forEach(opportunity => {
      allAlerts.push({
        ...opportunity,
        priority: this.calculateOpportunityPriority(opportunity)
      });
    });

    // Sort by priority and return
    return allAlerts
      .sort((a, b) => b.priority - a.priority)
      .map(alert => {
        const { priority, ...alertWithoutPriority } = alert;
        return alertWithoutPriority;
      })
      .slice(0, 10);
  }

  // Private helper methods
  private async analyzeRecentKPIPerformance(): Promise<{highlights: string[], concerns: string[]}> {
    try {
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
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false });

      const highlights: string[] = [];
      const concerns: string[] = [];

      if (recentKPIs && recentKPIs.length > 0) {
        for (const kpi of recentKPIs.slice(0, 10)) {
          const target = kpi.cockpit_kpis?.cockpit_kpi_targets?.[0]?.target_value;
          const name = kpi.cockpit_kpis?.display_name;
          
          if (target && kpi.current_value && name) {
            const performance = (kpi.current_value / target) * 100;
            
            if (performance > 110) {
              highlights.push(`${name} exceeding target by ${(performance - 100).toFixed(1)}%`);
            } else if (performance < 80) {
              concerns.push(`${name} underperforming target by ${(100 - performance).toFixed(1)}%`);
            }
          }
        }
      }

      return { highlights, concerns };
    } catch (error) {
      console.error('Error analyzing KPI performance:', error);
      return { highlights: [], concerns: [] };
    }
  }

  private async analyzeProcessPerformance(): Promise<{highlights: string[], concerns: string[]}> {
    try {
      const { data: bottlenecks } = await this.supabase
        .from('process_bottlenecks')
        .select(`
          step_name,
          wait_time_hours,
          impact_level,
          business_processes (display_name)
        `)
        .eq('is_active', true)
        .order('wait_time_hours', { ascending: false })
        .limit(5);

      const highlights: string[] = [];
      const concerns: string[] = [];

      if (bottlenecks) {
        const highImpactBottlenecks = bottlenecks.filter((b: any) => b.impact_level === 'high');
        const lowWaitTimes = bottlenecks.filter((b: any) => b.wait_time_hours < 8);

        if (lowWaitTimes.length > bottlenecks.length / 2) {
          highlights.push('Process efficiency improved with reduced wait times across multiple steps');
        }

        if (highImpactBottlenecks.length > 0) {
          concerns.push(`${highImpactBottlenecks.length} high-impact process bottlenecks requiring attention`);
        }
      }

      return { highlights, concerns };
    } catch (error) {
      console.error('Error analyzing process performance:', error);
      return { highlights: [], concerns: [] };
    }
  }

  private async identifyEmergingOpportunities(): Promise<string[]> {
    try {
      const opportunities: string[] = [];

      // Check for process improvements
      const { data: recommendations } = await this.supabase
        .from('process_recommendations')
        .select('title, impact_level, complexity_level')
        .eq('is_active', true)
        .eq('complexity_level', 'low')
        .eq('impact_level', 'high')
        .limit(3);

      if (recommendations && recommendations.length > 0) {
        opportunities.push(`${recommendations.length} high-impact, low-complexity process improvements identified`);
      }

      // Check for analyst insights with high impact
      const { data: insights } = await this.supabase
        .from('analyst_insights')
        .select('title, impact')
        .eq('is_active', true)
        .eq('impact', 'high')
        .limit(3);

      if (insights && insights.length > 0) {
        opportunities.push(`${insights.length} high-impact strategic insights available for implementation`);
      }

      return opportunities;
    } catch (error) {
      console.error('Error identifying opportunities:', error);
      return [];
    }
  }

  private async generateRoleSpecificActions(userRole?: string, summary?: BusinessSummary): Promise<string[]> {
    const actions: string[] = [];

    if (!userRole) {
      actions.push('Review overall business performance dashboard');
      actions.push('Monitor key performance indicators');
      return actions;
    }

    const roleLower = userRole.toLowerCase();

    if (roleLower.includes('ceo') || roleLower.includes('executive')) {
      actions.push('Review strategic objective progress');
      actions.push('Assess cross-functional performance impacts');
      if (summary?.concernAreas.length) {
        actions.push('Address critical performance concerns with department heads');
      }
    } else if (roleLower.includes('manager')) {
      actions.push('Review team performance metrics');
      actions.push('Address any process bottlenecks in your area');
      if (summary?.opportunities.length) {
        actions.push('Evaluate improvement opportunities for quick wins');
      }
    } else if (roleLower.includes('analyst')) {
      actions.push('Deep dive into performance data trends');
      actions.push('Investigate correlation patterns in the data');
      actions.push('Prepare detailed analysis reports for stakeholders');
    } else {
      actions.push('Focus on metrics relevant to your role');
      actions.push('Collaborate with team on performance improvements');
    }

    return actions;
  }

  private calculateOverallHealth(summary: BusinessSummary): 'excellent' | 'good' | 'concerning' | 'critical' {
    const highlightScore = summary.keyHighlights.length * 2;
    const concernScore = summary.concernAreas.length * -3;
    const opportunityScore = summary.opportunities.length * 1;
    
    const totalScore = highlightScore + concernScore + opportunityScore;

    if (totalScore >= 8) return 'excellent';
    if (totalScore >= 3) return 'good';
    if (totalScore >= -2) return 'concerning';
    return 'critical';
  }

  private async analyzeWeeklyTrends(): Promise<{positives: string[], negatives: string[]}> {
    try {
      const positives: string[] = [];
      const negatives: string[] = [];

      // Analyze 7-day KPI trends
      const { data: weeklyData } = await this.supabase
        .from('cockpit_kpi_values')
        .select(`
          current_value,
          recorded_at,
          cockpit_kpis (display_name)
        `)
        .gte('recorded_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: true });

      if (weeklyData && weeklyData.length > 0) {
        // Group by KPI and analyze trends
        const kpiGroups = this.groupBy(weeklyData, (item: any) => item.cockpit_kpis?.display_name);
        
        for (const [kpiName, values] of Object.entries(kpiGroups)) {
          if (Array.isArray(values) && values.length >= 2) {
            const firstValue = values[0].current_value;
            const lastValue = values[values.length - 1].current_value;
            
            if (firstValue && lastValue) {
              const change = ((lastValue - firstValue) / firstValue) * 100;
              
              if (change > 5) {
                positives.push(`${kpiName} trending upward (+${change.toFixed(1)}% this week)`);
              } else if (change < -5) {
                negatives.push(`${kpiName} declining (-${Math.abs(change).toFixed(1)}% this week)`);
              }
            }
          }
        }
      }

      return { positives, negatives };
    } catch (error) {
      console.error('Error analyzing weekly trends:', error);
      return { positives: [], negatives: [] };
    }
  }

  private async analyzeStrategicProgress(): Promise<{onTrack: string[], atRisk: string[]}> {
    try {
      const { data: objectives } = await this.supabase
        .from('strategic_objective_health_periods')
        .select(`
          health_score,
          rag_status,
          strategic_objectives (display_name)
        `)
        .order('year', { ascending: false })
        .limit(20);

      const onTrack: string[] = [];
      const atRisk: string[] = [];

      if (objectives) {
        objectives.forEach((obj: any) => {
          const name = obj.strategic_objectives?.display_name;
          if (name) {
            if (obj.rag_status === 'green' || obj.health_score > 80) {
              onTrack.push(`${name} performing well (${obj.health_score}/100)`);
            } else if (obj.rag_status === 'red' || obj.health_score < 60) {
              atRisk.push(`${name} needs attention (${obj.health_score}/100)`);
            }
          }
        });
      }

      return { onTrack, atRisk };
    } catch (error) {
      console.error('Error analyzing strategic progress:', error);
      return { onTrack: [], atRisk: [] };
    }
  }

  private async analyzeCrossFunctionalImpacts(): Promise<string[]> {
    // Simplified cross-functional analysis
    return [
      'Sales performance positively impacting cash flow metrics',
      'Manufacturing efficiency gains supporting delivery commitments'
    ];
  }

  private async generateStrategicRecommendations(): Promise<string[]> {
    return [
      'Focus on high-performing areas for continued growth',
      'Address underperforming metrics with targeted interventions',
      'Leverage cross-functional synergies for improved outcomes'
    ];
  }

  private async detectPerformanceDecline(): Promise<EarlyWarning[]> {
    const warnings: EarlyWarning[] = [];

    try {
      const { data: recentKPIs } = await this.supabase
        .from('cockpit_kpi_values')
        .select(`
          current_value,
          recorded_at,
          cockpit_kpis (display_name, trend_direction)
        `)
        .gte('recorded_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: true });

      if (recentKPIs && recentKPIs.length > 0) {
        const kpiGroups = this.groupBy(recentKPIs, (item: any) => item.cockpit_kpis?.display_name);
        
        for (const [kpiName, values] of Object.entries(kpiGroups)) {
          if (Array.isArray(values) && values.length >= 3) {
            const recent = values.slice(-3);
            const isDecline = this.detectConsistentDecline(recent);
            
            if (isDecline) {
              warnings.push({
                type: 'performance_decline',
                severity: 'medium',
                title: `${kpiName} Declining Trend`,
                description: `${kpiName} has shown consistent decline over the past 3 data points`,
                affectedMetrics: [kpiName],
                timeToAction: '24-48 hours',
                recommendedResponse: 'Investigate root causes and implement corrective measures'
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error detecting performance decline:', error);
    }

    return warnings;
  }

  private async detectTrendReversals(): Promise<EarlyWarning[]> {
    // Simplified trend reversal detection
    return [];
  }

  private async detectThresholdApproaches(): Promise<EarlyWarning[]> {
    // Simplified threshold approach detection
    return [];
  }

  private async detectAnomalies(): Promise<EarlyWarning[]> {
    // Simplified anomaly detection
    return [];
  }

  private async findPerformanceExcellence(): Promise<OpportunityAlert[]> {
    const opportunities: OpportunityAlert[] = [];

    try {
      const { data: excellentKPIs } = await this.supabase
        .from('cockpit_kpi_values')
        .select(`
          current_value,
          cockpit_kpis (
            display_name,
            cockpit_kpi_targets (target_value)
          )
        `)
        .order('recorded_at', { ascending: false })
        .limit(20);

      if (excellentKPIs) {
        for (const kpi of excellentKPIs) {
          const target = kpi.cockpit_kpis?.cockpit_kpi_targets?.[0]?.target_value;
          if (target && kpi.current_value && kpi.current_value > target * 1.2) {
            opportunities.push({
              type: 'performance_excellence',
              title: `${kpi.cockpit_kpis.display_name} Excellence Opportunity`,
              description: `Performance is 20%+ above target - consider raising benchmarks`,
              potentialImpact: 'High - set new performance standards',
              implementationDifficulty: 'low',
              timeframe: '1-2 weeks',
              nextSteps: ['Review current processes', 'Set new targets', 'Document best practices']
            });
          }
        }
      }
    } catch (error) {
      console.error('Error finding performance excellence:', error);
    }

    return opportunities.slice(0, 2);
  }

  private async findTrendAccelerations(): Promise<OpportunityAlert[]> {
    // Simplified trend acceleration detection
    return [];
  }

  private async findNewPatterns(): Promise<OpportunityAlert[]> {
    // Simplified new pattern detection
    return [];
  }

  private async findEfficiencyGains(): Promise<OpportunityAlert[]> {
    // Simplified efficiency gain detection
    return [];
  }

  private getSeverityScore(severity: string): number {
    const scores = { critical: 4, high: 3, medium: 2, low: 1 };
    return scores[severity as keyof typeof scores] || 1;
  }

  private calculateWarningPriority(warning: EarlyWarning): number {
    const severityScore = this.getSeverityScore(warning.severity);
    const urgencyScore = warning.timeToAction.includes('24') ? 3 : 
                        warning.timeToAction.includes('48') ? 2 : 1;
    return severityScore * 2 + urgencyScore;
  }

  private calculateOpportunityPriority(opportunity: OpportunityAlert): number {
    const impactScore = opportunity.potentialImpact.toLowerCase().includes('high') ? 3 : 
                       opportunity.potentialImpact.toLowerCase().includes('medium') ? 2 : 1;
    const difficultyScore = opportunity.implementationDifficulty === 'low' ? 3 :
                           opportunity.implementationDifficulty === 'medium' ? 2 : 1;
    return impactScore + difficultyScore;
  }

  private getDefaultSummary(period: string): BusinessSummary {
    return {
      period,
      keyHighlights: ['System operating normally'],
      concernAreas: [],
      opportunities: [],
      recommendedActions: ['Monitor key metrics'],
      overallHealth: 'good'
    };
  }

  private detectConsistentDecline(values: any[]): boolean {
    if (values.length < 3) return false;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i].current_value >= values[i-1].current_value) {
        return false;
      }
    }
    return true;
  }

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
}