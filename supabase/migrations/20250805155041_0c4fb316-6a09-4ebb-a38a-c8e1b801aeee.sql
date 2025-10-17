-- Fix the security definer function by setting search_path
CREATE OR REPLACE FUNCTION public.handle_milestone_completion()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path TO ''
AS $$
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
$$;