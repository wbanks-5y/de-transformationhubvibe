
-- First, let's clean up any existing operations KPI data to start fresh
DELETE FROM cockpit_kpi_targets WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_time_based WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_values WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1
  )
);

DELETE FROM cockpit_kpis WHERE cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1
);

-- Insert Operations KPIs into cockpit_kpis table
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
-- Single Value KPIs (mixed performance scenarios)
(
  (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1),
  'overall_equipment_effectiveness',
  'Overall Equipment Effectiveness (OEE)',
  'Combined measure of equipment availability, performance, and quality',
  'single',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'large',
  3.0,
  1,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1),
  'production_efficiency_rate',
  'Production Efficiency Rate',
  'Ratio of actual production output to planned production capacity',
  'single',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  2.8,
  2,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1),
  'average_downtime_hours',
  'Average Downtime Hours',
  'Average daily equipment downtime across all production lines',
  'single',
  'number',
  '{"decimal_places": 1}',
  'lower_is_better',
  'small',
  2.5,
  3,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1),
  'quality_defect_rate',
  'Quality Defect Rate',
  'Percentage of products failing quality control standards',
  'single',
  'percentage',
  '{"decimal_places": 2}',
  'lower_is_better',
  'medium',
  2.7,
  4,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1),
  'resource_utilization_rate',
  'Resource Utilization Rate',
  'Percentage of available resources actively used in production',
  'single',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'small',
  2.2,
  5,
  true
),
-- Time-Based KPIs
(
  (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1),
  'daily_production_output',
  'Daily Production Output',
  'Total units produced per day across all production lines',
  'time_based',
  'number',
  '{"decimal_places": 0}',
  'higher_is_better',
  'large',
  3.0,
  6,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1),
  'operating_cost_per_unit',
  'Operating Cost per Unit',
  'Average cost to produce one unit including labor, materials, and overhead',
  'time_based',
  'currency',
  '{"decimal_places": 2, "currency_code": "USD"}',
  'lower_is_better',
  'medium',
  2.6,
  7,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1),
  'employee_productivity_index',
  'Employee Productivity Index',
  'Composite measure of worker efficiency and output quality',
  'time_based',
  'number',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  2.4,
  8,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1),
  'equipment_maintenance_cost',
  'Equipment Maintenance Cost',
  'Monthly expenditure on equipment maintenance and repairs',
  'time_based',
  'currency',
  '{"decimal_places": 0, "currency_code": "USD"}',
  'lower_is_better',
  'small',
  2.0,
  9,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1),
  'safety_incident_rate',
  'Safety Incident Rate',
  'Number of safety incidents per 100,000 hours worked',
  'time_based',
  'number',
  '{"decimal_places": 2}',
  'lower_is_better',
  'medium',
  2.8,
  10,
  true
);

-- Insert current single KPI values (June 2025) - Mixed performance scenarios
INSERT INTO cockpit_kpi_values (kpi_id, current_value, recorded_at, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'overall_equipment_effectiveness' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  78.5,
  '2025-06-23T10:00:00Z',
  'Below world-class benchmark - aging equipment impact'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'production_efficiency_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  91.2,
  '2025-06-23T10:00:00Z',
  'Below target - material shortages and setup delays'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'average_downtime_hours' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  2.8,
  '2025-06-23T10:00:00Z',
  'Above target - increased maintenance requirements'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'quality_defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  1.2,
  '2025-06-23T10:00:00Z',
  'Above target - quality issues with new product lines'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'resource_utilization_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  87.5,
  '2025-06-23T10:00:00Z',
  'Slightly below target - capacity optimization needed'
);

-- Insert time-based historical data (18 months: Jan 2024 - Jun 2025)
-- Daily Production Output (GOOD performance - steady growth with seasonality)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data - showing seasonal patterns (Q1 maintenance, Q4 high demand)
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 12500),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 12800),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 13200),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 13800),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 14200),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 14500),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 14800),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 15100),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 15400),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 16200),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 16800),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 17500),
-- 2025 data - continued growth
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 15200),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 15800),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 16400),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 16800),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 17200),
((SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 17600);

-- Operating Cost per Unit (BAD performance - rising costs)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data - showing cost inflation
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 15.25),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 15.42),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 15.68),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 15.85),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 16.12),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 16.35),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 16.58),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 16.82),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 17.05),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 17.28),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 17.52),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 17.75),
-- 2025 data - continued cost increases
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 17.98),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 18.22),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 18.45),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 18.68),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 18.92),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 19.15);

-- Employee Productivity Index (BAD performance - declining trend)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data - showing declining productivity
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 95.2),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 94.8),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 94.1),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 93.5),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 92.8),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 92.2),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 91.7),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 91.1),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 90.5),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 89.8),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 89.2),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 88.5),
-- 2025 data - continued decline
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 87.9),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 87.3),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 86.8),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 86.2),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 85.7),
((SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 85.1);

-- Equipment Maintenance Cost (GOOD performance - well controlled)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data - showing good cost control
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 125000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 118000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 135000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 122000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 115000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 128000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 132000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 119000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 124000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 127000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 121000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 126000),
-- 2025 data - continued good performance
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 123000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 118000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 129000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 125000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 122000),
((SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 120000);

-- Safety Incident Rate (GOOD performance - improving trend)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data - showing safety improvements
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 3.25),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 3.18),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 3.05),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 2.92),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 2.85),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 2.73),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 2.68),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 2.55),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 2.42),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 2.35),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 2.28),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 2.15),
-- 2025 data - continued improvement
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 2.08),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 1.95),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 1.82),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 1.75),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 1.68),
((SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 1.52);

-- Insert KPI targets with time-aligned periods (matching actuals timeframe)
-- Single value targets (no period information needed)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'overall_equipment_effectiveness' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'single',
  85.0,
  true,
  'World-class OEE benchmark target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'production_efficiency_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'single',
  95.0,
  true,
  'Production efficiency excellence target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'average_downtime_hours' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'single',
  2.0,
  true,
  'Maximum acceptable daily downtime'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'quality_defect_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'single',
  0.8,
  true,
  'Quality excellence target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'resource_utilization_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'single',
  90.0,
  true,
  'Optimal resource utilization target'
);

-- Time-based targets with period information aligned to actual data
-- Historical targets (2024)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'time_based',
  14000,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 daily production output target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'time_based',
  16.0,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 cost per unit budget target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'time_based',
  95.0,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 productivity excellence target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'time_based',
  130000,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 maintenance cost budget target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'time_based',
  2.5,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 safety performance target'
);

-- Current year targets (2025)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'daily_production_output' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'time_based',
  16000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 daily production output target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'operating_cost_per_unit' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'time_based',
  17.5,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 cost per unit budget target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'employee_productivity_index' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'time_based',
  92.0,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 productivity improvement target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'equipment_maintenance_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'time_based',
  125000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 maintenance cost optimization target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'safety_incident_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'operations' LIMIT 1)),
  'time_based',
  1.8,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 safety excellence target'
);
