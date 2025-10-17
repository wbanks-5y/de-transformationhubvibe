-- Fix initiative_health_scores view SECURITY DEFINER issue
-- Drop and recreate the view without SECURITY DEFINER property

-- First, drop the existing view
DROP VIEW IF EXISTS public.initiative_health_scores;

-- Recreate the view without SECURITY DEFINER (as a regular view)
CREATE VIEW public.initiative_health_scores AS
SELECT 
  si.id,
  si.name,
  si.status,
  COALESCE(si.progress_percentage, 0) as progress_percentage,
  COALESCE(
    CASE 
      WHEN COUNT(sim.id) > 0 THEN
        (COUNT(sim.id) FILTER (WHERE sim.status = 'completed')::numeric / COUNT(sim.id)) * 100
      ELSE 0
    END, 0
  ) as milestone_progress_percentage,
  COALESCE(
    CASE 
      WHEN COUNT(sra.id) > 0 THEN
        AVG(COALESCE(sra.utilization_percentage, 0))
      ELSE 0
    END, 0
  ) as resource_utilization_percentage,
  COALESCE(COUNT(sim.id) FILTER (WHERE sim.status != 'completed' AND sim.target_date < CURRENT_DATE), 0) as overdue_milestones,
  -- Calculate overall health score
  COALESCE(
    (
      COALESCE(si.progress_percentage, 0) * 0.4 +
      COALESCE(
        CASE 
          WHEN COUNT(sim.id) > 0 THEN
            (COUNT(sim.id) FILTER (WHERE sim.status = 'completed')::numeric / COUNT(sim.id)) * 100
          ELSE 0
        END, 0
      ) * 0.3 +
      COALESCE(
        CASE 
          WHEN COUNT(sra.id) > 0 THEN
            AVG(COALESCE(sra.utilization_percentage, 0))
          ELSE 0
        END, 0
      ) * 0.2 +
      -- Penalty for overdue milestones
      GREATEST(0, 100 - (COUNT(sim.id) FILTER (WHERE sim.status != 'completed' AND sim.target_date < CURRENT_DATE) * 10)) * 0.1
    ), 0
  ) as health_score
FROM public.strategic_initiatives si
LEFT JOIN public.strategic_initiative_milestones sim ON si.id = sim.initiative_id
LEFT JOIN public.strategic_resource_allocations sra ON si.id = sra.initiative_id
WHERE si.is_active = true
GROUP BY si.id, si.name, si.status, si.progress_percentage;

-- Ensure proper RLS policies exist for the underlying tables
-- Enable RLS on strategic_initiatives if not already enabled
ALTER TABLE public.strategic_initiatives ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for strategic_initiatives if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'strategic_initiatives' 
    AND policyname = 'Approved users can view strategic initiatives'
  ) THEN
    CREATE POLICY "Approved users can view strategic initiatives" 
    ON public.strategic_initiatives 
    FOR SELECT 
    USING (is_approved_user_secure());
  END IF;
END $$;

-- Enable RLS on strategic_initiative_milestones if not already enabled
ALTER TABLE public.strategic_initiative_milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for strategic_initiative_milestones if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'strategic_initiative_milestones' 
    AND policyname = 'Approved users can view initiative milestones'
  ) THEN
    CREATE POLICY "Approved users can view initiative milestones" 
    ON public.strategic_initiative_milestones 
    FOR SELECT 
    USING (is_approved_user_secure());
  END IF;
END $$;

-- Enable RLS on strategic_resource_allocations if not already enabled
ALTER TABLE public.strategic_resource_allocations ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for strategic_resource_allocations if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'strategic_resource_allocations' 
    AND policyname = 'Approved users can view resource allocations'
  ) THEN
    CREATE POLICY "Approved users can view resource allocations" 
    ON public.strategic_resource_allocations 
    FOR SELECT 
    USING (is_approved_user_secure());
  END IF;
END $$;