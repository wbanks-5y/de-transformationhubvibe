-- Phase 1: Enhanced Data Integration & Relationships for Initiative Tracker

-- 1.1 Create Initiative-KPI Linkages table
CREATE TABLE public.initiative_kpi_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initiative_id UUID NOT NULL REFERENCES public.strategic_initiatives(id) ON DELETE CASCADE,
  kpi_id UUID NOT NULL REFERENCES public.cockpit_kpis(id) ON DELETE CASCADE,
  weight NUMERIC DEFAULT 1.0,
  target_impact_percentage NUMERIC,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(initiative_id, kpi_id)
);

-- 1.2 Add milestone completion tracking fields
ALTER TABLE public.strategic_initiative_milestones 
ADD COLUMN completion_percentage NUMERIC DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
ADD COLUMN deliverables JSONB DEFAULT '[]'::jsonb,
ADD COLUMN milestone_weight NUMERIC DEFAULT 1.0;

-- 1.3 Enhance resource allocations with timeline integration
ALTER TABLE public.strategic_resource_allocations
ADD COLUMN resource_category TEXT DEFAULT 'human_resources',
ADD COLUMN hourly_rate NUMERIC,
ADD COLUMN efficiency_percentage NUMERIC DEFAULT 100,
ADD COLUMN notes TEXT;

-- 1.4 Create milestone templates table
CREATE TABLE public.milestone_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL, -- 'initiative_type' or 'custom'
  default_deliverables JSONB DEFAULT '[]'::jsonb,
  estimated_duration_days INTEGER DEFAULT 7,
  milestone_weight NUMERIC DEFAULT 1.0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 1.5 Create initiative health scores view
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

-- Enable RLS on new tables
ALTER TABLE public.initiative_kpi_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Approved users can view initiative KPI links" 
ON public.initiative_kpi_links FOR SELECT 
USING (is_approved_user_secure());

CREATE POLICY "Managers can modify initiative KPI links" 
ON public.initiative_kpi_links FOR ALL 
USING (is_manager_or_admin_secure());

CREATE POLICY "Approved users can view milestone templates" 
ON public.milestone_templates FOR SELECT 
USING (is_approved_user_secure());

CREATE POLICY "Managers can modify milestone templates" 
ON public.milestone_templates FOR ALL 
USING (is_manager_or_admin_secure());

-- Add updated_at triggers
CREATE TRIGGER update_initiative_kpi_links_updated_at
  BEFORE UPDATE ON public.initiative_kpi_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_milestone_templates_updated_at
  BEFORE UPDATE ON public.milestone_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default milestone templates
INSERT INTO public.milestone_templates (name, description, template_type, default_deliverables, estimated_duration_days, milestone_weight) VALUES
('Project Kickoff', 'Initial project planning and team setup', 'initiative_type', '["Project charter", "Team assignments", "Communication plan"]', 5, 0.5),
('Requirements Analysis', 'Gather and document requirements', 'initiative_type', '["Requirements document", "Stakeholder interviews", "Success criteria"]', 10, 1.0),
('Design Phase', 'Create detailed design and specifications', 'initiative_type', '["Design documents", "Technical specifications", "Approval from stakeholders"]', 15, 1.5),
('Implementation', 'Execute the main initiative activities', 'initiative_type', '["Core deliverables", "Testing results", "Quality assurance"]', 30, 3.0),
('Testing & Validation', 'Test and validate initiative outcomes', 'initiative_type', '["Test results", "User acceptance", "Performance metrics"]', 10, 1.5),
('Deployment', 'Deploy and launch the initiative', 'initiative_type', '["Deployment plan", "Go-live activities", "User training"]', 7, 1.0),
('Post-Implementation Review', 'Review outcomes and lessons learned', 'initiative_type', '["Performance analysis", "Lessons learned", "Recommendations"]', 5, 0.5);