-- Fix remaining functions with insecure search paths
CREATE OR REPLACE FUNCTION public.calculate_trend_percentage(current_val numeric, previous_val numeric)
RETURNS numeric
LANGUAGE sql
STABLE
SET search_path = ''
AS $function$
  SELECT CASE 
    WHEN previous_val IS NULL OR previous_val = 0 THEN NULL
    ELSE ROUND(((current_val - previous_val) / ABS(previous_val)) * 100, 2)
  END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.replace_time_based_metric_data(p_time_metric_id uuid, p_data_points jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  deleted_count INTEGER := 0;
  inserted_count INTEGER := 0;
  data_point JSONB;
BEGIN
  -- Start transaction (implicit in function)
  
  -- Delete all existing data for this time_metric_id
  DELETE FROM public.metric_time_based_data 
  WHERE time_metric_id = p_time_metric_id;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Insert new data points
  FOR data_point IN SELECT * FROM jsonb_array_elements(p_data_points)
  LOOP
    INSERT INTO public.metric_time_based_data (
      time_metric_id,
      year,
      quarter,
      month,
      week,
      day,
      date_value,
      value,
      series_name,
      series_color
    ) VALUES (
      p_time_metric_id,
      (data_point->>'year')::INTEGER,
      CASE WHEN data_point->>'quarter' IS NOT NULL THEN (data_point->>'quarter')::INTEGER ELSE NULL END,
      CASE WHEN data_point->>'month' IS NOT NULL THEN (data_point->>'month')::INTEGER ELSE NULL END,
      CASE WHEN data_point->>'week' IS NOT NULL THEN (data_point->>'week')::INTEGER ELSE NULL END,
      CASE WHEN data_point->>'day' IS NOT NULL THEN (data_point->>'day')::INTEGER ELSE NULL END,
      CASE WHEN data_point->>'date_value' IS NOT NULL THEN (data_point->>'date_value')::DATE ELSE NULL END,
      (data_point->>'value')::NUMERIC,
      COALESCE(data_point->>'series_name', 'Series 1'),
      COALESCE(data_point->>'series_color', '#4F46E5')
    );
    
    inserted_count := inserted_count + 1;
  END LOOP;
  
  -- Return summary
  RETURN jsonb_build_object(
    'success', true,
    'deleted_count', deleted_count,
    'inserted_count', inserted_count,
    'time_metric_id', p_time_metric_id
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error information
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'error_code', SQLSTATE,
      'deleted_count', deleted_count,
      'inserted_count', inserted_count
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_password_complexity(password text)
RETURNS boolean
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  -- Password must be at least 8 characters
  IF LENGTH(password) < 8 THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one uppercase letter
  IF password !~ '[A-Z]' THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one lowercase letter
  IF password !~ '[a-z]' THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one number
  IF password !~ '[0-9]' THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one special character
  IF password !~ '[^A-Za-z0-9]' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_calculate_kpi_trends()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_home_cockpit_aggregates()
RETURNS TABLE(cockpit_type_id uuid, cockpit_name text, display_name text, total_kpis bigint, active_kpis bigint, avg_health_score numeric, performance_percentage numeric, health_status text, icon text, color text, last_updated timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  WITH cockpit_kpi_data AS (
    -- Get all KPIs with their current values and targets
    SELECT 
      ct.id as cockpit_type_id,
      ct.name as cockpit_name,
      ct.display_name,
      ct.icon,
      ct.color_class,
      ct.sort_order,
      ck.id as kpi_id,
      ck.weight,
      ck.trend_direction,
      ck.is_active,
      -- Get current value based on KPI type
      CASE 
        WHEN ck.kpi_data_type = 'single' THEN (
          SELECT ckv.current_value 
          FROM public.cockpit_kpi_values ckv 
          WHERE ckv.kpi_id = ck.id 
          ORDER BY ckv.recorded_at DESC 
          LIMIT 1
        )
        WHEN ck.kpi_data_type = 'time_based' THEN (
          SELECT cktb.actual_value 
          FROM public.cockpit_kpi_time_based cktb 
          WHERE cktb.kpi_id = ck.id 
          ORDER BY cktb.period_start DESC 
          LIMIT 1
        )
        ELSE NULL
      END as current_value,
      -- Get target value
      (
        SELECT ckt.target_value 
        FROM public.cockpit_kpi_targets ckt 
        WHERE ckt.kpi_id = ck.id 
          AND ckt.is_active = true 
        ORDER BY ckt.created_at DESC 
        LIMIT 1
      ) as target_value
    FROM public.cockpit_types ct
    LEFT JOIN public.cockpit_kpis ck ON ct.id = ck.cockpit_type_id
    WHERE ct.is_active = true
  ),
  cockpit_aggregates AS (
    SELECT 
      ckd.cockpit_type_id,
      ckd.cockpit_name,
      ckd.display_name,
      ckd.icon,
      ckd.color_class,
      ckd.sort_order,
      COUNT(*) as total_kpis,
      COUNT(*) FILTER (WHERE ckd.is_active = true) as active_kpis,
      -- Calculate weighted achievement percentage
      CASE 
        WHEN SUM(ckd.weight) FILTER (WHERE ckd.current_value IS NOT NULL AND ckd.target_value IS NOT NULL AND ckd.target_value > 0) > 0 THEN
          SUM(
            CASE 
              WHEN ckd.current_value IS NOT NULL AND ckd.target_value IS NOT NULL AND ckd.target_value > 0 THEN
                CASE 
                  WHEN ckd.trend_direction = 'lower_is_better' THEN
                    LEAST((ckd.target_value / NULLIF(ckd.current_value, 0)) * 100 * ckd.weight, 100 * ckd.weight)
                  ELSE
                    LEAST((ckd.current_value / ckd.target_value) * 100 * ckd.weight, 100 * ckd.weight)
                END
              ELSE 0
            END
          ) / SUM(ckd.weight) FILTER (WHERE ckd.current_value IS NOT NULL AND ckd.target_value IS NOT NULL AND ckd.target_value > 0)
        ELSE 0
      END as performance_percentage
    FROM cockpit_kpi_data ckd
    WHERE ckd.cockpit_type_id IS NOT NULL
    GROUP BY ckd.cockpit_type_id, ckd.cockpit_name, ckd.display_name, ckd.icon, ckd.color_class, ckd.sort_order
  )
  SELECT 
    ca.cockpit_type_id,
    ca.cockpit_name,
    ca.display_name,
    ca.total_kpis,
    ca.active_kpis,
    ROUND(ca.performance_percentage, 0) as avg_health_score,
    ROUND(ca.performance_percentage, 0) as performance_percentage,
    CASE 
      WHEN ca.performance_percentage >= 90 THEN 'excellent'
      WHEN ca.performance_percentage >= 75 THEN 'good'
      WHEN ca.performance_percentage >= 60 THEN 'warning'
      ELSE 'poor'
    END as health_status,
    ca.icon,
    CASE 
      WHEN ca.color_class IS NOT NULL AND ca.color_class LIKE '#%' THEN ca.color_class
      WHEN ca.color_class = 'bg-blue-500' THEN '#3b82f6'
      WHEN ca.color_class = 'bg-green-500' THEN '#10b981'
      WHEN ca.color_class = 'bg-purple-500' THEN '#8b5cf6'
      WHEN ca.color_class = 'bg-orange-500' THEN '#f97316'
      WHEN ca.color_class = 'bg-teal-500' THEN '#14b8a6'
      WHEN ca.color_class = 'bg-pink-500' THEN '#ec4899'
      WHEN ca.color_class = 'bg-indigo-500' THEN '#6366f1'
      WHEN ca.color_class = 'bg-red-500' THEN '#ef4444'
      WHEN ca.color_class = 'bg-yellow-500' THEN '#eab308'
      WHEN ca.color_class = 'bg-gray-500' THEN '#6b7280'
      ELSE 
        CASE 
          WHEN ca.performance_percentage >= 90 THEN '#10b981'
          WHEN ca.performance_percentage >= 75 THEN '#3b82f6'
          WHEN ca.performance_percentage >= 60 THEN '#f59e0b'
          ELSE '#ef4444'
        END
    END as color,
    now() as last_updated
  FROM cockpit_aggregates ca
  WHERE ca.total_kpis > 0
  ORDER BY ca.sort_order ASC, ca.display_name ASC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.populate_date_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  -- Only populate if this is a time-based metric and timestamp is provided
  IF EXISTS (
    SELECT 1 FROM public.cockpit_metrics 
    WHERE id = NEW.metric_id AND x_axis_type = 'time'
  ) AND NEW.timestamp IS NOT NULL THEN
    NEW.year := EXTRACT(YEAR FROM NEW.timestamp);
    NEW.month := EXTRACT(MONTH FROM NEW.timestamp);
    NEW.day := EXTRACT(DAY FROM NEW.timestamp);
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.compute_date_value()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  -- Compute date_value based on available time components
  IF NEW.day IS NOT NULL AND NEW.month IS NOT NULL THEN
    NEW.date_value := make_date(NEW.year, NEW.month, NEW.day);
  ELSIF NEW.month IS NOT NULL THEN
    NEW.date_value := make_date(NEW.year, NEW.month, 1);
  ELSIF NEW.quarter IS NOT NULL THEN
    NEW.date_value := make_date(NEW.year, (NEW.quarter - 1) * 3 + 1, 1);
  ELSE
    NEW.date_value := make_date(NEW.year, 1, 1);
  END IF;
  
  RETURN NEW;
END;
$function$;