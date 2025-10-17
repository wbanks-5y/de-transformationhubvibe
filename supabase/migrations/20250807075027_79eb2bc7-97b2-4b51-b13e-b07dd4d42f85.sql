-- Fix SECURITY DEFINER issues in initiative_health_scores view
-- by cleaning up RLS policies and removing SECURITY DEFINER dependencies

-- First, drop all existing RLS policies on the tables referenced by the view
DROP POLICY IF EXISTS "Approved users can view strategic initiatives" ON public.strategic_initiatives;
DROP POLICY IF EXISTS "Managers can modify strategic initiatives" ON public.strategic_initiatives;

DROP POLICY IF EXISTS "Approved users can view strategic initiative milestones" ON public.strategic_initiative_milestones;
DROP POLICY IF EXISTS "Managers can modify strategic initiative milestones" ON public.strategic_initiative_milestones;

DROP POLICY IF EXISTS "Approved users can view strategic resource allocations" ON public.strategic_resource_allocations;
DROP POLICY IF EXISTS "Managers can modify strategic resource allocations" ON public.strategic_resource_allocations;

-- Create new streamlined RLS policies without SECURITY DEFINER dependencies
-- These policies use direct role checks instead of SECURITY DEFINER functions

-- Strategic initiatives policies
CREATE POLICY "strategic_initiatives_select_policy" 
ON public.strategic_initiatives 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.status = 'approved'
  )
);

CREATE POLICY "strategic_initiatives_modify_policy" 
ON public.strategic_initiatives 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'manager')
  )
);

-- Strategic initiative milestones policies
CREATE POLICY "strategic_initiative_milestones_select_policy" 
ON public.strategic_initiative_milestones 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.status = 'approved'
  )
);

CREATE POLICY "strategic_initiative_milestones_modify_policy" 
ON public.strategic_initiative_milestones 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'manager')
  )
);

-- Strategic resource allocations policies
CREATE POLICY "strategic_resource_allocations_select_policy" 
ON public.strategic_resource_allocations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.status = 'approved'
  )
);

CREATE POLICY "strategic_resource_allocations_modify_policy" 
ON public.strategic_resource_allocations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'manager')
  )
);

-- Add comments to explain the policy structure
COMMENT ON POLICY "strategic_initiatives_select_policy" ON public.strategic_initiatives IS 
'Allows approved users to view strategic initiatives without using SECURITY DEFINER functions';

COMMENT ON POLICY "strategic_initiatives_modify_policy" ON public.strategic_initiatives IS 
'Allows admin and manager users to modify strategic initiatives without using SECURITY DEFINER functions';

COMMENT ON POLICY "strategic_initiative_milestones_select_policy" ON public.strategic_initiative_milestones IS 
'Allows approved users to view strategic initiative milestones without using SECURITY DEFINER functions';

COMMENT ON POLICY "strategic_initiative_milestones_modify_policy" ON public.strategic_initiative_milestones IS 
'Allows admin and manager users to modify strategic initiative milestones without using SECURITY DEFINER functions';

COMMENT ON POLICY "strategic_resource_allocations_select_policy" ON public.strategic_resource_allocations IS 
'Allows approved users to view strategic resource allocations without using SECURITY DEFINER functions';

COMMENT ON POLICY "strategic_resource_allocations_modify_policy" ON public.strategic_resource_allocations IS 
'Allows admin and manager users to modify strategic resource allocations without using SECURITY DEFINER functions';