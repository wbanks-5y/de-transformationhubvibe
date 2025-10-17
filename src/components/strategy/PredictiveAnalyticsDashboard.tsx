import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, 
  DollarSign, Activity, Brain, Zap, Clock, CheckCircle 
} from "lucide-react";
import { usePredictiveAnalytics } from "@/hooks/use-predictive-analytics";
import { useInitiativeHealthScores } from "@/hooks/use-initiative-health";

const PredictiveAnalyticsDashboard: React.FC = () => {
  const { data: predictions = [], isLoading: predictionsLoading } = usePredictiveAnalytics();
  const { data: healthScores = [] } = useInitiativeHealthScores();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  // Calculate portfolio insights
  const portfolioInsights = React.useMemo(() => {
    if (predictions.length === 0) return null;

    const totalInitiatives = predictions.length;
    const criticalRisk = predictions.filter(p => p.risk_level === 'critical').length;
    const highRisk = predictions.filter(p => p.risk_level === 'high').length;
    const avgCompletionProbability = predictions.reduce((sum, p) => sum + p.completion_probability, 0) / totalInitiatives;
    const improvingTrend = predictions.filter(p => p.velocity_trend === 'improving').length;
    const decliningTrend = predictions.filter(p => p.velocity_trend === 'declining').length;

    const totalBudgetForecast = predictions.reduce((sum, p) => sum + p.budget_forecast, 0);
    const onTimeInitiatives = predictions.filter(p => p.completion_probability >= 70).length;

    return {
      totalInitiatives,
      criticalRisk,
      highRisk,
      avgCompletionProbability: Math.round(avgCompletionProbability),
      improvingTrend,
      decliningTrend,
      totalBudgetForecast,
      onTimeInitiatives,
      portfolioHealth: avgCompletionProbability >= 70 ? 'healthy' : avgCompletionProbability >= 50 ? 'warning' : 'critical'
    };
  }, [predictions]);

  if (predictionsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div>Generating predictive insights...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      {portfolioInsights && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Portfolio Health</span>
              </div>
              <div className="text-2xl font-bold">{portfolioInsights.avgCompletionProbability}%</div>
              <div className="text-xs text-gray-600">Avg Completion Probability</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">At Risk</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {portfolioInsights.criticalRisk + portfolioInsights.highRisk}
              </div>
              <div className="text-xs text-gray-600">High/Critical Risk</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Improving</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{portfolioInsights.improvingTrend}</div>
              <div className="text-xs text-gray-600">Positive Velocity Trend</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Budget Forecast</span>
              </div>
              <div className="text-2xl font-bold">${(portfolioInsights.totalBudgetForecast / 1000).toFixed(0)}K</div>
              <div className="text-xs text-gray-600">Projected Total Cost</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Predictive Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Predictive Analytics & Forecasting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No predictive data available.</p>
                <p className="text-sm mt-2">Add milestones and track progress to generate forecasts.</p>
              </div>
            ) : (
              predictions.map((prediction) => {
                const healthScore = healthScores.find(h => h.id === prediction.initiative_id);
                
                return (
                  <div key={prediction.initiative_id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{prediction.initiative_name}</h4>
                          <Badge className={getRiskColor(prediction.risk_level)}>
                            {prediction.risk_level.toUpperCase()} RISK
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(prediction.velocity_trend)}
                            <span className="text-sm text-gray-600 capitalize">{prediction.velocity_trend}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-blue-500" />
                            <div>
                              <div className="font-medium">
                                {new Date(prediction.predicted_completion_date).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">Predicted Completion</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-green-500" />
                            <div>
                              <div className="font-medium">{prediction.completion_probability}%</div>
                              <div className="text-xs text-gray-500">Success Probability</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-purple-500" />
                            <div>
                              <div className="font-medium">${(prediction.budget_forecast / 1000).toFixed(0)}K</div>
                              <div className="text-xs text-gray-500">Budget Forecast</div>
                            </div>
                          </div>

                          {healthScore && (
                            <div className="flex items-center gap-2">
                              <Activity className="h-3 w-3 text-orange-500" />
                              <div>
                                <div className="font-medium">{Math.round(healthScore.health_score)}%</div>
                                <div className="text-xs text-gray-500">Current Health</div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <Progress value={prediction.completion_probability} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">Completion Probability</div>
                        </div>

                        {/* Potential Issues */}
                        {prediction.potential_delays.length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Potential Issues:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {prediction.potential_delays.map((delay, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs text-orange-600">
                                  {delay}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {prediction.recommendations.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              Recommendations:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {prediction.recommendations.map((rec, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs text-blue-600">
                                  {rec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;