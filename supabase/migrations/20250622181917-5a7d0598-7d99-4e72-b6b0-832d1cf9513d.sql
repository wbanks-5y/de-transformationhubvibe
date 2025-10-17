
-- Phase 2: Database Schema Enhancement
-- Add time series support fields to cockpit_kpi_values table
ALTER TABLE public.cockpit_kpi_values 
ADD COLUMN IF NOT EXISTS target_value numeric,
ADD COLUMN IF NOT EXISTS target_previous_value numeric,
ADD COLUMN IF NOT EXISTS target_achievement_percentage numeric;

-- Add time series configuration fields to cockpit_kpis table
ALTER TABLE public.cockpit_kpis 
ADD COLUMN IF NOT EXISTS has_time_series boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS time_granularity text DEFAULT 'month',
ADD COLUMN IF NOT EXISTS auto_calculate_trends boolean DEFAULT true;

-- Create function to calculate trend percentage between two values
CREATE OR REPLACE FUNCTION public.calculate_trend_percentage(current_val numeric, previous_val numeric)
RETURNS numeric
LANGUAGE sql
STABLE
AS $$
  SELECT CASE 
    WHEN previous_val IS NULL OR previous_val = 0 THEN NULL
    ELSE ROUND(((current_val - previous_val) / ABS(previous_val)) * 100, 2)
  END;
$$;

-- Create function to auto-calculate KPI trends when new values are inserted
CREATE OR REPLACE FUNCTION public.auto_calculate_kpi_trends()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  prev_record RECORD;
  trend_pct numeric;
  target_pct numeric;
BEGIN
  -- Get the previous record for this KPI
  SELECT * INTO prev_record
  FROM public.cockpit_kpi_values 
  WHERE kpi_id = NEW.kpi_id 
    AND period_start < NEW.period_start
  ORDER BY period_start DESC 
  LIMIT 1;

  -- Calculate trend percentage if previous record exists
  IF prev_record IS NOT NULL THEN
    NEW.previous_value := prev_record.current_value;
    NEW.trend_percentage := public.calculate_trend_percentage(NEW.current_value, prev_record.current_value);
  END IF;

  -- Calculate target achievement percentage if target exists
  IF NEW.target_value IS NOT NULL AND NEW.target_value != 0 THEN
    NEW.target_achievement_percentage := ROUND((NEW.current_value / NEW.target_value) * 100, 2);
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to auto-calculate trends on insert/update
DROP TRIGGER IF EXISTS trigger_auto_calculate_kpi_trends ON public.cockpit_kpi_values;
CREATE TRIGGER trigger_auto_calculate_kpi_trends
  BEFORE INSERT OR UPDATE ON public.cockpit_kpi_values
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_calculate_kpi_trends();

-- Add some sample time series data for existing KPIs to demonstrate functionality
INSERT INTO public.cockpit_kpi_values (kpi_id, current_value, target_value, period_start, period_end) 
SELECT 
  id as kpi_id,
  CASE 
    WHEN manual_value IS NOT NULL THEN manual_value + (random() * 20 - 10) -- Add some variation
    ELSE 100 + (random() * 50)
  END as current_value,
  CASE 
    WHEN target_value IS NOT NULL THEN target_value
    ELSE 120
  END as target_value,
  CURRENT_DATE - INTERVAL '2 months' as period_start,
  CURRENT_DATE - INTERVAL '1 month' as period_end
FROM public.cockpit_kpis 
WHERE is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO public.cockpit_kpi_values (kpi_id, current_value, target_value, period_start, period_end) 
SELECT 
  id as kpi_id,
  CASE 
    WHEN manual_value IS NOT NULL THEN manual_value + (random() * 30 - 15)
    ELSE 110 + (random() * 60)
  END as current_value,
  CASE 
    WHEN target_value IS NOT NULL THEN target_value
    ELSE 120
  END as target_value,
  CURRENT_DATE - INTERVAL '1 month' as period_start,
  CURRENT_DATE as period_end
FROM public.cockpit_kpis 
WHERE is_active = true
ON CONFLICT DO NOTHING;

-- Update existing KPIs to enable time series
UPDATE public.cockpit_kpis 
SET has_time_series = true, 
    time_granularity = 'month',
    auto_calculate_trends = true
WHERE is_active = true;
