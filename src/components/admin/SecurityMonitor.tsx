
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SecurityMonitor: React.FC = () => {
  const { data: auditLogs, isLoading, error } = useQuery({
    queryKey: ['security-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching audit logs:', error);
        throw error;
      }
      return data || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 1,
  });

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'select':
        return <Eye className="h-4 w-4" />;
      case 'insert':
      case 'update':
      case 'delete':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string, success: boolean) => {
    if (!success) return 'destructive';
    switch (action.toLowerCase()) {
      case 'select':
        return 'secondary';
      case 'insert':
        return 'default';
      case 'update':
        return 'outline';
      case 'delete':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Activity Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading security logs...</div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Unable to load security logs. The audit system may not be set up yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {auditLogs?.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getActionIcon(log.action)}
                  <div>
                    <div className="font-medium text-sm">
                      {log.resource_type} {log.action}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getActionColor(log.action, log.success)}>
                    {log.action}
                  </Badge>
                  {!log.success && (
                    <Badge variant="destructive">
                      <Lock className="h-3 w-3 mr-1" />
                      Blocked
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {(!auditLogs || auditLogs.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No recent security activity
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityMonitor;
