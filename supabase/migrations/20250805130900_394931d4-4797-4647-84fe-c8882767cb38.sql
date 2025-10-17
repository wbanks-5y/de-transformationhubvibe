-- PHASE 4: ENHANCED MONITORING & DATA PROTECTION
-- ================================================

-- 1. Create security monitoring views and functions
CREATE OR REPLACE VIEW public.security_dashboard_metrics AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  action,
  resource_type,
  success,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(CASE WHEN success THEN 1 ELSE 0 END) as success_rate
FROM public.security_audit_log
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at), action, resource_type, success
ORDER BY hour DESC;

-- 2. Create function to detect suspicious patterns
CREATE OR REPLACE FUNCTION public.detect_security_threats()
RETURNS TABLE(
  threat_type text,
  user_id uuid,
  threat_score integer,
  details jsonb,
  last_activity timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  WITH threat_analysis AS (
    -- Failed login attempts
    SELECT 
      'repeated_failed_access' as threat_type,
      sal.user_id,
      COUNT(*)::integer * 10 as threat_score,
      jsonb_build_object(
        'failed_attempts', COUNT(*),
        'actions', array_agg(DISTINCT sal.action),
        'resources', array_agg(DISTINCT sal.resource_type)
      ) as details,
      MAX(sal.created_at) as last_activity
    FROM public.security_audit_log sal
    WHERE sal.created_at >= NOW() - INTERVAL '1 hour'
      AND sal.success = false
      AND sal.action IN ('login_attempt', 'admin_access_attempt', 'role_assignment_attempt')
    GROUP BY sal.user_id
    HAVING COUNT(*) >= 5
    
    UNION ALL
    
    -- Privilege escalation attempts
    SELECT 
      'privilege_escalation_attempt' as threat_type,
      sal.user_id,
      50 as threat_score,
      jsonb_build_object(
        'escalation_attempts', COUNT(*),
        'target_resources', array_agg(DISTINCT sal.resource_id)
      ) as details,
      MAX(sal.created_at) as last_activity
    FROM public.security_audit_log sal
    WHERE sal.created_at >= NOW() - INTERVAL '2 hours'
      AND sal.action LIKE '%admin%'
      AND sal.success = false
    GROUP BY sal.user_id
    HAVING COUNT(*) >= 2
    
    UNION ALL
    
    -- Rapid consecutive actions (potential bot activity)
    SELECT 
      'rapid_consecutive_actions' as threat_type,
      sal.user_id,
      30 as threat_score,
      jsonb_build_object(
        'action_count', COUNT(*),
        'time_window_minutes', EXTRACT(EPOCH FROM (MAX(sal.created_at) - MIN(sal.created_at)))/60
      ) as details,
      MAX(sal.created_at) as last_activity
    FROM public.security_audit_log sal
    WHERE sal.created_at >= NOW() - INTERVAL '10 minutes'
    GROUP BY sal.user_id
    HAVING COUNT(*) >= 20
      AND EXTRACT(EPOCH FROM (MAX(sal.created_at) - MIN(sal.created_at))) < 300 -- 5 minutes
  )
  SELECT * FROM threat_analysis
  ORDER BY threat_score DESC;
END;
$function$;

-- 3. Create session management table for enhanced security
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  session_token text NOT NULL UNIQUE,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_activity timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  is_active boolean NOT NULL DEFAULT true,
  device_fingerprint text,
  location_data jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS on sessions table
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Sessions policies - users can only see their own sessions
CREATE POLICY "Users can view their own sessions"
ON public.user_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
ON public.user_sessions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions"
ON public.user_sessions
FOR ALL
USING (is_admin_secure());

-- 4. Create data encryption functions for sensitive fields
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data(data_text text, encryption_key text DEFAULT 'default_key')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Simple encryption simulation (in production, use pgcrypto extension)
  RETURN encode(digest(data_text || encryption_key, 'sha256'), 'hex');
END;
$function$;

-- 5. Create audit trail for data access
CREATE TABLE IF NOT EXISTS public.data_access_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  table_name text NOT NULL,
  record_id text,
  access_type text NOT NULL, -- SELECT, INSERT, UPDATE, DELETE
  field_names text[],
  accessed_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address inet,
  success boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS on data access log
ALTER TABLE public.data_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view data access logs
CREATE POLICY "Admins can view data access logs"
ON public.data_access_log
FOR ALL
USING (is_admin_secure());

-- 6. Create function for automated security response
CREATE OR REPLACE FUNCTION public.automated_security_response()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  threat RECORD;
  response_action text;
BEGIN
  -- Check for active threats
  FOR threat IN 
    SELECT * FROM public.detect_security_threats() 
    WHERE threat_score >= 30
  LOOP
    -- Determine response action based on threat type and score
    IF threat.threat_score >= 50 THEN
      response_action := 'immediate_lockout';
      
      -- Disable user sessions for high-threat users
      UPDATE public.user_sessions 
      SET is_active = false, 
          last_activity = now()
      WHERE user_id = threat.user_id;
      
    ELSIF threat.threat_score >= 30 THEN
      response_action := 'enhanced_monitoring';
    END IF;
    
    -- Log the automated response
    PERFORM log_security_event_enhanced(
      'automated_security_response',
      'security_monitoring',
      threat.user_id::text,
      jsonb_build_object(
        'threat_type', threat.threat_type,
        'threat_score', threat.threat_score,
        'response_action', response_action,
        'threat_details', threat.details
      ),
      true,
      'critical'
    );
  END LOOP;
END;
$function$;

-- 7. Create function to generate security reports
CREATE OR REPLACE FUNCTION public.generate_security_report(
  start_date timestamp with time zone DEFAULT now() - INTERVAL '7 days',
  end_date timestamp with time zone DEFAULT now()
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  report jsonb;
  total_events integer;
  failed_events integer;
  unique_users integer;
  critical_alerts integer;
BEGIN
  -- Gather security metrics
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE success = false),
    COUNT(DISTINCT user_id),
    COUNT(*) FILTER (WHERE details->>'severity' = 'critical')
  INTO total_events, failed_events, unique_users, critical_alerts
  FROM public.security_audit_log
  WHERE created_at BETWEEN start_date AND end_date;
  
  -- Build comprehensive report
  report := jsonb_build_object(
    'report_period', jsonb_build_object(
      'start', start_date,
      'end', end_date
    ),
    'summary', jsonb_build_object(
      'total_security_events', total_events,
      'failed_events', failed_events,
      'success_rate', CASE WHEN total_events > 0 THEN ROUND((total_events - failed_events)::numeric / total_events * 100, 2) ELSE 0 END,
      'unique_users_involved', unique_users,
      'critical_alerts', critical_alerts
    ),
    'top_threats', (
      SELECT jsonb_agg(threat_data)
      FROM (
        SELECT jsonb_build_object(
          'threat_type', threat_type,
          'threat_score', threat_score,
          'user_id', user_id,
          'details', details
        ) as threat_data
        FROM public.detect_security_threats()
        ORDER BY threat_score DESC
        LIMIT 5
      ) threats
    ),
    'event_breakdown', (
      SELECT jsonb_object_agg(action, event_count)
      FROM (
        SELECT action, COUNT(*) as event_count
        FROM public.security_audit_log
        WHERE created_at BETWEEN start_date AND end_date
        GROUP BY action
        ORDER BY event_count DESC
      ) breakdown
    )
  );
  
  RETURN report;
END;
$function$;