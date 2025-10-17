
-- Fix "Security Definer View" warning by making the view run with caller privileges
-- and enabling a security barrier for safer predicate/function handling.

-- 1) Ensure the view runs with INVOKER privileges (not definer)
ALTER VIEW IF EXISTS public.initiative_health_scores
  SET (security_invoker = true);

-- 2) Add a security barrier to prevent information leakage via function side-effects
ALTER VIEW IF EXISTS public.initiative_health_scores
  SET (security_barrier = true);

-- 3) Optional hardening: restrict who can SELECT from the view (views don't have RLS)
--    Keep service_role access for internal operations, allow authenticated users,
--    and remove anonymous access.
REVOKE ALL ON public.initiative_health_scores FROM anon;
GRANT SELECT ON public.initiative_health_scores TO authenticated;
GRANT SELECT ON public.initiative_health_scores TO service_role;

-- (Optional) Document the intent for future maintainers
COMMENT ON VIEW public.initiative_health_scores IS
  'Runs with security_invoker + security_barrier. Primary access path is the RPC public.get_initiative_health_scores() which enforces approved-user checks.';
