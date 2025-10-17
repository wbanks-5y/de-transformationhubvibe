import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Shield, Clock, User } from 'lucide-react';

interface SecurityThreat {
  threat_type: string;
  user_id: string;
  threat_score: number;
  details: any;
  last_activity: string;
}

export const SecurityThreatMonitor: React.FC = () => {
  const { data: threats, isLoading, error } = useQuery({
    queryKey: ['security-threats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('detect_security_threats');
      if (error) {
        console.error('Error detecting threats:', error);
        throw error;
      }
      return (data as SecurityThreat[]) || [];
    },
    refetchInterval: 30000,
    retry: 1,
  });

  const getThreatColor = (score: number) => {
    if (score >= 50) return 'destructive';
    if (score >= 30) return 'secondary';
    return 'outline';
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'repeated_failed_access':
        return <Shield className="h-4 w-4" />;
      case 'privilege_escalation_attempt':
        return <AlertTriangle className="h-4 w-4" />;
      case 'rapid_consecutive_actions':
        return <Clock className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const formatThreatType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Threat Monitor
          </CardTitle>
          <CardDescription>
            Loading threat analysis...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
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
            <AlertTriangle className="h-5 w-5" />
            Security Threat Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Unable to load threat detection. The security monitoring system may not be set up yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Security Threat Monitor
          {threats && threats.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {threats.length} Active
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Real-time security threat detection and analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!threats || threats.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              No active security threats detected
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {threats.map((threat, index) => (
              <Alert key={index} variant={threat.threat_score >= 50 ? "destructive" : "default"}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getThreatIcon(threat.threat_type)}
                    <div className="flex-1">
                      <AlertTitle className="flex items-center gap-2">
                        {formatThreatType(threat.threat_type)}
                        <Badge variant={getThreatColor(threat.threat_score)}>
                          Score: {threat.threat_score}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <div className="space-y-1">
                          <p><strong>User ID:</strong> {threat.user_id}</p>
                          <p><strong>Last Activity:</strong> {new Date(threat.last_activity).toLocaleString()}</p>
                          {threat.details.failed_attempts && (
                            <p><strong>Failed Attempts:</strong> {threat.details.failed_attempts}</p>
                          )}
                          {threat.details.action_count && (
                            <p><strong>Action Count:</strong> {threat.details.action_count}</p>
                          )}
                          {threat.details.escalation_attempts && (
                            <p><strong>Escalation Attempts:</strong> {threat.details.escalation_attempts}</p>
                          )}
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};