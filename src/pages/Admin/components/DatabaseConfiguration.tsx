import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useOrganization } from "@/context/OrganizationContext";
import { createClient } from '@supabase/supabase-js';

interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'testing';
  lastTested?: Date;
}

const DatabaseConfiguration: React.FC = () => {
  const { currentOrganization } = useOrganization();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'disconnected'
  });
  const [isTesting, setIsTesting] = useState(false);

  const testConnection = async () => {
    if (!currentOrganization) {
      toast.error('No organization connected');
      return;
    }

    setIsTesting(true);
    setConnectionStatus({ status: 'testing' });
    
    try {
      console.log('Testing connection to:', currentOrganization.supabase_url);
      
      // Create a temporary client to test the connection
      const testClient = createClient(
        currentOrganization.supabase_url,
        currentOrganization.supabase_anon_key
      );
      
      // Test the connection
      const { data, error } = await testClient.auth.getSession();
      
      if (error && error.message && error.message.includes('fetch')) {
        throw new Error('Network connection failed - check URL');
      }

      setConnectionStatus({ 
        status: 'connected',
        lastTested: new Date()
      });
      toast.success(`Connection to ${currentOrganization.name} successful`);
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus({ 
        status: 'disconnected',
        lastTested: new Date()
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Connection failed: ${errorMessage}`);
    } finally {
      setIsTesting(false);
    }
  };

  // Show error if no organization
  if (!currentOrganization) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              No Organization Connected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Please ensure you are logged into an organization to view database details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Database Information</h1>
        <p className="text-gray-500 mt-2">
          View your organization's Supabase database connection details (Read-Only)
        </p>
      </div>

      {/* Organization Database Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Current Organization Database
          </CardTitle>
          <CardDescription>
            Database connection for {currentOrganization.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Organization Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">Organization</label>
              <p className="mt-1 text-sm text-gray-900">{currentOrganization.name}</p>
            </div>

            {/* Organization Slug */}
            <div>
              <label className="text-sm font-medium text-gray-700">Organization Slug</label>
              <p className="mt-1 text-sm text-gray-900 font-mono">{currentOrganization.slug}</p>
            </div>

            {/* Database URL */}
            <div>
              <label className="text-sm font-medium text-gray-700">Supabase Project URL</label>
              <p className="mt-1 text-sm text-gray-900 font-mono break-all">
                {currentOrganization.supabase_url}
              </p>
            </div>

            {/* Anon Key (masked) */}
            <div>
              <label className="text-sm font-medium text-gray-700">Anonymous Key</label>
              <p className="mt-1 text-sm text-gray-900 font-mono">
                {currentOrganization.supabase_anon_key.substring(0, 20)}...
                <span className="text-gray-400 ml-2">(masked for security)</span>
              </p>
            </div>

            {/* Connection Status & Test */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Connection Status:</span>
                <Badge variant={connectionStatus.status === 'connected' ? 'default' : 
                               connectionStatus.status === 'testing' ? 'secondary' : 'destructive'}>
                  {connectionStatus.status === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {connectionStatus.status === 'disconnected' && <AlertCircle className="h-3 w-3 mr-1" />}
                  {connectionStatus.status === 'testing' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                  {connectionStatus.status === 'connected' ? 'Connected' :
                   connectionStatus.status === 'testing' ? 'Testing...' : 'Not Tested'}
                </Badge>
                {connectionStatus.lastTested && (
                  <span className="text-xs text-gray-500">
                    Last tested: {connectionStatus.lastTested.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                onClick={testConnection}
                disabled={isTesting}
              >
                {isTesting && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                Test Connection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              • This page displays <strong>read-only</strong> information about your organization's database connection.
            </p>
            <p>
              • Database switching and configuration management is handled by system administrators through the Management Database.
            </p>
            <p>
              • The "Test Connection" button verifies that your organization's Supabase project is accessible.
            </p>
            <p>
              • If you need to modify database settings, please contact your system administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseConfiguration;
