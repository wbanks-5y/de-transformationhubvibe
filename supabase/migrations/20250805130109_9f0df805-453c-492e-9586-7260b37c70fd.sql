-- PHASE 1: CRITICAL RLS POLICY FIXES
-- ====================================

-- 1. Enable RLS on unprotected KPI tables
ALTER TABLE public.cockpit_kpi_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cockpit_kpi_time_based ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cockpit_kpi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cockpit_kpis ENABLE ROW LEVEL SECURITY;

-- 2. Add comprehensive RLS policies for KPI tables
-- cockpit_kpi_targets policies
CREATE POLICY "Admins can manage KPI targets"
ON public.cockpit_kpi_targets
FOR ALL
USING (is_admin_secure());

CREATE POLICY "Approved users can view KPI targets"
ON public.cockpit_kpi_targets
FOR SELECT
USING (is_approved_user_secure());

CREATE POLICY "Managers can modify KPI targets"
ON public.cockpit_kpi_targets
FOR INSERT
WITH CHECK (is_manager_or_admin_secure());

CREATE POLICY "Managers can update KPI targets"
ON public.cockpit_kpi_targets
FOR UPDATE
USING (is_manager_or_admin_secure());

-- cockpit_kpi_time_based policies
CREATE POLICY "Admins can manage time-based KPIs"
ON public.cockpit_kpi_time_based
FOR ALL
USING (is_admin_secure());

CREATE POLICY "Approved users can view time-based KPIs"
ON public.cockpit_kpi_time_based
FOR SELECT
USING (is_approved_user_secure());

CREATE POLICY "Managers can modify time-based KPIs"
ON public.cockpit_kpi_time_based
FOR INSERT
WITH CHECK (is_manager_or_admin_secure());

CREATE POLICY "Managers can update time-based KPIs"
ON public.cockpit_kpi_time_based
FOR UPDATE
USING (is_manager_or_admin_secure());

-- cockpit_kpi_values policies
CREATE POLICY "Admins can manage KPI values"
ON public.cockpit_kpi_values
FOR ALL
USING (is_admin_secure());

CREATE POLICY "Approved users can view KPI values"
ON public.cockpit_kpi_values
FOR SELECT
USING (is_approved_user_secure());

CREATE POLICY "Managers can modify KPI values"
ON public.cockpit_kpi_values
FOR INSERT
WITH CHECK (is_manager_or_admin_secure());

CREATE POLICY "Managers can update KPI values"
ON public.cockpit_kpi_values
FOR UPDATE
USING (is_manager_or_admin_secure());

-- cockpit_kpis policies
CREATE POLICY "Admins can manage KPIs"
ON public.cockpit_kpis
FOR ALL
USING (is_admin_secure());

CREATE POLICY "Approved users can view KPIs"
ON public.cockpit_kpis
FOR SELECT
USING (is_approved_user_secure());

CREATE POLICY "Managers can modify KPIs"
ON public.cockpit_kpis
FOR INSERT
WITH CHECK (is_manager_or_admin_secure());

CREATE POLICY "Managers can update KPIs"
ON public.cockpit_kpis
FOR UPDATE
USING (is_manager_or_admin_secure());

-- PHASE 2: DATABASE FUNCTION SECURITY FIXES
-- =========================================

-- 1. Secure all database functions with proper search path
CREATE OR REPLACE FUNCTION public.get_user_tier(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT tier
  FROM public.profiles
  WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_approved_user_secure()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.status = 'approved'
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_manager_or_admin_secure()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'manager')
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_manager_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'manager')
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_approved_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.status = 'approved'
  );
$function$;

CREATE OR REPLACE FUNCTION public.has_tier_access(user_id uuid, required_tier text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT CASE 
    WHEN (SELECT tier FROM public.profiles WHERE id = user_id) = 'admin' THEN true
    WHEN required_tier = 'essential' THEN (SELECT tier FROM public.profiles WHERE id = user_id) IN ('essential', 'professional', 'enterprise', 'admin')
    WHEN required_tier = 'professional' THEN (SELECT tier FROM public.profiles WHERE id = user_id) IN ('professional', 'enterprise', 'admin')
    WHEN required_tier = 'enterprise' THEN (SELECT tier FROM public.profiles WHERE id = user_id) IN ('enterprise', 'admin')
    ELSE false
  END;
$function$;

CREATE OR REPLACE FUNCTION public.log_security_event(p_action text, p_resource_type text, p_resource_id text DEFAULT NULL::text, p_details jsonb DEFAULT '{}'::jsonb, p_success boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    success
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_details,
    p_success
  );
END;
$function$;

-- 2. Enhanced security audit function
CREATE OR REPLACE FUNCTION public.log_security_event_enhanced(
  p_action text, 
  p_resource_type text, 
  p_resource_id text DEFAULT NULL::text, 
  p_details jsonb DEFAULT '{}'::jsonb, 
  p_success boolean DEFAULT true,
  p_severity text DEFAULT 'info'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Enhanced logging with severity and additional context
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    success
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    jsonb_build_object(
      'severity', p_severity,
      'timestamp', extract(epoch from now()),
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent'
    ) || COALESCE(p_details, '{}'::jsonb),
    p_success
  );
  
  -- Trigger alert for critical security events
  IF p_severity = 'critical' OR (p_action IN ('privilege_escalation', 'unauthorized_admin_access', 'suspicious_role_assignment') AND NOT p_success) THEN
    -- Log critical security event (could trigger external alerts)
    INSERT INTO public.security_audit_log (
      user_id,
      action,
      resource_type,
      resource_id,
      details,
      success
    ) VALUES (
      auth.uid(),
      'security_alert_triggered',
      'security_monitoring',
      p_action,
      jsonb_build_object(
        'original_action', p_action,
        'alert_level', 'critical',
        'requires_investigation', true
      ),
      true
    );
  END IF;
END;
$function$;

-- 3. Secure admin role assignment function
CREATE OR REPLACE FUNCTION public.secure_assign_admin_role(target_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  target_user_id uuid;
  admin_role_id uuid;
  current_user_is_admin boolean;
BEGIN
  -- 1. Verify current user is admin
  SELECT is_admin_secure() INTO current_user_is_admin;
  
  IF NOT current_user_is_admin THEN
    PERFORM log_security_event_enhanced(
      'unauthorized_admin_assignment_attempt',
      'user_role',
      target_email,
      jsonb_build_object('attempted_by', auth.uid()),
      false,
      'critical'
    );
    RETURN false;
  END IF;
  
  -- 2. Find target user by email from profiles
  SELECT id INTO target_user_id
  FROM public.profiles p
  WHERE p.id IN (
    SELECT u.id 
    FROM auth.users u 
    WHERE u.email = target_email
  )
  LIMIT 1;
  
  IF target_user_id IS NULL THEN
    PERFORM log_security_event_enhanced(
      'admin_assignment_user_not_found',
      'user_role',
      target_email,
      jsonb_build_object('attempted_by', auth.uid()),
      false,
      'warning'
    );
    RETURN false;
  END IF;
  
  -- 3. Get admin role
  SELECT id INTO admin_role_id
  FROM public.roles
  WHERE name = 'admin'
  LIMIT 1;
  
  IF admin_role_id IS NULL THEN
    -- Create admin role if it doesn't exist
    INSERT INTO public.roles (name, description)
    VALUES ('admin', 'Administrator with full access')
    RETURNING id INTO admin_role_id;
  END IF;
  
  -- 4. Check if user already has admin role
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = target_user_id AND role_id = admin_role_id
  ) THEN
    PERFORM log_security_event_enhanced(
      'admin_assignment_already_exists',
      'user_role',
      target_user_id::text,
      jsonb_build_object('attempted_by', auth.uid()),
      true,
      'info'
    );
    RETURN true;
  END IF;
  
  -- 5. Assign admin role
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (target_user_id, admin_role_id);
  
  -- 6. Update user status to approved
  UPDATE public.profiles
  SET status = 'approved'
  WHERE id = target_user_id;
  
  -- 7. Log successful assignment
  PERFORM log_security_event_enhanced(
    'admin_role_assigned',
    'user_role',
    target_user_id::text,
    jsonb_build_object(
      'assigned_by', auth.uid(),
      'target_email', target_email,
      'role_id', admin_role_id
    ),
    true,
    'info'
  );
  
  RETURN true;
  
EXCEPTION
  WHEN OTHERS THEN
    PERFORM log_security_event_enhanced(
      'admin_assignment_error',
      'user_role',
      COALESCE(target_user_id::text, target_email),
      jsonb_build_object(
        'error', SQLERRM,
        'attempted_by', auth.uid()
      ),
      false,
      'error'
    );
    RETURN false;
END;
$function$;