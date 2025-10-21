
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { assignAdminRoleByEmail, isUserAdmin } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { checkDatabaseHealth, type DatabaseHealthStatus } from '@/lib/supabase/database-health';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const ApproveAdmin = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [dbHealth, setDbHealth] = useState<DatabaseHealthStatus | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);
  const { user } = useAuth();
  const { organizationClient } = useOrganization();
  const queryClient = useQueryClient();

  const checkHealth = async () => {
    if (!organizationClient) return;
    
    setIsCheckingHealth(true);
    try {
      const health = await checkDatabaseHealth(organizationClient);
      setDbHealth(health);
    } catch (error) {
      console.error('Health check failed:', error);
      toast.error("Failed to check database health");
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleBootstrapFirstAdmin = async () => {
    if (!email || !organizationClient) {
      toast.error("Please enter an email address");
      return;
    }

    if (dbHealth && dbHealth.adminCount > 0) {
      toast.error("Admin already exists. Use normal approval process.");
      return;
    }
    
    toast.error("Bootstrap function not yet available", {
      description: "Please run the database migration first to create the bootstrap function"
    });
  };

  const handleApproveAdmin = async () => {
    if (!email || !organizationClient) {
      toast.error("Please enter an email address");
      return;
    }
    
    try {
      setIsLoading(true);
      setResult(null);
      
      const success = await assignAdminRoleByEmail(email, organizationClient);
      
      if (success) {
        setResult('Success! User has been made an admin.');
        toast.success("Admin role assigned successfully");
        
        // Refresh health status
        await checkHealth();
        
        // If the approved user is the current user, invalidate admin check queries
        if (user?.email?.toLowerCase() === email.toLowerCase()) {
          queryClient.invalidateQueries({ queryKey: ['admin-check'] });
          queryClient.invalidateQueries({ queryKey: ['secure-admin-check'] });
          toast.success("Your session has been refreshed with new permissions");
        }
      } else {
        setResult('Failed to assign admin role. Check console for errors.');
        toast.error("Failed to assign admin role");
      }
    } catch (error: any) {
      console.error('Error approving admin:', error);
      setResult(`Error: ${error.message || 'Unknown error'}`);
      toast.error("An error occurred", {
        description: error.message || "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkHealth();
  }, [user, organizationClient]);

  const renderHealthStatus = () => {
    if (!dbHealth) return null;

    return (
      <Card className="max-w-md mx-auto mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Database Health Status</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={checkHealth}
              disabled={isCheckingHealth}
            >
              <RefreshCw className={`h-4 w-4 ${isCheckingHealth ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            {dbHealth.rolesTableExists ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span>Roles table</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            {dbHealth.userRolesTableExists ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span>User roles table</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            {dbHealth.isAdminFunctionExists ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span>is_admin_secure function</span>
            {dbHealth.adminFunctionError && (
              <span className="text-xs text-muted-foreground ml-2">
                ({dbHealth.adminFunctionError})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {dbHealth.secureAssignFunctionExists ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span>secure_assign_admin_role function</span>
            {dbHealth.secureAssignFunctionError && (
              <span className="text-xs text-muted-foreground ml-2">
                ({dbHealth.secureAssignFunctionError})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {dbHealth.adminCount === 0 ? (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            <span>Admin count: {dbHealth.adminCount}</span>
          </div>

          {dbHealth.errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-medium text-red-800 mb-1">Issues detected:</p>
              <ul className="text-xs text-red-700 list-disc list-inside">
                {dbHealth.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderMigrationInstructions = () => {
    const missingTables = !dbHealth?.rolesTableExists || !dbHealth?.userRolesTableExists;
    const missingFunctions = !dbHealth?.isAdminFunctionExists || !dbHealth?.secureAssignFunctionExists;

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Database Setup Required</CardTitle>
          <CardDescription>
            {missingTables && missingFunctions
              ? 'Required tables and functions are missing.'
              : missingTables
              ? 'Required tables are missing.'
              : 'Required database functions are missing.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm font-medium text-yellow-800 mb-2">
              Steps to fix:
            </p>
            <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
              <li>Open Supabase SQL Editor</li>
              <li>Copy and run the SQL below</li>
              <li>Click "Re-check Database Status"</li>
            </ol>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`-- ============================================
-- Complete Role System Setup
-- ============================================

-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, role_id)
);

-- Insert default roles
INSERT INTO public.roles (name, description)
VALUES 
    ('admin', 'Administrator with full system access'),
    ('manager', 'Manager with team oversight capabilities'),
    ('user', 'Standard user with basic access')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Security Functions
-- ============================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
  );
$$;

-- Function to assign admin role (only when no admin exists OR caller is admin)
CREATE OR REPLACE FUNCTION public.secure_assign_admin_role(target_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  admin_role_id uuid;
  admin_count integer;
  caller_is_admin boolean;
BEGIN
  -- Get target user ID from email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = target_email
  LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', target_email;
  END IF;

  -- Get admin role ID
  SELECT id INTO admin_role_id
  FROM public.roles
  WHERE name = 'admin'
  LIMIT 1;

  IF admin_role_id IS NULL THEN
    RAISE EXCEPTION 'Admin role not found';
  END IF;

  -- Count existing admins
  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles ur
  WHERE ur.role_id = admin_role_id;

  -- Check if caller is admin
  caller_is_admin := public.is_admin_secure();

  -- Only allow if no admins exist OR caller is admin
  IF admin_count = 0 OR caller_is_admin THEN
    -- Insert admin role (ignore if already exists)
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (target_user_id, admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    RETURN true;
  ELSE
    RAISE EXCEPTION 'Unauthorized: Only admins can assign admin role';
  END IF;
END;
$$;

-- Bootstrap function for first admin (when no admins exist)
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(target_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  admin_role_id uuid;
  admin_count integer;
BEGIN
  -- Count existing admins
  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  WHERE r.name = 'admin';

  -- Only allow bootstrap if NO admins exist
  IF admin_count > 0 THEN
    RAISE EXCEPTION 'Cannot bootstrap: admin already exists';
  END IF;

  -- Get target user ID
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = target_email
  LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', target_email;
  END IF;

  -- Get admin role ID
  SELECT id INTO admin_role_id
  FROM public.roles
  WHERE name = 'admin'
  LIMIT 1;

  IF admin_role_id IS NULL THEN
    RAISE EXCEPTION 'Admin role not found';
  END IF;

  -- Create first admin
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (target_user_id, admin_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;
  
  RETURN true;
END;
$$;

-- ============================================
-- RLS Policies
-- ============================================

-- Roles table: Everyone can view roles
CREATE POLICY "Anyone can view roles"
ON public.roles
FOR SELECT
TO authenticated
USING (true);

-- User_roles table: Admins can view all, users can view their own
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin_secure());

-- Admins can manage user roles
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_secure());

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin_secure());

-- Grant permissions
GRANT SELECT ON public.roles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT INSERT, DELETE ON public.user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_secure() TO authenticated;
GRANT EXECUTE ON FUNCTION public.secure_assign_admin_role(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin(text) TO authenticated;`}
            </pre>
          </div>
          <Button onClick={checkHealth} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-check Database Status
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-8">
      {renderHealthStatus()}

      {dbHealth && !dbHealth.isHealthy ? (
        renderMigrationInstructions()
      ) : dbHealth && dbHealth.adminCount === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Bootstrap First Admin</CardTitle>
            <CardDescription>
              No admin exists. Create the first admin to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  This special function allows you to create the first admin when none exist.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email" 
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              {result && (
                <div className={`p-4 rounded-md text-sm ${result.includes('Success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {result}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleBootstrapFirstAdmin}
              disabled={isLoading || !email}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Processing...
                </>
              ) : (
                'Bootstrap First Admin'
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Approve Admin User</CardTitle>
            <CardDescription>
              Give admin privileges to a user by email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email" 
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              {result && (
                <div className={`p-4 rounded-md text-sm ${result.includes('Success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {result}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleApproveAdmin}
              disabled={isLoading || !email || !dbHealth?.isAdminFunctionExists || !dbHealth?.secureAssignFunctionExists}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Processing...
                </>
              ) : (
                'Approve as Admin'
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ApproveAdmin;
