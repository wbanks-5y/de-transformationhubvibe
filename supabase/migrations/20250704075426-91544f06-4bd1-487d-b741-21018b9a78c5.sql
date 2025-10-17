
-- Add Row Level Security to unprotected KPI tables
ALTER TABLE public.cockpit_kpi_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cockpit_kpi_time_based ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cockpit_kpi_values ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for cockpit_kpi_targets
CREATE POLICY "Admins can manage all KPI targets"
  ON public.cockpit_kpi_targets
  FOR ALL
  USING (is_admin_secure());

CREATE POLICY "Approved users can view KPI targets"
  ON public.cockpit_kpi_targets
  FOR SELECT
  USING (is_approved_user_secure());

CREATE POLICY "Managers can manage KPI targets"
  ON public.cockpit_kpi_targets
  FOR ALL
  USING (is_manager_or_admin_secure());

-- Create comprehensive RLS policies for cockpit_kpi_time_based
CREATE POLICY "Admins can manage all time-based KPI data"
  ON public.cockpit_kpi_time_based
  FOR ALL
  USING (is_admin_secure());

CREATE POLICY "Approved users can view time-based KPI data"
  ON public.cockpit_kpi_time_based
  FOR SELECT
  USING (is_approved_user_secure());

CREATE POLICY "Managers can manage time-based KPI data"
  ON public.cockpit_kpi_time_based
  FOR ALL
  USING (is_manager_or_admin_secure());

-- Create comprehensive RLS policies for cockpit_kpi_values
CREATE POLICY "Admins can manage all KPI values"
  ON public.cockpit_kpi_values
  FOR ALL
  USING (is_admin_secure());

CREATE POLICY "Approved users can view KPI values"
  ON public.cockpit_kpi_values
  FOR SELECT
  USING (is_approved_user_secure());

CREATE POLICY "Managers can manage KPI values"
  ON public.cockpit_kpi_values
  FOR ALL
  USING (is_manager_or_admin_secure());

-- Remove duplicate and conflicting policies to clean up RLS
-- Clean up profiles table - remove duplicate policies
DROP POLICY IF EXISTS "Allow admin users to manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin users to read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create consolidated profiles policies
CREATE POLICY "Users can manage their own profiles and admins can manage all"
  ON public.profiles
  FOR ALL
  USING ((auth.uid() = id) OR is_admin_secure());

CREATE POLICY "Users can view their own profiles and admins can view all"
  ON public.profiles
  FOR SELECT
  USING ((auth.uid() = id) OR is_admin_secure() OR is_manager_or_admin_secure());

-- Clean up roles table - remove duplicate policies
DROP POLICY IF EXISTS "Allow admin users to manage roles" ON public.roles;
DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON public.roles;
DROP POLICY IF EXISTS "Anyone can view roles" ON public.roles;
DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.roles;

-- Create consolidated roles policies
CREATE POLICY "Admins can manage roles, authenticated users can view"
  ON public.roles
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify roles"
  ON public.roles
  FOR INSERT, UPDATE, DELETE
  USING (is_admin_secure());

-- Clean up cockpit-related tables - remove duplicate policies and standardize
-- Cockpit types
DROP POLICY IF EXISTS "Allow admin users to manage cockpit types" ON public.cockpit_types;
DROP POLICY IF EXISTS "Allow authenticated users to read cockpit types" ON public.cockpit_types;
DROP POLICY IF EXISTS "Approved users can read cockpit types" ON public.cockpit_types;
DROP POLICY IF EXISTS "Authenticated users can view cockpit types" ON public.cockpit_types;
DROP POLICY IF EXISTS "Authenticated users can view cockpit_types" ON public.cockpit_types;

CREATE POLICY "Admins can manage cockpit types"
  ON public.cockpit_types
  FOR ALL
  USING (is_admin_secure());

CREATE POLICY "Approved users can view cockpit types"
  ON public.cockpit_types
  FOR SELECT
  USING (is_approved_user_secure());

-- Cockpit sections
DROP POLICY IF EXISTS "Allow admin users to manage cockpit sections" ON public.cockpit_sections;
DROP POLICY IF EXISTS "Allow authenticated users to read cockpit sections" ON public.cockpit_sections;
DROP POLICY IF EXISTS "Approved users can read cockpit sections" ON public.cockpit_sections;
DROP POLICY IF EXISTS "Authenticated users can view cockpit sections" ON public.cockpit_sections;
DROP POLICY IF EXISTS "Authenticated users can view cockpit_sections" ON public.cockpit_sections;

CREATE POLICY "Admins can manage cockpit sections"
  ON public.cockpit_sections
  FOR ALL
  USING (is_admin_secure());

CREATE POLICY "Approved users can view cockpit sections"
  ON public.cockpit_sections
  FOR SELECT
  USING (is_approved_user_secure());

-- Enhance security audit logging for KPI access
CREATE OR REPLACE FUNCTION public.log_kpi_access()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Log KPI data access for security monitoring
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    success
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'kpi_id', COALESCE(NEW.kpi_id, OLD.kpi_id),
      'table', TG_TABLE_NAME,
      'timestamp', now()
    ),
    true
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add audit triggers to KPI tables
CREATE TRIGGER kpi_targets_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.cockpit_kpi_targets
  FOR EACH ROW EXECUTE FUNCTION public.log_kpi_access();

CREATE TRIGGER kpi_time_based_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.cockpit_kpi_time_based
  FOR EACH ROW EXECUTE FUNCTION public.log_kpi_access();

CREATE TRIGGER kpi_values_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.cockpit_kpi_values
  FOR EACH ROW EXECUTE FUNCTION public.log_kpi_access();
