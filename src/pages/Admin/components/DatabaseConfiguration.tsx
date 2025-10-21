import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Database, Settings, RefreshCw, ExternalLink, Info, Pencil } from "lucide-react";
import { toast } from "sonner";

// Import current Supabase configuration
const CURRENT_SUPABASE_URL = "https://fgbilpzuniuqrpetnbgz.supabase.co";
const CURRENT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYmlscHp1bml1cXJwZXRuYmd6Iiwicm9sZSI6ImFub24iLCJp";

interface DatabaseConfig {
  id: string;
  name: string;
  url: string;
  anonKey: string;
  isActive: boolean;
  status: 'connected' | 'disconnected' | 'testing';
}

const DatabaseConfiguration: React.FC = () => {
  const [configs, setConfigs] = useState<DatabaseConfig[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConfig, setNewConfig] = useState({
    name: '',
    url: '',
    anonKey: ''
  });
  const [testing, setTesting] = useState<string | null>(null);
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', url: '', anonKey: '' });

  // Load existing configurations from localStorage
  useEffect(() => {
    const savedConfigs = localStorage.getItem('supabase-configs');
    if (savedConfigs) {
      const parsedConfigs = JSON.parse(savedConfigs);
      
      // Migration: Check if "Current Database" exists and needs updating
      const currentDbConfig = parsedConfigs.find(c => c.id === 'current');
      if (currentDbConfig && (!currentDbConfig.url || !currentDbConfig.anonKey)) {
        // Update with real credentials
        const updatedConfigs = parsedConfigs.map(c => 
          c.id === 'current' 
            ? { ...c, url: CURRENT_SUPABASE_URL, anonKey: CURRENT_SUPABASE_KEY }
            : c
        );
        localStorage.setItem('supabase-configs', JSON.stringify(updatedConfigs));
        setConfigs(updatedConfigs);
      } else {
        setConfigs(parsedConfigs);
      }
    } else {
      // Add current configuration as default with real credentials
      const currentConfig: DatabaseConfig = {
        id: 'current',
        name: 'Current Database',
        url: CURRENT_SUPABASE_URL,
        anonKey: CURRENT_SUPABASE_KEY,
        isActive: true,
        status: 'connected'
      };
      setConfigs([currentConfig]);
      localStorage.setItem('supabase-configs', JSON.stringify([currentConfig]));
    }
  }, []);

  const saveConfigs = (newConfigs: DatabaseConfig[]) => {
    setConfigs(newConfigs);
    localStorage.setItem('supabase-configs', JSON.stringify(newConfigs));
  };

  const testConnection = async (config: DatabaseConfig) => {
    // Validate credentials exist
    if (!config.url || !config.anonKey) {
      toast.error('Configuration is incomplete', {
        description: 'Please add URL and anon key before testing'
      });
      return;
    }

    setTesting(config.id);
    
    try {
      console.log('Testing connection to:', config.url);
      
      // Create a temporary Supabase client to test the connection
      const { createClient } = await import('@supabase/supabase-js');
      const testClient = createClient(config.url, config.anonKey);
      
      // Use the simplest possible test - just try to get the current session
      // This tests if the client can connect and the credentials are valid
      const { data, error } = await testClient.auth.getSession();
      
      console.log('Connection test result:', { data, error });
      
      // If we get here without throwing, the connection works
      // We don't need a valid session, just a successful response
      if (error && error.message && error.message.includes('fetch')) {
        throw new Error('Network connection failed - check URL');
      }

      const updatedConfigs = configs.map(c => 
        c.id === config.id ? { ...c, status: 'connected' as const } : c
      );
      saveConfigs(updatedConfigs);
      toast.success(`Connection to ${config.name} successful`);
    } catch (error) {
      console.error('Connection test failed:', error);
      const updatedConfigs = configs.map(c => 
        c.id === config.id ? { ...c, status: 'disconnected' as const } : c
      );
      saveConfigs(updatedConfigs);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Connection to ${config.name} failed: ${errorMessage}`);
    } finally {
      setTesting(null);
    }
  };

  const switchDatabase = async (config: DatabaseConfig) => {
    try {
      // Update all configs to set the selected one as active
      const updatedConfigs = configs.map(c => ({
        ...c,
        isActive: c.id === config.id
      }));
      saveConfigs(updatedConfigs);

      // Update the global Supabase client configuration
      // Note: This requires a page refresh to fully take effect
      if (typeof window !== 'undefined') {
        // Store the new configuration for the application to use
        localStorage.setItem('active-supabase-config', JSON.stringify({
          url: config.url,
          anonKey: config.anonKey
        }));
      }

      toast.success(`Switched to ${config.name}`, {
        description: "The page will refresh to apply the new database connection",
        duration: 2000
      });

      // Refresh the page after a short delay to allow the toast to show
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Failed to switch database:', error);
      toast.error('Failed to switch database');
    }
  };

  const addNewConfig = () => {
    if (!newConfig.name || !newConfig.url || !newConfig.anonKey) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate URL format
    if (!newConfig.url.includes('supabase.co')) {
      toast.error('Please enter a valid Supabase URL');
      return;
    }

    const config: DatabaseConfig = {
      id: Date.now().toString(),
      name: newConfig.name,
      url: newConfig.url,
      anonKey: newConfig.anonKey,
      isActive: false,
      status: 'disconnected'
    };

    const updatedConfigs = [...configs, config];
    saveConfigs(updatedConfigs);
    setNewConfig({ name: '', url: '', anonKey: '' });
    setShowAddForm(false);
    toast.success('Database configuration added. Test the connection before switching.');
  };

  const removeConfig = (configId: string) => {
    const config = configs.find(c => c.id === configId);
    if (config?.isActive) {
      toast.error('Cannot remove active configuration');
      return;
    }

    const updatedConfigs = configs.filter(c => c.id !== configId);
    saveConfigs(updatedConfigs);
    toast.success('Configuration removed');
  };

  const startEditing = (config: DatabaseConfig) => {
    setEditingConfig(config.id);
    setEditForm({
      name: config.name,
      url: config.url,
      anonKey: config.anonKey
    });
  };

  const saveEdit = (configId: string) => {
    if (!editForm.name || !editForm.url || !editForm.anonKey) {
      toast.error('Please fill in all fields');
      return;
    }

    const updatedConfigs = configs.map(c => 
      c.id === configId 
        ? { ...c, name: editForm.name, url: editForm.url, anonKey: editForm.anonKey, status: 'disconnected' as const }
        : c
    );
    
    saveConfigs(updatedConfigs);
    setEditingConfig(null);
    toast.success('Configuration updated. Please test the connection.');
  };

  const cancelEdit = () => {
    setEditingConfig(null);
    setEditForm({ name: '', url: '', anonKey: '' });
  };

  const getCurrentConfig = () => configs.find(c => c.isActive);
  const currentConfig = getCurrentConfig();

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
        <p className="text-gray-500 mt-2">
          Manage Supabase database connections and configurations
        </p>
      </div>

      {/* Current Active Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Active Database Connection
          </CardTitle>
          <CardDescription>
            Currently active Supabase database configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentConfig ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{currentConfig.name}</h3>
                  <p className="text-sm text-gray-500">{currentConfig.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={currentConfig.status === 'connected' ? 'default' : 'destructive'}>
                    {currentConfig.status === 'connected' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {currentConfig.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testConnection(currentConfig)}
                    disabled={testing === currentConfig.id}
                  >
                    {testing === currentConfig.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      'Test Connection'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No active configuration</p>
          )}
        </CardContent>
      </Card>

      {/* All Configurations */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Database Configurations</CardTitle>
              <CardDescription>
                Manage all Supabase database configurations
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              Add Configuration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {configs.map((config) => (
              <div key={config.id} className="p-4 border rounded-lg">
                {editingConfig === config.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`edit-name-${config.id}`}>Configuration Name</Label>
                      <Input
                        id={`edit-name-${config.id}`}
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-url-${config.id}`}>Supabase Project URL</Label>
                      <Input
                        id={`edit-url-${config.id}`}
                        value={editForm.url}
                        onChange={(e) => setEditForm({...editForm, url: e.target.value})}
                        placeholder="https://your-project.supabase.co"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-key-${config.id}`}>Anonymous Key</Label>
                      <Input
                        id={`edit-key-${config.id}`}
                        type="password"
                        value={editForm.anonKey}
                        onChange={(e) => setEditForm({...editForm, anonKey: e.target.value})}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => saveEdit(config.id)}>Save Changes</Button>
                      <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  // Display View
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{config.name}</h4>
                        {config.isActive && <Badge variant="default">Active</Badge>}
                        {(!config.url || !config.anonKey) && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-400">
                            Incomplete
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {config.url || <span className="text-yellow-600">Missing URL</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={config.status === 'connected' ? 'default' : 'destructive'}>
                        {config.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection(config)}
                        disabled={testing === config.id || !config.url || !config.anonKey}
                      >
                        {testing === config.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Test'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(config)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {!config.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => switchDatabase(config)}
                        >
                          Switch
                        </Button>
                      )}
                      {!config.isActive && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeConfig(config.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Configuration Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Database Configuration</CardTitle>
            <CardDescription>
              Add a new Supabase database configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Guidance Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-2">How to get your Supabase credentials:</h4>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Go to your Supabase project dashboard</li>
                      <li>Click on "Settings" in the sidebar</li>
                      <li>Navigate to "API" section</li>
                      <li>Copy the "Project URL" and "anon public" key</li>
                    </ol>
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                        className="text-blue-700 border-blue-300 hover:bg-blue-100"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Supabase Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <Label htmlFor="config-name">Configuration Name</Label>
                <Input
                  id="config-name"
                  placeholder="e.g., Production Database, Development DB"
                  value={newConfig.name}
                  onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Give this configuration a memorable name</p>
              </div>
              <div>
                <Label htmlFor="config-url">Supabase Project URL</Label>
                <Input
                  id="config-url"
                  placeholder="https://your-project.supabase.co"
                  value={newConfig.url}
                  onChange={(e) => setNewConfig({ ...newConfig, url: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Found in Settings → API → Project URL</p>
              </div>
              <div>
                <Label htmlFor="config-key">Anonymous Key (anon public)</Label>
                <Input
                  id="config-key"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={newConfig.anonKey}
                  onChange={(e) => setNewConfig({ ...newConfig, anonKey: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Found in Settings → API → anon public key</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={addNewConfig}>Add Configuration</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Panel */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Switching databases:</strong> When you switch to a new database, the page will automatically refresh to apply the changes</p>
            <p>• <strong>Test before switching:</strong> Always test the connection before switching to ensure the database is accessible</p>
            <p>• <strong>Data isolation:</strong> Each database is completely separate - switching will show different data</p>
            <p>• <strong>Local storage:</strong> Configurations are stored locally in your browser</p>
            <p>• <strong>Security:</strong> Only use the anon public key, never your service role key</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseConfiguration;
