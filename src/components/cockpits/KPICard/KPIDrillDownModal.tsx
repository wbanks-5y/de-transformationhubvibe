
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CockpitKPI } from "@/types/cockpit";
import { useKPITimeSeriesData } from "@/hooks/use-kpi-time-series-data";
import { useKPITargets } from "@/hooks/use-kpi-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Loader2, TrendingUp, TrendingDown, Target } from "lucide-react";

interface KPIDrillDownModalProps {
  kpi: CockpitKPI;
  isOpen: boolean;
  onClose: () => void;
}

const KPIDrillDownModal: React.FC<KPIDrillDownModalProps> = ({ 
  kpi, 
  isOpen, 
  onClose 
}) => {
  const { data: timeSeriesData, isLoading } = useKPITimeSeriesData(kpi.id);
  const { data: targets = [] } = useKPITargets(kpi.id);

  const formatValue = (value: number) => {
    switch (kpi.format_type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  // Function to find the appropriate target for a given period
  const findTargetForPeriod = (periodStart: string, periodEnd: string) => {
    return targets.find(target => {
      if (target.target_type === 'single') {
        return true; // Single targets apply to all periods
      }
      
      if (target.target_type === 'time_based' && target.period_start && target.period_end) {
        // Check if the period overlaps with the target period
        return periodStart >= target.period_start && periodEnd <= target.period_end;
      }
      
      return false;
    });
  };

  // Calculate trend percentage between two values
  const calculateTrendPercentage = (currentValue: number, previousValue: number) => {
    if (previousValue === 0) {
      return null; // No baseline to compare against
    }
    return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
  };

  // Enhance time series data with target information and trend calculations
  const enhancedTimeSeriesData = timeSeriesData?.map((point, index) => {
    const target = findTargetForPeriod(point.period_start, point.period_end);
    const targetValue = target?.target_value || null;
    
    // Calculate achievement percentage
    let achievementPercentage = null;
    if (targetValue && targetValue > 0) {
      if (kpi.trend_direction === 'lower_is_better') {
        achievementPercentage = point.current_value > 0 ? (targetValue / point.current_value) * 100 : 100;
      } else {
        achievementPercentage = (point.current_value / targetValue) * 100;
      }
    }

    // Calculate trend percentage compared to previous period
    let trendPercentage = null;
    if (index > 0 && timeSeriesData) {
      const previousValue = timeSeriesData[index - 1].current_value;
      trendPercentage = calculateTrendPercentage(point.current_value, previousValue);
    }

    return {
      ...point,
      target_value: targetValue,
      target_achievement_percentage: achievementPercentage,
      trend_percentage: trendPercentage
    };
  }) || [];

  const chartData = enhancedTimeSeriesData.map(point => ({
    date: format(new Date(point.period_start), 'MMM yyyy'),
    actual: point.current_value,
    target: point.target_value,
    achievement: point.target_achievement_percentage
  }));

  const latestValue = enhancedTimeSeriesData[enhancedTimeSeriesData.length - 1];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[98vw] sm:max-w-2xl md:max-w-4xl h-[98vh] sm:max-h-[90vh] overflow-hidden flex flex-col p-2 sm:p-3 md:p-6">
        <DialogHeader className="flex-shrink-0 pb-1 sm:pb-2 md:pb-4">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base md:text-lg">
            <span className="truncate text-xs sm:text-sm md:text-base">{kpi.display_name}</span>
            <Badge variant="outline" className="self-start sm:self-auto text-[10px] sm:text-xs">
              {kpi.kpi_data_type}
            </Badge>
          </DialogTitle>
          {kpi.description && (
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2">
              {kpi.description}
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-24 sm:h-32 md:h-64">
              <Loader2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 md:space-y-6 pb-2 sm:pb-4">
              {/* Current Value Summary */}
              {latestValue && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  <Card className="border-0 sm:border bg-gray-50 sm:bg-white">
                    <CardHeader className="pb-1 px-2 sm:px-3 md:px-6 pt-1 sm:pt-2 md:pt-6">
                      <CardTitle className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Current Value</CardTitle>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-3 md:px-6 pb-1 sm:pb-2 md:pb-6">
                      <div className="text-sm sm:text-lg md:text-2xl font-bold">
                        {formatValue(latestValue.current_value)}
                      </div>
                      {latestValue.trend_percentage !== null && (
                        <div className={`flex items-center gap-1 text-[10px] sm:text-xs md:text-sm ${
                          latestValue.trend_percentage > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {latestValue.trend_percentage > 0 ? (
                            <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                          ) : (
                            <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                          )}
                          {Math.abs(latestValue.trend_percentage).toFixed(1)}%
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {latestValue.target_value && (
                    <Card className="border-0 sm:border bg-gray-50 sm:bg-white">
                      <CardHeader className="pb-1 px-2 sm:px-3 md:px-6 pt-1 sm:pt-2 md:pt-6">
                        <CardTitle className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Target Value</CardTitle>
                      </CardHeader>
                      <CardContent className="px-2 sm:px-3 md:px-6 pb-1 sm:pb-2 md:pb-6">
                        <div className="text-sm sm:text-lg md:text-2xl font-bold">
                          {formatValue(latestValue.target_value)}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                          <Target className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                          Current period target
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {latestValue.target_achievement_percentage && (
                    <Card className="border-0 sm:border bg-gray-50 sm:bg-white sm:col-span-2 lg:col-span-1">
                      <CardHeader className="pb-1 px-2 sm:px-3 md:px-6 pt-1 sm:pt-2 md:pt-6">
                        <CardTitle className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Achievement</CardTitle>
                      </CardHeader>
                      <CardContent className="px-2 sm:px-3 md:px-6 pb-1 sm:pb-2 md:pb-6">
                        <div className={`text-sm sm:text-lg md:text-2xl font-bold ${
                          latestValue.target_achievement_percentage >= 100 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {latestValue.target_achievement_percentage.toFixed(1)}%
                        </div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                          of target achieved
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Show message if no targets are configured */}
              {targets.length === 0 && (
                <Card>
                  <CardContent className="text-center py-3 sm:py-6 md:py-8 px-2 sm:px-3 md:px-6">
                    <Target className="mx-auto h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 text-gray-400 mb-1 sm:mb-2 md:mb-4" />
                    <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm">
                      No targets configured for this KPI. Add targets to see achievement metrics.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Time Series Chart */}
              {chartData.length > 0 && (
                <Card>
                  <CardHeader className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-6">
                    <CardTitle className="text-xs sm:text-sm md:text-base">Historical Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="px-1 sm:px-2 md:px-6 pb-2 sm:pb-3 md:pb-6">
                    <div className="h-32 sm:h-48 md:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 9 }}
                            interval="preserveStartEnd"
                          />
                          <YAxis tick={{ fontSize: 9 }} />
                          <Tooltip 
                            formatter={(value, name) => [
                              formatValue(Number(value)), 
                              name === 'actual' ? 'Actual' : name === 'target' ? 'Target' : 'Achievement %'
                            ]}
                            contentStyle={{ fontSize: '10px' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="actual" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            name="actual"
                          />
                          {chartData.some(d => d.target) && (
                            <Line 
                              type="monotone" 
                              dataKey="target" 
                              stroke="#10B981" 
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              name="target"
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Data Table */}
              {enhancedTimeSeriesData && enhancedTimeSeriesData.length > 0 && (
                <Card>
                  <CardHeader className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-6">
                    <CardTitle className="text-xs sm:text-sm md:text-base">Historical Data</CardTitle>
                  </CardHeader>
                  <CardContent className="px-2 sm:px-3 md:px-6 pb-2 sm:pb-3 md:pb-6">
                    <div className="overflow-x-auto -mx-2 sm:-mx-3 md:mx-0">
                      <table className="w-full text-[10px] sm:text-xs md:text-sm min-w-[400px] sm:min-w-[500px] md:min-w-0">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-1 sm:p-2 font-medium">Period</th>
                            <th className="text-right p-1 sm:p-2 font-medium">Actual</th>
                            <th className="text-right p-1 sm:p-2 font-medium">Target</th>
                            <th className="text-right p-1 sm:p-2 font-medium">Achievement</th>
                            <th className="text-right p-1 sm:p-2 font-medium">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enhancedTimeSeriesData.map((point) => (
                            <tr key={point.id} className="border-b">
                              <td className="p-1 sm:p-2">
                                {format(new Date(point.period_start), 'MMM yyyy')}
                              </td>
                              <td className="text-right p-1 sm:p-2 font-medium">
                                {formatValue(point.current_value)}
                              </td>
                              <td className="text-right p-1 sm:p-2">
                                {point.target_value ? formatValue(point.target_value) : '-'}
                              </td>
                              <td className="text-right p-1 sm:p-2">
                                {point.target_achievement_percentage ? 
                                  `${point.target_achievement_percentage.toFixed(1)}%` : '-'}
                              </td>
                              <td className="text-right p-1 sm:p-2">
                                {point.trend_percentage !== null ? (
                                  <span className={`flex items-center justify-end gap-1 ${
                                    point.trend_percentage > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {point.trend_percentage > 0 ? (
                                      <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
                                    ) : (
                                      <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3" />
                                    )}
                                    {Math.abs(point.trend_percentage).toFixed(1)}%
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(!enhancedTimeSeriesData || enhancedTimeSeriesData.length === 0) && (
                <Card>
                  <CardContent className="text-center py-3 sm:py-6 md:py-8 px-2 sm:px-3 md:px-6">
                    <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm">
                      No historical data available for this KPI.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KPIDrillDownModal;
