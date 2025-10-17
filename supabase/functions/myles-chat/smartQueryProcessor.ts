/**
 * Smart Query Processing Module for Enhanced NLP and Context Understanding
 * Phase 3: Advanced Query Processing Implementation
 */

interface QueryIntent {
  type: 'question' | 'request' | 'analysis' | 'comparison' | 'trend' | 'prediction';
  entities: string[];
  timeframe?: string;
  department?: string;
  metric?: string;
  confidence: number;
}

interface SmartSuggestion {
  type: 'related_insight' | 'drill_down' | 'cross_reference' | 'action_item';
  title: string;
  description: string;
  relevanceScore: number;
}

interface BusinessStory {
  title: string;
  narrative: string;
  dataPoints: string[];
  insights: string[];
  recommendations: string[];
}

export class SmartQueryProcessor {
  private businessKeywords: Record<string, string[]> = {
    sales: ['revenue', 'sales', 'selling', 'customers', 'pipeline', 'conversion', 'deals'],
    finance: ['finance', 'financial', 'cost', 'budget', 'expense', 'profit', 'margin', 'cash'],
    operations: ['operations', 'process', 'efficiency', 'productivity', 'workflow', 'bottleneck'],
    manufacturing: ['production', 'manufacturing', 'quality', 'output', 'capacity', 'throughput'],
    supply: ['supply', 'procurement', 'inventory', 'vendor', 'supplier', 'logistics'],
    hr: ['employees', 'staff', 'team', 'training', 'performance', 'recruitment'],
    strategy: ['strategy', 'strategic', 'objective', 'goal', 'initiative', 'vision']
  };

  private timeKeywords: Record<string, string> = {
    'last week': '7d',
    'past week': '7d',
    'last month': '30d',
    'past month': '30d',
    'last quarter': '90d',
    'past quarter': '90d',
    'this year': '365d',
    'ytd': '365d',
    'year to date': '365d'
  };

  constructor(private supabase: any) {}

  /**
   * Analyze user query and extract intent, entities, and context
   */
  analyzeQuery(query: string, conversationHistory?: any[]): QueryIntent {
    const queryLower = query.toLowerCase();
    
    // Determine query type
    let type: QueryIntent['type'] = 'question';
    if (queryLower.includes('show') || queryLower.includes('display') || queryLower.includes('give me')) {
      type = 'request';
    } else if (queryLower.includes('analyze') || queryLower.includes('analysis')) {
      type = 'analysis';
    } else if (queryLower.includes('compare') || queryLower.includes('vs') || queryLower.includes('versus')) {
      type = 'comparison';
    } else if (queryLower.includes('trend') || queryLower.includes('over time') || queryLower.includes('historical')) {
      type = 'trend';
    } else if (queryLower.includes('predict') || queryLower.includes('forecast') || queryLower.includes('will')) {
      type = 'prediction';
    }

    // Extract entities (business areas, metrics, timeframes)
    const entities: string[] = [];
    
    // Identify business areas
    for (const [area, keywords] of Object.entries(this.businessKeywords)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        entities.push(area);
      }
    }

    // Extract timeframe
    let timeframe: string | undefined;
    for (const [phrase, duration] of Object.entries(this.timeKeywords)) {
      if (queryLower.includes(phrase)) {
        timeframe = duration;
        break;
      }
    }

    // Extract specific metrics mentioned
    let metric: string | undefined;
    const metricKeywords = ['kpi', 'metric', 'performance', 'target', 'goal'];
    if (metricKeywords.some(keyword => queryLower.includes(keyword))) {
      metric = 'performance_metrics';
    }

    // Calculate confidence based on keyword matches and context
    const confidence = this.calculateConfidence(queryLower, entities, conversationHistory);

    return {
      type,
      entities,
      timeframe,
      metric,
      confidence
    };
  }

  /**
   * Generate smart suggestions based on query and available data
   */
  async generateSmartSuggestions(
    query: string,
    queryIntent: QueryIntent,
    moduleContext?: string
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    try {
      // Generate drill-down suggestions
      if (queryIntent.entities.length > 0) {
        const drillDowns = await this.generateDrillDownSuggestions(queryIntent.entities[0]);
        suggestions.push(...drillDowns);
      }

      // Generate related insights
      const relatedInsights = await this.findRelatedInsights(query, queryIntent);
      suggestions.push(...relatedInsights);

      // Generate cross-references
      const crossRefs = await this.findCrossReferences(queryIntent.entities, moduleContext);
      suggestions.push(...crossRefs);

      // Generate action items
      const actionItems = this.generateActionItems(queryIntent);
      suggestions.push(...actionItems);

      // Sort by relevance score and return top suggestions
      return suggestions
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 5);

    } catch (error) {
      console.error('Error generating smart suggestions:', error);
      return [];
    }
  }

  /**
   * Create cross-functional business stories that connect data points
   */
  async createBusinessStory(
    queryIntent: QueryIntent,
    businessData: string,
    moduleContext?: string
  ): Promise<BusinessStory | null> {
    try {
      if (queryIntent.entities.length === 0) return null;

      const primaryArea = queryIntent.entities[0];
      const story = await this.buildNarrative(primaryArea, queryIntent, businessData);
      
      return story;
    } catch (error) {
      console.error('Error creating business story:', error);
      return null;
    }
  }

  /**
   * Discover data patterns and suggest exploration paths
   */
  async discoverDataPatterns(moduleContext?: string): Promise<SmartSuggestion[]> {
    try {
      const patterns: SmartSuggestion[] = [];

      // Analyze KPI relationships
      const { data: kpis } = await this.supabase
        .from('cockpit_kpis')
        .select(`
          display_name,
          trend_direction,
          cockpit_types (name, display_name)
        `)
        .eq('is_active', true)
        .limit(20);

      if (kpis) {
        // Group KPIs by cockpit type
        const cockpitGroups = this.groupBy(kpis, (kpi: any) => kpi.cockpit_types?.name);
        
        for (const [cockpit, cockpitKpis] of Object.entries(cockpitGroups)) {
          if (Array.isArray(cockpitKpis) && cockpitKpis.length > 1) {
            patterns.push({
              type: 'cross_reference',
              title: `Explore ${cockpit} Performance Relationships`,
              description: `Analyze correlations between ${cockpitKpis.length} KPIs in ${cockpit}`,
              relevanceScore: 0.8
            });
          }
        }
      }

      // Analyze process connections
      const { data: processes } = await this.supabase
        .from('business_processes')
        .select('display_name, description')
        .eq('is_active', true)
        .limit(10);

      if (processes && processes.length > 3) {
        patterns.push({
          type: 'related_insight',
          title: 'Cross-Process Impact Analysis',
          description: `Examine how ${processes.length} business processes influence each other`,
          relevanceScore: 0.7
        });
      }

      return patterns.slice(0, 3);
    } catch (error) {
      console.error('Error discovering data patterns:', error);
      return [];
    }
  }

  /**
   * Generate action-oriented recommendations
   */
  generateActionRecommendations(
    queryIntent: QueryIntent,
    businessData: string
  ): SmartSuggestion[] {
    const recommendations: SmartSuggestion[] = [];

    // Based on query type, suggest actions
    switch (queryIntent.type) {
      case 'trend':
        recommendations.push({
          type: 'action_item',
          title: 'Set Up Trend Monitoring',
          description: 'Create automated alerts for significant trend changes',
          relevanceScore: 0.9
        });
        break;
        
      case 'analysis':
        recommendations.push({
          type: 'action_item',
          title: 'Schedule Regular Review',
          description: 'Set up periodic analysis to track performance changes',
          relevanceScore: 0.8
        });
        break;
        
      case 'prediction':
        recommendations.push({
          type: 'action_item',
          title: 'Create Prediction Dashboard',
          description: 'Build automated forecasting for key metrics',
          relevanceScore: 0.9
        });
        break;
    }

    // Add general business improvement suggestions
    if (businessData.includes('bottleneck') || businessData.includes('inefficiency')) {
      recommendations.push({
        type: 'action_item',
        title: 'Process Optimization Initiative',
        description: 'Address identified bottlenecks to improve efficiency',
        relevanceScore: 0.85
      });
    }

    if (businessData.includes('opportunity') || businessData.includes('exceeding')) {
      recommendations.push({
        type: 'action_item',
        title: 'Scale Success Factors',
        description: 'Leverage high-performing areas to improve overall results',
        relevanceScore: 0.8
      });
    }

    return recommendations;
  }

  // Private helper methods
  private calculateConfidence(
    query: string,
    entities: string[],
    conversationHistory?: any[]
  ): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on entity matches
    confidence += entities.length * 0.1;

    // Increase confidence if query is specific
    const specificWords = ['show', 'analyze', 'compare', 'what', 'how', 'why'];
    if (specificWords.some(word => query.includes(word))) {
      confidence += 0.2;
    }

    // Increase confidence if there's conversation context
    if (conversationHistory && conversationHistory.length > 0) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  private async generateDrillDownSuggestions(entity: string): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Generate suggestions based on business area
    switch (entity) {
      case 'sales':
        suggestions.push({
          type: 'drill_down',
          title: 'Sales Pipeline Analysis',
          description: 'Examine conversion rates and pipeline health',
          relevanceScore: 0.9
        });
        break;
        
      case 'finance':
        suggestions.push({
          type: 'drill_down',
          title: 'Financial Performance Breakdown',
          description: 'Analyze revenue, costs, and profitability trends',
          relevanceScore: 0.9
        });
        break;
        
      case 'operations':
        suggestions.push({
          type: 'drill_down',
          title: 'Operational Efficiency Deep Dive',
          description: 'Review process performance and bottlenecks',
          relevanceScore: 0.9
        });
        break;
    }

    return suggestions;
  }

  private async findRelatedInsights(
    query: string,
    queryIntent: QueryIntent
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    try {
      // Search for relevant insights based on query content
      const { data: insights } = await this.supabase
        .from('analyst_insights')
        .select('title, description, category')
        .eq('is_active', true)
        .limit(10);

      if (insights) {
        const queryWords = query.toLowerCase().split(' ');
        
        for (const insight of insights) {
          const relevance = this.calculateRelevanceScore(
            queryWords,
            [insight.title, insight.description, insight.category].join(' ').toLowerCase()
          );
          
          if (relevance > 0.3) {
            suggestions.push({
              type: 'related_insight',
              title: `Related: ${insight.title}`,
              description: insight.description,
              relevanceScore: relevance
            });
          }
        }
      }

      return suggestions.slice(0, 2);
    } catch (error) {
      console.error('Error finding related insights:', error);
      return [];
    }
  }

  private async findCrossReferences(
    entities: string[],
    moduleContext?: string
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    if (entities.length === 0) return suggestions;

    // Find connected business areas
    const connections = this.getBusinessConnections(entities[0]);
    
    for (const connection of connections) {
      suggestions.push({
        type: 'cross_reference',
        title: `Impact on ${connection.area}`,
        description: connection.description,
        relevanceScore: connection.relevance
      });
    }

    return suggestions.slice(0, 2);
  }

  private generateActionItems(queryIntent: QueryIntent): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    // Generate context-appropriate action items
    if (queryIntent.type === 'trend' && queryIntent.entities.length > 0) {
      suggestions.push({
        type: 'action_item',
        title: 'Create Trend Alert',
        description: `Set up monitoring for ${queryIntent.entities[0]} trends`,
        relevanceScore: 0.7
      });
    }

    return suggestions;
  }

  private async buildNarrative(
    primaryArea: string,
    queryIntent: QueryIntent,
    businessData: string
  ): Promise<BusinessStory> {
    const title = `${primaryArea.charAt(0).toUpperCase() + primaryArea.slice(1)} Performance Story`;
    
    // Extract relevant data points from business data
    const dataPoints = this.extractDataPoints(businessData, primaryArea);
    
    // Generate insights based on the data
    const insights = this.generateInsights(dataPoints, primaryArea);
    
    // Create recommendations
    const recommendations = this.generateRecommendations(insights, primaryArea);
    
    // Build narrative
    const narrative = this.constructNarrative(primaryArea, dataPoints, insights);

    return {
      title,
      narrative,
      dataPoints,
      insights,
      recommendations
    };
  }

  private extractDataPoints(businessData: string, area: string): string[] {
    const lines = businessData.split('\n');
    const relevantLines = lines.filter(line => 
      line.toLowerCase().includes(area) || 
      this.businessKeywords[area]?.some(keyword => line.toLowerCase().includes(keyword))
    );
    
    return relevantLines.slice(0, 5);
  }

  private generateInsights(dataPoints: string[], area: string): string[] {
    const insights: string[] = [];
    
    // Basic pattern recognition
    if (dataPoints.some(point => point.includes('increase') || point.includes('up'))) {
      insights.push(`${area} shows positive growth indicators`);
    }
    
    if (dataPoints.some(point => point.includes('bottleneck') || point.includes('delay'))) {
      insights.push(`${area} has identified process constraints that need attention`);
    }
    
    if (dataPoints.some(point => point.includes('opportunity'))) {
      insights.push(`${area} has untapped potential for improvement`);
    }

    return insights;
  }

  private generateRecommendations(insights: string[], area: string): string[] {
    const recommendations: string[] = [];
    
    insights.forEach(insight => {
      if (insight.includes('growth')) {
        recommendations.push(`Continue investing in ${area} growth initiatives`);
      } else if (insight.includes('constraints')) {
        recommendations.push(`Prioritize ${area} process optimization`);
      } else if (insight.includes('potential')) {
        recommendations.push(`Develop ${area} improvement roadmap`);
      }
    });

    return recommendations;
  }

  private constructNarrative(area: string, dataPoints: string[], insights: string[]): string {
    let narrative = `Our analysis of ${area} reveals several key patterns. `;
    
    if (dataPoints.length > 0) {
      narrative += `Current data shows ${dataPoints.length} significant indicators. `;
    }
    
    if (insights.length > 0) {
      narrative += `Key insights include: ${insights.join(', ')}. `;
    }
    
    narrative += `This information suggests focused attention on ${area} could yield significant business impact.`;
    
    return narrative;
  }

  private calculateRelevanceScore(queryWords: string[], content: string): number {
    const contentWords = content.split(' ');
    const matches = queryWords.filter(word => 
      contentWords.some(contentWord => contentWord.includes(word) || word.includes(contentWord))
    );
    
    return matches.length / queryWords.length;
  }

  private getBusinessConnections(area: string): Array<{area: string, description: string, relevance: number}> {
    const connections: Record<string, Array<{area: string, description: string, relevance: number}>> = {
      sales: [
        { area: 'finance', description: 'Revenue impact and cash flow implications', relevance: 0.9 },
        { area: 'operations', description: 'Delivery capacity and customer satisfaction', relevance: 0.7 }
      ],
      finance: [
        { area: 'operations', description: 'Cost structure and efficiency metrics', relevance: 0.8 },
        { area: 'strategy', description: 'Budget allocation and strategic investments', relevance: 0.9 }
      ],
      operations: [
        { area: 'sales', description: 'Service delivery and customer experience', relevance: 0.8 },
        { area: 'supply', description: 'Supply chain coordination and efficiency', relevance: 0.9 }
      ]
    };

    return connections[area] || [];
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