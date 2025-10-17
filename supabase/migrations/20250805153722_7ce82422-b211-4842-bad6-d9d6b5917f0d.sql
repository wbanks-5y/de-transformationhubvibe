-- Fix security definer view issue
-- Remove SECURITY DEFINER from the view and make it a regular view
CREATE OR REPLACE VIEW public.initiative_health_scores AS
SELECT 
  i.id,
  i.name,
  i.status,
  i.progress_percentage,
  -- Calculate milestone-driven progress
  COALESCE(
    (SELECT 
      CASE 
        WHEN SUM(m.milestone_weight) > 0 THEN 
          ROUND((SUM(CASE WHEN m.status = 'completed' THEN m.milestone_weight ELSE 0 END) / SUM(m.milestone_weight)) * 100)
        ELSE 0 
      END
    FROM public.strategic_initiative_milestones m 
    WHERE m.initiative_id = i.id), 
    0
  ) as milestone_progress_percentage,
  
  -- Calculate resource utilization
  COALESCE(
    (SELECT 
      CASE 
        WHEN SUM(r.allocated_amount) > 0 THEN 
          ROUND((SUM(r.utilized_amount) / SUM(r.allocated_amount)) * 100)
        ELSE 0 
      END
    FROM public.strategic_resource_allocations r 
    WHERE r.initiative_id = i.id), 
    0
  ) as resource_utilization_percentage,
  
  -- Calculate timeline health (overdue milestones impact)
  COALESCE(
    (SELECT 
      COUNT(*) FILTER (WHERE m.target_date < CURRENT_DATE AND m.status != 'completed')
    FROM public.strategic_initiative_milestones m 
    WHERE m.initiative_id = i.id), 
    0
  ) as overdue_milestones,
  
  -- Overall health score
  CASE 
    WHEN i.status = 'completed' THEN 100
    WHEN i.status = 'cancelled' THEN 0
    ELSE 
      GREATEST(0, LEAST(100, 
        (COALESCE(i.progress_percentage, 0) * 0.4) +
        (COALESCE(
          (SELECT 
            CASE 
              WHEN SUM(m.milestone_weight) > 0 THEN 
                (SUM(CASE WHEN m.status = 'completed' THEN m.milestone_weight ELSE 0 END) / SUM(m.milestone_weight)) * 100
              ELSE 0 
            END
          FROM public.strategic_initiative_milestones m 
          WHERE m.initiative_id = i.id), 
          0
        ) * 0.4) +
        (CASE 
          WHEN (SELECT COUNT(*) FROM public.strategic_initiative_milestones m WHERE m.initiative_id = i.id AND m.target_date < CURRENT_DATE AND m.status != 'completed') > 0 
          THEN 0 
          ELSE 20 
        END)
      ))
  END as health_score
FROM public.strategic_initiatives i
WHERE i.is_active = true;