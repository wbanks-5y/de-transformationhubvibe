import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, TrendingUp, AlertCircle, Users, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface SecurityReport {
  report_period: {
    start: string;
    end: string;
  };
  summary: {
    total_security_events: number;
    failed_events: number;
    success_rate: number;
    unique_users_involved: number;
    critical_alerts: number;
  };
  top_threats: Array<{
    threat_type: string;
    threat_score: number;
    user_id: string;
    details: any;
  }>;
  event_breakdown: Record<string, number>;
}

export const SecurityReportsPanel: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState<'24h' | '7d' | '30d'>('7d');

  const getReportDates = (period: string) => {
    const end = new Date();
    const start = new Date();
    
    switch (period) {
      case '24h':
        start.setHours(start.getHours() - 24);
        break;
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
    }
    
    return { start, end };
  };

  const { data: report, isLoading, error, refetch } = useQuery({
    queryKey: ['security-report', reportPeriod],
    queryFn: async () => {
      const { start, end } = getReportDates(reportPeriod);
      const { data, error } = await supabase.rpc('generate_security_report', {
        start_date: start.toISOString(),
        end_date: end.toISOString()
      });
      if (error) {
        console.error('Error generating report:', error);
        throw error;
      }
      return data as unknown as SecurityReport;
    },
    retry: 1,
  });

  const downloadReport = async () => {
    if (!report) return;
    
    try {
      const reportText = JSON.stringify(report, null, 2);
      const blob = new Blob([reportText], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-report-${reportPeriod}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Security report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatThreatType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Security Reports
          </CardTitle>
          <CardDescription>
            Loading security report...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Security Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Unable to generate security report. The reporting system may not be set up yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Security Reports
            </CardTitle>
            <CardDescription>
              Comprehensive security analytics and insights
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {(['24h', '7d', '30d'] as const).map((period) => (
                <Button
                  key={period}
                  variant={reportPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReportPeriod(period)}
                >
                  {period === '24h' ? '24 Hours' : period === '7d' ? '7 Days' : '30 Days'}
                </Button>
              ))}
            </div>
            <Button onClick={downloadReport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {report && (
          <>
            {/* Summary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Total Events</span>
                </div>
                <div className="text-2xl font-bold">{report.summary.total_security_events}</div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <div className={`text-2xl font-bold ${getSuccessRateColor(report.summary.success_rate)}`}>
                  {report.summary.success_rate}%
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Users Involved</span>
                </div>
                <div className="text-2xl font-bold">{report.summary.unique_users_involved}</div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Critical Alerts</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {report.summary.critical_alerts}
                </div>
              </div>
            </div>

            {/* Top Threats */}
            {report.top_threats && report.top_threats.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Top Security Threats</h3>
                <div className="space-y-3">
                  {report.top_threats.slice(0, 5).map((threat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <div className="font-medium">{formatThreatType(threat.threat_type)}</div>
                        <div className="text-sm text-muted-foreground">User: {threat.user_id}</div>
                      </div>
                      <Badge variant={threat.threat_score >= 50 ? 'destructive' : 'secondary'}>
                        Score: {threat.threat_score}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Breakdown */}
            {report.event_breakdown && Object.keys(report.event_breakdown).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Event Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(report.event_breakdown)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([action, count]) => (
                      <div key={action} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm font-medium">{action.replace(/_/g, ' ')}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Report Period */}
            <div className="text-xs text-muted-foreground border-t pt-4">
              Report Period: {new Date(report.report_period.start).toLocaleString()} - {new Date(report.report_period.end).toLocaleString()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};