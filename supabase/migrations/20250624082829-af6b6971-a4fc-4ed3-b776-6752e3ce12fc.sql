
-- Update get_home_cockpit_aggregates function to respect sort_order from cockpit management
CREATE OR REPLACE FUNCTION public.get_home_cockpit_aggregates()
RETURNS TABLE (
  cockpit_type_id uuid,
  cockpit_name text,
  display_name text,
  total_kpis bigint,
  active_kpis bigint,
  avg_health_score numeric,
  performance_percentage numeric,
  health_status text,
  icon text,
  color text,
  last_updated timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;
