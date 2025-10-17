-- Create trigger function to auto-populate completion_date when milestone status changes to 'completed'
CREATE OR REPLACE FUNCTION public.handle_milestone_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is being changed to 'completed' and completion_date is null, set it to now
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') AND NEW.completion_date IS NULL THEN
    NEW.completion_date = CURRENT_DATE;
  END IF;
  
  -- Calculate actual_duration_days if we have completion_date and target_date
  IF NEW.completion_date IS NOT NULL AND NEW.target_date IS NOT NULL AND NEW.actual_duration_days IS NULL THEN
    -- Calculate based on when milestone was actually completed vs target
    NEW.actual_duration_days = NEW.completion_date - NEW.target_date + COALESCE(NEW.estimated_duration_days, 7);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on strategic_initiative_milestones table
CREATE TRIGGER trigger_milestone_completion
  BEFORE UPDATE ON public.strategic_initiative_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_milestone_completion();

-- Backfill completion_date for existing completed milestones that don't have it
UPDATE public.strategic_initiative_milestones 
SET completion_date = COALESCE(target_date, created_at::date)
WHERE status = 'completed' AND completion_date IS NULL;

-- Update actual_duration_days for completed milestones
UPDATE public.strategic_initiative_milestones 
SET actual_duration_days = COALESCE(estimated_duration_days, 7)
WHERE status = 'completed' 
  AND completion_date IS NOT NULL 
  AND actual_duration_days IS NULL;