-- Create a secure wrapper function to fetch initiative health scores
-- Uses SECURITY DEFINER to safely bypass RLS while still enforcing app-level access via is_approved_user_secure()
CREATE OR REPLACE FUNCTION public.get_initiative_health_scores()
RETURNS TABLE(
  id uuid,
  name text,
  status text,
  progress_percentage integer,
  milestone_progress_percentage numeric,
  resource_utilization_percentage numeric,
  overdue_milestones bigint,
  health_score numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Enforce that only approved users can call this function
  IF NOT public.is_approved_user_secure() THEN
    RAISE EXCEPTION 'Access denied. Approved users only.';
  END IF;

  -- Optionally log access (kept minimal for performance)
  -- PERFORM public.log_security_event_enhanced('read_initiative_health_scores', 'view_proxy', NULL, '{}'::jsonb, true, 'info');

  RETURN QUERY
  SELECT
    ihs.id,
    ihs.name,
    ihs.status,
    ihs.progress_percentage,
    ihs.milestone_progress_percentage,
    ihs.resource_utilization_percentage,
    ihs.overdue_milestones,
    ihs.health_score
  FROM public.initiative_health_scores AS ihs;
END;
$function$;