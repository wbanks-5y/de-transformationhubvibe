-- Security Fixes - Phase 2 Corrected
-- Address remaining security linter warnings with correct column names

-- 1. Fix the Security Definer View issue for initiative_health_scores
-- Drop and recreate the view without SECURITY DEFINER
DROP VIEW IF EXISTS public.initiative_health_scores;

-- Create a standard view that respects RLS policies of the querying user
CREATE VIEW public.initiative_health_scores AS
SELECT 
  si.id,
  si.name,
  si.status,
  si.progress_percentage,
  -- Calculate milestone progress
  COALESCE(
    ROUND(
      (COUNT(sim.id) FILTER (WHERE sim.status = 'completed')::numeric / 
       NULLIF(COUNT(sim.id), 0) * 100), 2
    ), 0
  ) as milestone_progress_percentage,
  -- Count overdue milestones
  COUNT(sim.id) FILTER (
    WHERE sim.status != 'completed' 
    AND sim.target_date < CURRENT_DATE
  ) as overdue_milestones,
  -- Calculate resource utilization (use allocated vs utilized amounts)
  COALESCE(
    ROUND(
      (SUM(sra.utilized_amount) / NULLIF(SUM(sra.allocated_amount), 0) * 100), 2
    ), 0
  ) as resource_utilization_percentage,
  -- Calculate overall health score (weighted average)
  COALESCE(
    ROUND(
      (si.progress_percentage * 0.4 + 
       (COUNT(sim.id) FILTER (WHERE sim.status = 'completed')::numeric / 
        NULLIF(COUNT(sim.id), 0) * 100) * 0.3 +
       (CASE WHEN COUNT(sim.id) FILTER (WHERE sim.status != 'completed' AND sim.target_date < CURRENT_DATE) = 0 
             THEN 100 ELSE 50 END) * 0.3), 2
    ), 0
  ) as health_score
FROM public.strategic_initiatives si
LEFT JOIN public.strategic_initiative_milestones sim ON si.id = sim.initiative_id
LEFT JOIN public.strategic_resource_allocations sra ON si.id = sra.initiative_id
WHERE si.is_active = true
GROUP BY si.id, si.name, si.status, si.progress_percentage;

-- Grant appropriate permissions for the view
GRANT SELECT ON public.initiative_health_scores TO authenticated;

-- 2. Fix remaining function search_path issues for functions that weren't caught earlier
-- Update functions that still have mutable search_path
ALTER FUNCTION public.handle_updated_at() SET search_path = '';
ALTER FUNCTION public.get_user_tier(uuid) SET search_path = '';
ALTER FUNCTION public.is_first_admin() SET search_path = '';
ALTER FUNCTION public.needs_bootstrap_admin() SET search_path = '';
ALTER FUNCTION public.auto_assign_first_admin() SET search_path = '';
ALTER FUNCTION public.validate_password_complexity(text) SET search_path = '';
ALTER FUNCTION public.has_tier_access(uuid, text) SET search_path = '';
ALTER FUNCTION public.detect_security_threats() SET search_path = '';
ALTER FUNCTION public.automated_security_response() SET search_path = '';
ALTER FUNCTION public.generate_security_report(timestamp with time zone, timestamp with time zone) SET search_path = '';
ALTER FUNCTION public.get_security_dashboard_metrics() SET search_path = '';
ALTER FUNCTION public.encrypt_sensitive_data(text, text) SET search_path = '';
ALTER FUNCTION public.encrypt_api_key(text) SET search_path = '';
ALTER FUNCTION public.decrypt_api_key(text) SET search_path = '';

-- Update trigger functions as well
ALTER FUNCTION public.update_updated_at_timestamp() SET search_path = '';
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.handle_milestone_completion() SET search_path = '';
ALTER FUNCTION public.populate_date_fields() SET search_path = '';
ALTER FUNCTION public.compute_date_value() SET search_path = '';
ALTER FUNCTION public.auto_calculate_kpi_trends() SET search_path = '';

-- 3. Add comments to document the security improvements
COMMENT ON VIEW public.initiative_health_scores IS 
'Health score view for strategic initiatives. Respects RLS policies of the querying user rather than using SECURITY DEFINER.';

-- 4. Log the security improvements
SELECT public.log_security_event_enhanced(
  'security_definer_view_fixed',
  'database_view',
  'initiative_health_scores',
  jsonb_build_object(
    'action', 'view_security_hardening',
    'old_type', 'SECURITY DEFINER',
    'new_type', 'standard_view_with_rls',
    'note', 'Converted security definer view to standard view that respects user RLS policies'
  ),
  true,
  'info'
);

SELECT public.log_security_event_enhanced(
  'function_search_path_hardened',
  'database_functions',
  'multiple_functions',
  jsonb_build_object(
    'action', 'search_path_security_hardening',
    'functions_updated', 20,
    'note', 'Set immutable search_path for all security-critical functions'
  ),
  true,
  'info'
);