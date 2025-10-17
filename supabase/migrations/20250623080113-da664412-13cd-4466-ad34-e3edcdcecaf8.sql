
-- First, let's clean up any partially inserted data for manufacturing
DELETE FROM cockpit_kpi_targets WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_time_based WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_values WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1
  )
);

DELETE FROM cockpit_kpis WHERE cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1
);

-- Insert Manufacturing KPIs into cockpit_kpis table
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
-- Single Value KPIs (with mixed performance scenarios)
(
  (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1),
  'overall_equipment_effectiveness',
  'Overall Equipment Effectiveness (OEE)',
  'Percentage of time equipment is productive and efficient',
  'single',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'large',
  2.5,
  1,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1),
  'production_efficiency',
  'Production Efficiency',
  'Percentage of planned production achieved',
  'single',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  2.0,
  2,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1),
  'quality_rate',
  'Quality Rate',
  'Percentage of products meeting quality standards',
  'single',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  2.0,
  3,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1),
  'average_downtime_hours',
  'Average Downtime Hours',
  'Average hours of unplanned equipment downtime per day',
  'single',
  'number',
  '{"decimal_places": 1}',
  'lower_is_better',
  'small',
  1.5,
  4,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1),
  'safety_incidents',
  'Safety Incidents',
  'Number of safety incidents this month',
  'single',
  'number',
  '{"decimal_places": 0}',
  'lower_is_better',
  'small',
  1.5,
  5,
  true
),
-- Time-Based KPIs
(
  (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1),
  'monthly_production_volume',
  'Monthly Production Volume',
  'Total units produced per month',
  'time_based',
  'number',
  '{"decimal_places": 0}',
  'higher_is_better',
  'large',
  2.5,
  6,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1),
  'defect_rate',
  'Defect Rate',
  'Percentage of defective products monthly',
  'time_based',
  'percentage',
  '{"decimal_places": 2}',
  'lower_is_better',
  'medium',
  2.0,
  7,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1),
  'machine_utilization',
  'Machine Utilization',
  'Percentage of available machine time used',
  'time_based',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  1.5,
  8,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1),
  'labor_productivity',
  'Labor Productivity',
  'Units produced per labor hour',
  'time_based',
  'number',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  1.5,
  9,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1),
  'energy_consumption',
  'Energy Consumption',
  'Monthly energy consumption in kWh',
  'time_based',
  'number',
  '{"decimal_places": 0}',
  'lower_is_better',
  'small',
  1.0,
  10,
  true
);

-- Insert current single KPI values (June 2025) - Mixed performance scenarios
INSERT INTO cockpit_kpi_values (kpi_id, current_value, recorded_at, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'overall_equipment_effectiveness' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  78.0,
  '2025-06-23T10:00:00Z',
  'Below target - equipment maintenance issues'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'production_efficiency' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  89.0,
  '2025-06-23T10:00:00Z',
  'Slightly below target - supply chain delays'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'quality_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  99.2,
  '2025-06-23T10:00:00Z',
  'Close to target - minor quality issues'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'average_downtime_hours' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  4.2,
  '2025-06-23T10:00:00Z',
  'Above target - equipment aging issues'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'safety_incidents' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  3,
  '2025-06-23T10:00:00Z',
  'Above target - safety training needed'
);

-- Insert time-based historical data (18 months: Jan 2024 - Jun 2025)
-- Monthly Production Volume (GOOD performance - meeting/exceeding targets)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 85000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 88000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 92000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 95000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 98000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 101000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 99000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 96000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 103000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 105000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 108000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 102000),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 110000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 112000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 115000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 118000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 120000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 122000);

-- Defect Rate (BAD performance - above targets)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 2.5),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 2.8),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 3.1),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 2.9),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 2.7),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 2.4),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 2.6),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 2.8),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 2.3),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 2.1),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 2.0),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 1.9),
-- 2025 data - worsening trend
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 2.2),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 2.4),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 2.6),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 2.7),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 2.9),
((SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 2.8);

-- Machine Utilization (GOOD performance)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 82.5),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 84.2),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 86.1),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 87.3),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 88.9),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 90.2),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 89.5),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 88.1),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 91.4),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 92.1),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 93.2),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 90.8),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 94.1),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 94.8),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 95.2),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 95.7),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 96.1),
((SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 96.5);

-- Labor Productivity (GOOD performance - exceeding targets)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 12.5),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 12.8),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 13.2),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 13.5),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 13.8),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 14.1),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 13.9),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 13.6),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 14.3),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 14.6),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 14.9),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 14.7),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 15.2),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 15.4),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 15.7),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 15.9),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 16.1),
((SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 16.3);

-- Energy Consumption (BAD performance - above targets)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 850000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 865000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 880000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 895000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 910000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 925000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 940000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 955000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 920000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 935000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 950000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 965000),
-- 2025 data - worsening trend
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 980000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 995000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 1010000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 1025000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 1040000),
((SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 1055000);

-- Insert KPI targets with time-aligned periods (matching actuals timeframe)
-- Single value targets (no period information needed)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'overall_equipment_effectiveness' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'single',
  85.0,
  true,
  'OEE target for manufacturing excellence'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'production_efficiency' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'single',
  92.0,
  true,
  'Production efficiency target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'quality_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'single',
  99.5,
  true,
  'Quality excellence target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'average_downtime_hours' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'single',
  2.0,
  true,
  'Maximum acceptable downtime per day'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'safety_incidents' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'single',
  0,
  true,
  'Zero safety incidents target'
);

-- Time-based targets with period information aligned to actual data
-- Historical targets (2024)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'time_based',
  95000,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 production volume target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'time_based',
  1.5,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 defect rate target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'time_based',
  88.0,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 machine utilization target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'time_based',
  13.0,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 labor productivity target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'time_based',
  800000,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 energy efficiency target'
);

-- Current year targets (2025)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_production_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'time_based',
  115000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 production volume target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'time_based',
  1.5,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 defect rate target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'machine_utilization' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'time_based',
  92.0,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 machine utilization target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'labor_productivity' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'time_based',
  15.0,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 labor productivity target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'energy_consumption' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'manufacturing' LIMIT 1)),
  'time_based',
  850000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 energy efficiency target'
);
