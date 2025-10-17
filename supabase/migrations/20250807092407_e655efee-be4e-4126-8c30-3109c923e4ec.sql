-- Critical Security Fixes - Phase 1 (Corrected)
-- Restore missing is_admin_secure() function and fix critical security issues

-- 1. Restore the missing is_admin_secure() function that's causing authentication failures
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  );
$$;

-- 2. Fix search_path for all existing security-critical functions
ALTER FUNCTION public.is_user_admin() SET search_path = '';
ALTER FUNCTION public.is_approved_user_secure() SET search_path = '';
ALTER FUNCTION public.is_manager_or_admin_secure() SET search_path = '';
ALTER FUNCTION public.is_manager_or_admin() SET search_path = '';
ALTER FUNCTION public.is_approved_user() SET search_path = '';
ALTER FUNCTION public.secure_assign_admin_role(text) SET search_path = '';
ALTER FUNCTION public.handle_bootstrap_admin_assignment(text) SET search_path = '';
ALTER FUNCTION public.get_user_approval_status_secure(uuid) SET search_path = '';
ALTER FUNCTION public.get_encrypted_api_key_secure(text) SET search_path = '';
ALTER FUNCTION public.update_encrypted_api_key_secure(text, text, uuid) SET search_path = '';
ALTER FUNCTION public.log_security_event(text, text, text, jsonb, boolean) SET search_path = '';
ALTER FUNCTION public.log_security_event_enhanced(text, text, text, jsonb, boolean, text) SET search_path = '';

-- 3. Clean up duplicate and conflicting RLS policies on critical tables

-- Clean up profiles table policies (has multiple overlapping policies)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;

-- Create single, clear policies for profiles
CREATE POLICY "profiles_own_access" 
ON public.profiles 
FOR ALL 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_admin_access" 
ON public.profiles 
FOR ALL 
USING (public.is_admin_secure())
WITH CHECK (public.is_admin_secure());

-- Clean up roles table policies
DROP POLICY IF EXISTS "Allow admin users to manage roles" ON public.roles;
DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON public.roles;
DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.roles;

-- Create single, clear policies for roles
CREATE POLICY "roles_read_access" 
ON public.roles 
FOR SELECT 
USING (true); -- Roles can be read by anyone (role names are not sensitive)

CREATE POLICY "roles_admin_insert" 
ON public.roles 
FOR INSERT 
WITH CHECK (public.is_admin_secure());

CREATE POLICY "roles_admin_update" 
ON public.roles 
FOR UPDATE 
USING (public.is_admin_secure())
WITH CHECK (public.is_admin_secure());

CREATE POLICY "roles_admin_delete" 
ON public.roles 
FOR DELETE 
USING (public.is_admin_secure());

-- Clean up user_roles table policies
DROP POLICY IF EXISTS "Allow admin users to manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow users to read their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create single, clear policies for user_roles
CREATE POLICY "user_roles_own_read" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "user_roles_admin_insert" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (public.is_admin_secure());

CREATE POLICY "user_roles_admin_update" 
ON public.user_roles 
FOR UPDATE 
USING (public.is_admin_secure())
WITH CHECK (public.is_admin_secure());

CREATE POLICY "user_roles_admin_delete" 
ON public.user_roles 
FOR DELETE 
USING (public.is_admin_secure());

-- 4. Fix the initiative_health_scores view by ensuring proper permissions
-- Grant necessary permissions for the view to work with RLS
GRANT SELECT ON public.strategic_initiatives TO authenticated;
GRANT SELECT ON public.strategic_initiative_milestones TO authenticated;
GRANT SELECT ON public.strategic_resource_allocations TO authenticated;

-- 5. Add security logging for critical function restoration
SELECT public.log_security_event_enhanced(
  'critical_security_function_restored',
  'database_function',
  'is_admin_secure',
  jsonb_build_object(
    'action', 'function_restoration',
    'security_level', 'critical',
    'note', 'Restored missing is_admin_secure function to fix authentication system'
  ),
  true,
  'info'
);

-- 6. Comment the restored function
COMMENT ON FUNCTION public.is_admin_secure() IS 
'Critical security function to check if current user has admin role. Uses secure search_path and proper RLS checks.';

-- 7. Verify function works by testing it exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'is_admin_secure' 
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    RAISE EXCEPTION 'Critical security function is_admin_secure was not created successfully';
  END IF;
END
$$;