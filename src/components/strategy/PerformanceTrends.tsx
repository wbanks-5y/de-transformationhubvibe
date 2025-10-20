import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useStrategicHealthPeriods } from '@/hooks/use-strategic-health-periods';
import { exportTrendsData } from '@/utils/trendsExport';
import { toast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Calendar,
  AlertTriangle,
  Target,
  Activity
} from 'lucide-react';

interface TrendData {
  objectiveId: string;
  objectiveName: string;
  perspective: string;
  currentScore: number;
  previousScore: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
  ragStatus: string;
}

interface PeriodComparison {
  period: string;
  healthScore: number;
  ragStatus: string;
}

const PerformanceTrends: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');

  // Fetch data for multiple periods
  const { data: currentData, isLoading: currentLoading } = useStrategicHealthPeriods('current');
  const { data: q1Data, isLoading: q1Loading } = useStrategicHealthPeriods('q1');
  const { data: q2Data, isLoading: q2Loading } = useStrategicHealthPeriods('q2');
  const { data: q3Data, isLoading: q3Loading } = useStrategicHealthPeriods('q3');
  const { data: q4Data, isLoading: q4Loading } = useStrategicHealthPeriods('q4');

  const isLoading = currentLoading || q1Loading || q2Loading || q3Loading || q4Loading;

  // Process trend data
  const trendData = useMemo((): TrendData[] => {
    if (!currentData || !q3Data) return [];

    return currentData.map(current => {
      const previous = q3Data.find(
        item => item.strategic_objectives?.id === current.strategic_objectives?.id
      );

      if (!previous) return null;

      const currentScore = current.health_score || 0;
      const previousScore = previous.health_score || 0;
      const change = currentScore - previousScore;
      const changePercent = previousScore !== 0 ? (change / previousScore) * 100 : 0;

      let direction: 'up' | 'down' | 'stable' = 'stable';
      if (Math.abs(changePercent) > 5) {
        direction = change > 0 ? 'up' : 'down';
      }

      return {
        objectiveId: current.strategic_objectives?.id || '',
        objectiveName: current.strategic_objectives?.display_name || current.strategic_objectives?.name || '',
        perspective: current.strategic_objectives?.perspective || '',
        currentScore,
        previousScore,
        trendDirection: direction,
        trendPercentage: changePercent,
        ragStatus: current.rag_status || 'unknown'
      };
    }).filter(Boolean) as TrendData[];
  }, [currentData, q3Data]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const avgHealth = trendData.reduce((sum, obj) => sum + obj.currentScore, 0) / (trendData.length || 1);
    const improvingCount = trendData.filter(obj => obj.trendDirection === 'up').length;
    const decliningCount = trendData.filter(obj => obj.trendDirection === 'down').length;
    const topPerformer = trendData.reduce((best, obj) => 
      obj.trendPercentage > (best?.trendPercentage || -Infinity) ? obj : best
    , trendData[0]);

    return {
      avgHealth: Math.round(avgHealth),
      improvingCount,
      decliningCount,
      atRiskCount: decliningCount,
      topPerformer,
      improvementRate: trendData.length > 0 ? (improvingCount / trendData.length) * 100 : 0
    };
  }, [trendData]);

  // Historical performance data
  const historicalData = useMemo(() => {
    const periods = [
      { name: 'Q1', data: q1Data },
      { name: 'Q2', data: q2Data },
      { name: 'Q3', data: q3Data },
      { name: 'Q4', data: q4Data },
      { name: 'Current', data: currentData }
    ];

    return periods.map(period => {
      const data = period.data || [];
      const avgScore = data.reduce((sum, item) => sum + (item.health_score || 0), 0) / (data.length || 1);
      
      const perspectives = {
        Financial: data.filter(item => item.strategic_objectives?.perspective === 'Financial'),
        Customer: data.filter(item => item.strategic_objectives?.perspective === 'Customer'),
        Internal: data.filter(item => item.strategic_objectives?.perspective === 'Internal Processes'),
        Learning: data.filter(item => item.strategic_objectives?.perspective === 'Learning & Growth')
      };

      return {
        period: period.name,
        overall: Math.round(avgScore),
        Financial: Math.round(perspectives.Financial.reduce((sum, item) => sum + (item.health_score || 0), 0) / (perspectives.Financial.length || 1)),
        Customer: Math.round(perspectives.Customer.reduce((sum, item) => sum + (item.health_score || 0), 0) / (perspectives.Customer.length || 1)),
        Internal: Math.round(perspectives.Internal.reduce((sum, item) => sum + (item.health_score || 0), 0) / (perspectives.Internal.length || 1)),
        Learning: Math.round(perspectives.Learning.reduce((sum, item) => sum + (item.health_score || 0), 0) / (perspectives.Learning.length || 1))
      };
    });
  }, [q1Data, q2Data, q3Data, q4Data, currentData]);

  // Forecast data (simple linear regression)
  const forecastData = useMemo(() => {
    if (historicalData.length < 2) return [];

    return trendData.map(obj => {
      const trend = obj.trendPercentage;
      const projected = obj.currentScore + (obj.currentScore * trend / 100);
      const confidenceRange = Math.abs(projected - obj.currentScore) * 0.2;

      return {
        objectiveId: obj.objectiveId,
        objectiveName: obj.objectiveName,
        perspective: obj.perspective,
        currentScore: obj.currentScore,
        projectedScore: Math.round(Math.max(0, Math.min(100, projected))),
        confidenceLower: Math.round(Math.max(0, projected - confidenceRange)),
        confidenceUpper: Math.round(Math.min(100, projected + confidenceRange)),
        riskLevel: projected < 60 ? 'high' : projected < 75 ? 'medium' : 'low'
      };
    });
  }, [trendData, historicalData]);

  // Comparative analysis data
  const comparativeData = useMemo(() => {
    if (!q3Data || !currentData) return [];

    const perspectives = ['Financial', 'Customer', 'Internal Processes', 'Learning & Growth'];

    return perspectives.map(perspective => {
      const q3Items = q3Data.filter(item => item.strategic_objectives?.perspective === perspective);
      const currentItems = currentData.filter(item => item.strategic_objectives?.perspective === perspective);

      const q3Avg = q3Items.reduce((sum, item) => sum + (item.health_score || 0), 0) / (q3Items.length || 1);
      const currentAvg = currentItems.reduce((sum, item) => sum + (item.health_score || 0), 0) / (currentItems.length || 1);

      return {
        perspective: perspective.replace('Internal Processes', 'Internal').replace('Learning & Growth', 'Learning'),
        'Q3 2024': Math.round(q3Avg),
        'Current': Math.round(currentAvg),
        change: Math.round(currentAvg - q3Avg)
      };
    });
  }, [q3Data, currentData]);

  const handleExport = () => {
    try {
      exportTrendsData(trendData, selectedTimeframe);
      toast.success("Trend data has been exported to CSV.");
    } catch (error) {
      toast.error("There was an error exporting the data.");
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRagColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'green':
        return 'bg-success/10 text-success border-success/20';
      case 'amber':
      case 'yellow':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'red':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Performance Trends</h1>
          <p className="text-muted-foreground mt-1">
            Historical analysis, trend identification, and performance forecasting
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overall Health Trend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">{summaryMetrics.avgHealth}%</div>
              {getTrendIcon(summaryMetrics.avgHealth > 75 ? 'up' : summaryMetrics.avgHealth < 60 ? 'down' : 'stable')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average score across all objectives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Objectives at Risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-destructive">{summaryMetrics.atRiskCount}</div>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Showing declining trends</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Top Performer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-foreground truncate">
              {summaryMetrics.topPerformer?.objectiveName || 'N/A'}
            </div>
            <p className="text-xs text-success mt-1">
              +{Math.round(summaryMetrics.topPerformer?.trendPercentage || 0)}% improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Improvement Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-success">{Math.round(summaryMetrics.improvementRate)}%</div>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Objectives showing improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="historical" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="historical">Historical</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="forecast">Forecasting</TabsTrigger>
          <TabsTrigger value="comparative">Comparative</TabsTrigger>
        </TabsList>

        {/* Tab 1: Historical Performance */}
        <TabsContent value="historical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Health Score Over Time</CardTitle>
              <CardDescription>Aggregate health score across all objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="period" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="overall" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perspective-Wise Health Trends</CardTitle>
              <CardDescription>Performance breakdown by balanced scorecard perspective</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="period" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="Financial" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Customer" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Internal" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Learning" stackId="1" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Best Performing Objectives</CardTitle>
                <CardDescription>Top 3 highest average scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendData
                    .sort((a, b) => b.currentScore - a.currentScore)
                    .slice(0, 3)
                    .map((obj, index) => (
                      <div key={obj.objectiveId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{obj.objectiveName}</p>
                            <p className="text-xs text-muted-foreground">{obj.perspective}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{obj.currentScore}%</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Improved Objectives</CardTitle>
                <CardDescription>Top 3 highest positive trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendData
                    .filter(obj => obj.trendDirection === 'up')
                    .sort((a, b) => b.trendPercentage - a.trendPercentage)
                    .slice(0, 3)
                    .map((obj, index) => (
                      <div key={obj.objectiveId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-white font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{obj.objectiveName}</p>
                            <p className="text-xs text-muted-foreground">{obj.perspective}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success">+{Math.round(obj.trendPercentage)}%</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Trend Analysis */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Objective Trends Overview</CardTitle>
              <CardDescription>Detailed trend analysis for all strategic objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendData
                  .sort((a, b) => b.trendPercentage - a.trendPercentage)
                  .map(obj => (
                    <div
                      key={obj.objectiveId}
                      className={`p-4 rounded-lg border-2 ${
                        obj.trendDirection === 'up'
                          ? 'border-success/20 bg-success/5'
                          : obj.trendDirection === 'down'
                          ? 'border-destructive/20 bg-destructive/5'
                          : 'border-muted bg-muted/5'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className={getRagColor(obj.ragStatus)}>
                          {obj.ragStatus}
                        </Badge>
                        {getTrendIcon(obj.trendDirection)}
                      </div>
                      <h4 className="font-semibold text-sm text-foreground mb-1">{obj.objectiveName}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{obj.perspective}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-foreground">{obj.currentScore}%</p>
                          <p className="text-xs text-muted-foreground">Current Score</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-semibold ${
                            obj.trendDirection === 'up' ? 'text-success' :
                            obj.trendDirection === 'down' ? 'text-destructive' :
                            'text-muted-foreground'
                          }`}>
                            {obj.trendPercentage > 0 ? '+' : ''}{Math.round(obj.trendPercentage)}%
                          </p>
                          <p className="text-xs text-muted-foreground">vs Previous</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Forecasting */}
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projected Performance - Next Quarter</CardTitle>
              <CardDescription>Linear regression forecast with confidence intervals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forecastData
                  .sort((a, b) => a.riskLevel === 'high' ? -1 : 1)
                  .map(forecast => (
                    <div
                      key={forecast.objectiveId}
                      className={`p-4 rounded-lg border ${
                        forecast.riskLevel === 'high'
                          ? 'border-destructive bg-destructive/5'
                          : forecast.riskLevel === 'medium'
                          ? 'border-warning bg-warning/5'
                          : 'border-success bg-success/5'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={forecast.riskLevel === 'high' ? 'destructive' : 'outline'}>
                          {forecast.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm text-foreground mb-1">{forecast.objectiveName}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{forecast.perspective}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Current:</span>
                          <span className="font-semibold text-foreground">{forecast.currentScore}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Projected:</span>
                          <span className={`font-semibold ${
                            forecast.projectedScore > forecast.currentScore ? 'text-success' : 'text-destructive'
                          }`}>
                            {forecast.projectedScore}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Range:</span>
                          <span className="text-xs text-muted-foreground">
                            {forecast.confidenceLower}% - {forecast.confidenceUpper}%
                          </span>
                        </div>
                      </div>
                      {forecast.riskLevel === 'high' && (
                        <div className="mt-3 p-2 rounded bg-destructive/10">
                          <p className="text-xs text-destructive">
                            ⚠️ Requires immediate attention
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Comparative Analysis */}
        <TabsContent value="comparative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quarter-over-Quarter Comparison</CardTitle>
              <CardDescription>Performance changes by perspective</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparativeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="perspective" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Q3 2024" fill="#94a3b8" />
                  <Bar dataKey="Current" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Delta by Perspective</CardTitle>
              <CardDescription>Absolute change from Q3 to Current period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {comparativeData.map(item => (
                  <div key={item.perspective} className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold text-sm text-foreground mb-3">{item.perspective}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Q3:</span>
                        <span className="font-medium text-foreground">{item['Q3 2024']}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Current:</span>
                        <span className="font-medium text-foreground">{item['Current']}%</span>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Change:</span>
                          <span className={`font-bold flex items-center gap-1 ${
                            item.change > 0 ? 'text-success' : item.change < 0 ? 'text-destructive' : 'text-muted-foreground'
                          }`}>
                            {item.change > 0 ? <TrendingUp className="h-3 w-3" /> : item.change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                            {item.change > 0 ? '+' : ''}{item.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceTrends;
