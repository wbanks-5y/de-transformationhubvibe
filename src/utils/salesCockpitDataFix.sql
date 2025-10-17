
-- First, let's update the existing Sales metrics with proper chart data and current values

-- Update Revenue Growth metric with chart data
UPDATE cockpit_metrics 
SET 
  current_value = '2850000',
  target_value = '3000000',
  chart_data = '[
    {
      "id": "revenue_series",
      "name": "Monthly Revenue",
      "data": [
        {"timestamp": "2024-01-01", "value": 2000000},
        {"timestamp": "2024-02-01", "value": 2100000},
        {"timestamp": "2024-03-01", "value": 2300000},
        {"timestamp": "2024-04-01", "value": 2000000},
        {"timestamp": "2024-05-01", "value": 2300000},
        {"timestamp": "2024-06-01", "value": 1800000},
        {"timestamp": "2024-07-01", "value": 2500000},
        {"timestamp": "2024-08-01", "value": 2800000},
        {"timestamp": "2024-09-01", "value": 3000000},
        {"timestamp": "2024-10-01", "value": 2850000}
      ]
    }
  ]'::jsonb
WHERE name = 'monthly_revenue' AND cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'sales'
);

-- Update Sales Pipeline metric
UPDATE cockpit_metrics 
SET 
  current_value = '125',
  target_value = '150',
  chart_data = '[
    {
      "id": "pipeline_series",
      "name": "Sales Pipeline",
      "data": [
        {"timestamp": "2024-01-01", "value": 95},
        {"timestamp": "2024-02-01", "value": 105},
        {"timestamp": "2024-03-01", "value": 115},
        {"timestamp": "2024-04-01", "value": 100},
        {"timestamp": "2024-05-01", "value": 120},
        {"timestamp": "2024-06-01", "value": 90},
        {"timestamp": "2024-07-01", "value": 130},
        {"timestamp": "2024-08-01", "value": 140},
        {"timestamp": "2024-09-01", "value": 135},
        {"timestamp": "2024-10-01", "value": 125}
      ]
    }
  ]'::jsonb
WHERE name = 'sales_pipeline' AND cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'sales'
);

-- Update Conversion Rate metric
UPDATE cockpit_metrics 
SET 
  current_value = '24.5',
  target_value = '30.0',
  chart_data = '[
    {
      "id": "conversion_series",
      "name": "Conversion Rate %",
      "data": [
        {"timestamp": "2024-01-01", "value": 18.5},
        {"timestamp": "2024-02-01", "value": 20.2},
        {"timestamp": "2024-03-01", "value": 22.1},
        {"timestamp": "2024-04-01", "value": 19.8},
        {"timestamp": "2024-05-01", "value": 23.5},
        {"timestamp": "2024-06-01", "value": 17.9},
        {"timestamp": "2024-07-01", "value": 25.2},
        {"timestamp": "2024-08-01", "value": 26.8},
        {"timestamp": "2024-09-01", "value": 25.9},
        {"timestamp": "2024-10-01", "value": 24.5}
      ]
    }
  ]'::jsonb
WHERE name = 'conversion_rate' AND cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'sales'
);

-- Update Customer Acquisition metric
UPDATE cockpit_metrics 
SET 
  current_value = '72',
  target_value = '80',
  chart_data = '[
    {
      "id": "acquisition_series", 
      "name": "New Customers",
      "data": [
        {"timestamp": "2024-01-01", "value": 45},
        {"timestamp": "2024-02-01", "value": 52},
        {"timestamp": "2024-03-01", "value": 61},
        {"timestamp": "2024-04-01", "value": 48},
        {"timestamp": "2024-05-01", "value": 67},
        {"timestamp": "2024-06-01", "value": 41},
        {"timestamp": "2024-07-01", "value": 74},
        {"timestamp": "2024-08-01", "value": 79},
        {"timestamp": "2024-09-01", "value": 76},
        {"timestamp": "2024-10-01", "value": 72}
      ]
    }
  ]'::jsonb
WHERE name = 'customer_acquisition' AND cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'sales'
);

-- Now let's update the KPIs to reference the correct metrics by their actual IDs
-- First, let's update the Current Revenue KPI to use the monthly_revenue metric
UPDATE cockpit_kpis 
SET 
  formula_parameters = jsonb_build_object(
    'current_revenue', jsonb_build_object(
      'type', 'metric',
      'metric_id', (
        SELECT id FROM cockpit_metrics 
        WHERE name = 'monthly_revenue' 
        AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales')
      ),
      'series_id', 'revenue_series'
    )
  )
WHERE name = 'current_revenue' AND cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'sales'
);

-- Update the Sales Growth KPI
UPDATE cockpit_kpis 
SET 
  formula_parameters = jsonb_build_object(
    'current_sales', jsonb_build_object(
      'type', 'metric',
      'metric_id', (
        SELECT id FROM cockpit_metrics 
        WHERE name = 'monthly_revenue' 
        AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales')
      ),
      'series_id', 'revenue_series'
    ),
    'target_sales', jsonb_build_object(
      'type', 'number',
      'value', 3000000
    )
  )
WHERE name = 'sales_growth' AND cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'sales'
);

-- Update the Pipeline Efficiency KPI
UPDATE cockpit_kpis 
SET 
  formula_parameters = jsonb_build_object(
    'pipeline_value', jsonb_build_object(
      'type', 'metric',
      'metric_id', (
        SELECT id FROM cockpit_metrics 
        WHERE name = 'sales_pipeline' 
        AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales')
      ),
      'series_id', 'pipeline_series'
    ),
    'conversion_rate', jsonb_build_object(
      'type', 'metric',
      'metric_id', (
        SELECT id FROM cockpit_metrics 
        WHERE name = 'conversion_rate' 
        AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales')
      ),
      'series_id', 'conversion_series'
    )
  )
WHERE name = 'pipeline_efficiency' AND cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'sales'
);

-- Update Customer Growth KPI
UPDATE cockpit_kpis 
SET 
  formula_parameters = jsonb_build_object(
    'new_customers', jsonb_build_object(
      'type', 'metric',
      'metric_id', (
        SELECT id FROM cockpit_metrics 
        WHERE name = 'customer_acquisition' 
        AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales')
      ),
      'series_id', 'acquisition_series'
    ),
    'target_customers', jsonb_build_object(
      'type', 'number',
      'value', 80
    )
  )
WHERE name = 'customer_growth' AND cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'sales'
);
