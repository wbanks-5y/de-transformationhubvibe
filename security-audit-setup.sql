-- ============================================
-- Security Audit System Setup
-- ============================================
-- Run this SQL in your Lovable Cloud SQL Editor
-- (Cloud tab -> SQL Editor)
-- ============================================

-- 1. Create security_audit_log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action ON public.security_audit_log(action);

-- 4. RLS Policies
CREATE POLICY "Admins can view all audit logs"
ON public.security_audit_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs"
ON public.security_audit_log
FOR INSERT
TO authenticated
WITH CHECK (TRUE);

-- 5. Function to detect security threats
CREATE OR REPLACE FUNCTION public.detect_security_threats()
RETURNS TABLE (
    threat_type TEXT,
    user_id UUID,
    threat_score NUMERIC,
    details JSONB,
    last_activity TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Detect repeated failed access attempts (high threat)
    RETURN QUERY
    SELECT 
        'repeated_failed_access'::TEXT AS threat_type,
        sal.user_id,
        100.0 AS threat_score,
        jsonb_build_object(
            'failed_attempts', COUNT(*),
            'resources', jsonb_agg(DISTINCT sal.resource_type)
        ) AS details,
        MAX(sal.created_at) AS last_activity
    FROM public.security_audit_log sal
    WHERE sal.success = FALSE
        AND sal.created_at > NOW() - INTERVAL '1 hour'
        AND sal.user_id IS NOT NULL
    GROUP BY sal.user_id
    HAVING COUNT(*) >= 5
    
    UNION ALL
    
    -- Detect privilege escalation attempts (critical threat)
    SELECT 
        'privilege_escalation'::TEXT AS threat_type,
        sal.user_id,
        150.0 AS threat_score,
        jsonb_build_object(
            'attempts', COUNT(*),
            'resources', jsonb_agg(DISTINCT sal.resource_type)
        ) AS details,
        MAX(sal.created_at) AS last_activity
    FROM public.security_audit_log sal
    WHERE sal.success = FALSE
        AND sal.resource_type IN ('user_roles', 'roles')
        AND sal.created_at > NOW() - INTERVAL '24 hours'
        AND sal.user_id IS NOT NULL
    GROUP BY sal.user_id
    HAVING COUNT(*) >= 3
    
    UNION ALL
    
    -- Detect rapid consecutive actions (potential bot/automation)
    SELECT 
        'rapid_actions'::TEXT AS threat_type,
        sal.user_id,
        75.0 AS threat_score,
        jsonb_build_object(
            'action_count', COUNT(*),
            'time_window', '5 minutes'
        ) AS details,
        MAX(sal.created_at) AS last_activity
    FROM public.security_audit_log sal
    WHERE sal.created_at > NOW() - INTERVAL '5 minutes'
        AND sal.user_id IS NOT NULL
    GROUP BY sal.user_id
    HAVING COUNT(*) >= 50;
END;
$$;

-- 6. Function to generate security reports
CREATE OR REPLACE FUNCTION public.generate_security_report(
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    report JSONB;
    total_events BIGINT;
    successful_events BIGINT;
    failed_events BIGINT;
    unique_users BIGINT;
    critical_alerts BIGINT;
BEGIN
    -- Calculate summary metrics
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE success = TRUE),
        COUNT(*) FILTER (WHERE success = FALSE),
        COUNT(DISTINCT user_id)
    INTO total_events, successful_events, failed_events, unique_users
    FROM public.security_audit_log
    WHERE created_at BETWEEN start_date AND end_date;
    
    -- Count critical alerts (threats with score > 100)
    SELECT COUNT(*)
    INTO critical_alerts
    FROM public.detect_security_threats()
    WHERE threat_score > 100;
    
    -- Build the report
    report := jsonb_build_object(
        'report_period', jsonb_build_object(
            'start', start_date,
            'end', end_date
        ),
        'summary', jsonb_build_object(
            'total_events', total_events,
            'success_rate', 
                CASE 
                    WHEN total_events > 0 THEN ROUND((successful_events::NUMERIC / total_events::NUMERIC) * 100, 2)
                    ELSE 0
                END,
            'unique_users', unique_users,
            'critical_alerts', critical_alerts
        ),
        'top_threats', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'type', threat_type,
                    'count', 1,
                    'severity', 
                        CASE 
                            WHEN threat_score > 100 THEN 'critical'
                            WHEN threat_score > 75 THEN 'high'
                            ELSE 'medium'
                        END
                )
            )
            FROM public.detect_security_threats()
            LIMIT 10
        ),
        'event_breakdown', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'action', action,
                    'count', action_count
                )
            )
            FROM (
                SELECT action, COUNT(*) AS action_count
                FROM public.security_audit_log
                WHERE created_at BETWEEN start_date AND end_date
                GROUP BY action
                ORDER BY action_count DESC
            ) breakdown
        )
    );
    
    RETURN report;
END;
$$;

-- 7. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.detect_security_threats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_security_report(TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO authenticated;

-- ============================================
-- Setup complete! 
-- Your security audit system is now ready.
-- ============================================
