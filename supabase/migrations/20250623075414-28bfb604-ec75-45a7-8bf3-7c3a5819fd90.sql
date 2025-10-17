
-- First, let's clean up any partially inserted data
DELETE FROM cockpit_kpi_targets WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_time_based WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_values WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1
  )
);

DELETE FROM cockpit_kpis WHERE cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1
);

-- Now re-insert everything with correct constraint handling
-- Insert Sales KPIs into cockpit_kpis table
INSERT INTO cockpit_kpis (
  cockpit_type_id, 
  name, 
  display_name, 
  description, 
  kpi_data_type, 
  format_type, 
  format_options, 
  trend_direction, 
  size_config, 
  weight, 
  sort_order, 
  is_active
) VALUES 
-- Single Value KPIs
(
  (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1),
  'monthly_revenue',
  'Monthly Revenue',
  'Total revenue generated this month',
  'single',
  'currency',
  '{"currency_code": "USD", "decimal_places": 0}',
  'higher_is_better',
  'large',
  2.0,
  1,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1),
  'conversion_rate',
  'Conversion Rate',
  'Percentage of leads converted to customers',
  'single',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  1.5,
  2,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1),
  'avg_deal_size',
  'Average Deal Size',
  'Average value per closed deal',
  'single',
  'currency',
  '{"currency_code": "USD", "decimal_places": 0}',
  'higher_is_better',
  'medium',
  1.0,
  3,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1),
  'sales_cycle_days',
  'Sales Cycle Length',
  'Average days from lead to close',
  'single',
  'number',
  '{"decimal_places": 0}',
  'lower_is_better',
  'small',
  1.0,
  4,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1),
  'customer_satisfaction',
  'Customer Satisfaction',
  'Average customer satisfaction score',
  'single',
  'percentage',
  '{"decimal_places": 0}',
  'higher_is_better',
  'medium',
  1.5,
  5,
  true
),
-- Time-Based KPIs
(
  (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1),
  'monthly_sales_volume',
  'Monthly Sales Volume',
  'Total sales volume by month',
  'time_based',
  'currency',
  '{"currency_code": "USD", "decimal_places": 0}',
  'higher_is_better',
  'large',
  2.0,
  6,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1),
  'new_customers',
  'New Customers',
  'Number of new customers acquired monthly',
  'time_based',
  'number',
  '{"decimal_places": 0}',
  'higher_is_better',
  'medium',
  1.5,
  7,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1),
  'pipeline_value',
  'Pipeline Value',
  'Total value of sales pipeline by month',
  'time_based',
  'currency',
  '{"currency_code": "USD", "decimal_places": 0}',
  'higher_is_better',
  'medium',
  1.0,
  8,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1),
  'win_rate',
  'Win Rate',
  'Percentage of opportunities won monthly',
  'time_based',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  1.5,
  9,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1),
  'customer_retention',
  'Customer Retention Rate',
  'Percentage of customers retained monthly',
  'time_based',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'small',
  1.0,
  10,
  true
);

-- Insert current single KPI values (June 2025)
INSERT INTO cockpit_kpi_values (kpi_id, current_value, recorded_at, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  485000,
  '2025-06-23T10:00:00Z',
  'June 2025 revenue performance'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'conversion_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  23.5,
  '2025-06-23T10:00:00Z',
  'Current month conversion rate'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'avg_deal_size' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  12500,
  '2025-06-23T10:00:00Z',
  'Average deal value June 2025'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'sales_cycle_days' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  42,
  '2025-06-23T10:00:00Z',
  'Current average sales cycle'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'customer_satisfaction' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  87,
  '2025-06-23T10:00:00Z',
  'Customer satisfaction score June 2025'
);

-- Insert time-based historical data (18 months: Jan 2024 - Jun 2025)
-- Monthly Sales Volume
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 320000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 335000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 362000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 378000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 395000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 410000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 425000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 415000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 440000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 455000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 470000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 485000),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 465000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 475000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 490000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 505000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 520000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 535000);

-- New Customers
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 28),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 32),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 35),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 38),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 41),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 44),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 42),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 39),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 45),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 48),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 52),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 55),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 47),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 49),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 53),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 56),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 58),
((SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 61);

-- Pipeline Value
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 1200000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 1250000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 1320000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 1385000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 1420000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 1485000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 1520000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 1475000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 1580000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 1625000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 1690000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 1745000),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 1680000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 1720000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 1785000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 1850000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 1920000),
((SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 1985000);

-- Win Rate
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 18.5),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 19.2),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 20.1),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 21.3),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 22.8),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 24.2),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 23.9),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 22.7),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 25.1),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 26.4),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 27.8),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 28.5),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 26.2),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 27.1),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 28.3),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 29.6),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 30.2),
((SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 31.5);

-- Customer Retention Rate
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 89.5),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 90.2),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 91.1),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 90.8),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 92.3),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 93.1),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 92.7),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 91.9),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 93.5),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 94.2),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 94.8),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 95.1),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 93.8),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 94.5),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 95.2),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 95.8),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 96.1),
((SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 96.5);

-- Insert KPI targets with proper constraint handling
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, is_active, notes) VALUES
-- Single value targets (no period information needed)
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  'single',
  500000,
  true,
  'Monthly revenue target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'conversion_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  'single',
  25.0,
  true,
  'Target conversion rate'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'avg_deal_size' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  'single',
  15000,
  true,
  'Target average deal size'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'sales_cycle_days' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  'single',
  35,
  true,
  'Target sales cycle length'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'customer_satisfaction' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  'single',
  90,
  true,
  'Target customer satisfaction score'
);

-- Time-based targets with period information
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_sales_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  'time_based',
  550000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  'Monthly sales volume target for 2025'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'new_customers' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  'time_based',
  65,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  'Monthly new customer target for 2025'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'pipeline_value' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  'time_based',
  2000000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  'Pipeline value target for 2025'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'win_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  'time_based',
  35.0,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  'Win rate target for 2025'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'customer_retention' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'sales' LIMIT 1)),
  'time_based',
  97.0,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  'Customer retention target for 2025'
);
