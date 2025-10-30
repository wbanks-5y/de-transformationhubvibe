-- Fix security vulnerability: Restrict access to user_roles and roles tables
-- Drop overly permissive policies that allow public access

-- ============================================
-- Fix user_roles table policies
-- ============================================

-- Drop policies that allow anyone/all authenticated users to view all role assignments
DROP POLICY IF EXISTS "Anyone can view user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Authenticated users can view user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow admin users to read all user roles" ON public.user_roles;

-- The following secure policies should remain:
-- ✓ "Admins can manage user_roles" - Admin full access via is_admin_secure()
-- ✓ "Only admins can manage user roles" - Admin management
-- ✓ "user_roles_admin_*" policies - Admin CRUD operations
-- ✓ "user_roles_own_read" - Users can see their own roles
-- ✓ "user_roles_select_own_policy" - Users see own roles OR admin sees all

-- ============================================
-- Fix roles table policies  
-- ============================================

-- Drop policies that allow public/unauthenticated access to role definitions
DROP POLICY IF EXISTS "roles_read_access" ON public.roles;
DROP POLICY IF EXISTS "roles_select_policy" ON public.roles;

-- Create a new secure policy: only authenticated users can view role definitions
-- (they need to know what roles exist, but not who has them)
CREATE POLICY "secure_roles_authenticated_read" 
ON public.roles 
FOR SELECT 
TO authenticated
USING (true);

-- Log this security fix
SELECT log_security_event_enhanced(
  'security_vulnerability_fixed',
  'rls_policy',
  'user_roles,roles',
  jsonb_build_object(
    'vulnerability', 'PUBLIC_USER_DATA',
    'fixed_by', auth.uid(),
    'description', 'Removed public access to user_roles and roles tables',
    'dropped_policies', jsonb_build_array(
      'Anyone can view user_roles',
      'Authenticated users can view user_roles', 
      'roles_read_access',
      'roles_select_policy'
    )
  ),
  true,
  'critical'
);