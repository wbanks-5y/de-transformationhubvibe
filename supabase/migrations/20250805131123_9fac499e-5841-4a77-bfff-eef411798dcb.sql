-- Fix security definer view issue
DROP VIEW IF EXISTS public.security_dashboard_metrics;

-- Create a secure function instead of a view
CREATE OR REPLACE FUNCTION public.get_security_dashboard_metrics()
RETURNS TABLE(
  hour timestamp with time zone,
  action text,
  resource_type text,
  success boolean,
  event_count bigint,
  unique_users bigint,
  success_rate numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Only allow admins to access security metrics
  IF NOT is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  RETURN QUERY
  SELECT 
    DATE_TRUNC('hour', sal.created_at) as hour,
    sal.action,
    sal.resource_type,
    sal.success,
    COUNT(*) as event_count,
    COUNT(DISTINCT sal.user_id) as unique_users,
    AVG(CASE WHEN sal.success THEN 1 ELSE 0 END) as success_rate
  FROM public.security_audit_log sal
  WHERE sal.created_at >= NOW() - INTERVAL '24 hours'
  GROUP BY DATE_TRUNC('hour', sal.created_at), sal.action, sal.resource_type, sal.success
  ORDER BY hour DESC;
END;
$function$;