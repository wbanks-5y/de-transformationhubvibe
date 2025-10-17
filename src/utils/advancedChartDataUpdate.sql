
-- Update some existing metrics to showcase the new chart types

-- Update one metric to use pie chart for market share
UPDATE cockpit_metrics 
SET 
  additional_data = jsonb_build_object(
    'dataType', 'multiple',
    'chartType', 'pie'
  ),
  chart_data = '[
    {
      "id": "market_share_series",
      "name": "Market Share Distribution",
      "data": [
        {"name": "Enterprise", "value": 45},
        {"name": "SMB", "value": 30},
        {"name": "Startup", "value": 15},
        {"name": "Government", "value": 10}
      ]
    }
  ]'::jsonb
WHERE name = 'conversion_rate' AND cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'sales'
);

-- Update sales pipeline to use funnel chart
UPDATE cockpit_metrics 
SET 
  additional_data = jsonb_build_object(
    'dataType', 'multiple',
    'chartType', 'funnel'
  ),
  chart_data = '[
    {
      "id": "sales_funnel_series",
      "name": "Sales Funnel",
      "data": [
        {"name": "Leads", "value": 1200},
        {"name": "Qualified", "value": 850},
        {"name": "Proposals", "value": 420},
        {"name": "Negotiations", "value": 180},
        {"name": "Closed Won", "value": 95}
      ]
    }
  ]'::jsonb
WHERE name = 'sales_pipeline' AND cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'sales'
);

-- Add a new metric with radar chart for performance analysis
INSERT INTO cockpit_metrics (
  id,
  section_id,
  name,
  display_name,
  description,
  metric_type,
  icon,
  color_class,
  sort_order,
  is_active,
  additional_data,
  chart_data
)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM cockpit_sections WHERE name = 'performance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales')),
  'team_performance',
  'Team Performance Analysis',
  'Multi-dimensional analysis of team performance across key metrics',
  'chart',
  'Radar',
  'text-purple-600',
  4,
  true,
  jsonb_build_object(
    'dataType', 'multiple',
    'chartType', 'radar'
  ),
  '[
    {
      "id": "performance_radar",
      "name": "Performance Metrics",
      "data": [
        {"name": "Sales Volume", "value": 85},
        {"name": "Customer Satisfaction", "value": 92},
        {"name": "Response Time", "value": 78},
        {"name": "Lead Quality", "value": 88},
        {"name": "Close Rate", "value": 75},
        {"name": "Retention", "value": 95}
      ]
    }
  ]'::jsonb
);

-- Add a new metric with gauge chart for goal progress
INSERT INTO cockpit_metrics (
  id,
  section_id,
  name,
  display_name,
  description,
  metric_type,
  icon,
  color_class,
  sort_order,
  is_active,
  additional_data,
  chart_data
)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM cockpit_sections WHERE name = 'goals' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales')),
  'quarterly_goal_progress',
  'Quarterly Goal Progress',
  'Progress towards quarterly sales target',
  'chart',
  'Target',
  'text-green-600',
  1,
  true,
  jsonb_build_object(
    'dataType', 'multiple',
    'chartType', 'gauge'
  ),
  '[
    {
      "id": "goal_progress",
      "name": "Progress",
      "data": [
        {"name": "Q4 Goal Progress", "value": 78}
      ]
    }
  ]'::jsonb
);

-- Add a new metric with stacked bar chart for revenue breakdown
INSERT INTO cockpit_metrics (
  id,
  section_id,
  name,
  display_name,
  description,
  metric_type,
  icon,
  color_class,
  sort_order,
  is_active,
  additional_data,
  chart_data
)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM cockpit_sections WHERE name = 'revenue' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales')),
  'revenue_breakdown',
  'Revenue by Product Line',
  'Monthly revenue breakdown by product categories',
  'chart',
  'BarChart3',
  'text-blue-600',
  3,
  true,
  jsonb_build_object(
    'dataType', 'multiple',
    'chartType', 'stacked_bar'
  ),
  '[
    {
      "id": "revenue_breakdown_series",
      "name": "Revenue Breakdown",
      "data": [
        {"name": "Jan", "Software": 180000, "Services": 120000, "Support": 50000},
        {"name": "Feb", "Software": 210000, "Services": 140000, "Support": 55000},
        {"name": "Mar", "Software": 195000, "Services": 160000, "Support": 60000},
        {"name": "Apr", "Software": 220000, "Services": 150000, "Support": 65000},
        {"name": "May", "Software": 240000, "Services": 170000, "Support": 70000},
        {"name": "Jun", "Software": 225000, "Services": 185000, "Support": 75000}
      ]
    }
  ]'::jsonb
);

-- Add scatter plot for efficiency analysis
INSERT INTO cockpit_metrics (
  id,
  section_id,
  name,
  display_name,
  description,
  metric_type,
  icon,
  color_class,
  sort_order,
  is_active,
  additional_data,
  chart_data
)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM cockpit_sections WHERE name = 'performance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales')),
  'efficiency_analysis',
  'Sales Efficiency Analysis',
  'Correlation between sales activities and results',
  'chart',
  'Zap',
  'text-yellow-600',
  5,
  true,
  jsonb_build_object(
    'dataType', 'multiple',
    'chartType', 'scatter'
  ),
  '[
    {
      "id": "efficiency_scatter",
      "name": "Efficiency Analysis",
      "data": [
        {"name": "Rep A", "value": 120, "activities": 85},
        {"name": "Rep B", "value": 150, "activities": 95},
        {"name": "Rep C", "value": 90, "activities": 110},
        {"name": "Rep D", "value": 180, "activities": 75},
        {"name": "Rep E", "value": 200, "activities": 88},
        {"name": "Rep F", "value": 75, "activities": 120},
        {"name": "Rep G", "value": 160, "activities": 92}
      ]
    }
  ]'::jsonb
);
