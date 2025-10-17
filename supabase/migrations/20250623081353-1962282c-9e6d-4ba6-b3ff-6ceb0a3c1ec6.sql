
-- First, let's clean up any existing procurement KPI data to start fresh
DELETE FROM cockpit_kpi_targets WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_time_based WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_values WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1
  )
);

DELETE FROM cockpit_kpis WHERE cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1
);

-- Insert Procurement KPIs into cockpit_kpis table
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
  (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1),
  'cost_savings_achieved',
  'Cost Savings Achieved',
  'Total cost savings realized through procurement initiatives',
  'single',
  'currency',
  '{"decimal_places": 0, "currency_code": "USD"}',
  'higher_is_better',
  'large',
  3.0,
  1,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1),
  'supplier_performance_score',
  'Supplier Performance Score',
  'Average performance score across all active suppliers',
  'single',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  2.5,
  2,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1),
  'purchase_order_cycle_time',
  'Purchase Order Cycle Time',
  'Average days from PO creation to approval',
  'single',
  'number',
  '{"decimal_places": 1}',
  'lower_is_better',
  'small',
  2.0,
  3,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1),
  'contract_compliance_rate',
  'Contract Compliance Rate',
  'Percentage of purchases made under contract terms',
  'single',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  2.5,
  4,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1),
  'emergency_purchase_ratio',
  'Emergency Purchase Ratio',
  'Percentage of urgent/emergency purchases',
  'single',
  'percentage',
  '{"decimal_places": 1}',
  'lower_is_better',
  'small',
  2.0,
  5,
  true
),
-- Time-Based KPIs
(
  (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1),
  'monthly_procurement_volume',
  'Monthly Procurement Volume',
  'Total procurement spend per month',
  'time_based',
  'currency',
  '{"decimal_places": 0, "currency_code": "USD"}',
  'higher_is_better',
  'large',
  3.0,
  6,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1),
  'average_purchase_price_variance',
  'Average Purchase Price Variance',
  'Price variance from budgeted amounts as percentage',
  'time_based',
  'percentage',
  '{"decimal_places": 1}',
  'lower_is_better',
  'medium',
  2.5,
  7,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1),
  'supplier_lead_time',
  'Supplier Lead Time',
  'Average lead time from suppliers in days',
  'time_based',
  'number',
  '{"decimal_places": 1}',
  'lower_is_better',
  'medium',
  2.0,
  8,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1),
  'invoice_processing_time',
  'Invoice Processing Time',
  'Average days to process supplier invoices',
  'time_based',
  'number',
  '{"decimal_places": 1}',
  'lower_is_better',
  'small',
  1.5,
  9,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1),
  'spend_under_management',
  'Spend Under Management',
  'Percentage of total spend managed through procurement',
  'time_based',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  2.5,
  10,
  true
);

-- Insert current single KPI values (June 2025) - Mixed performance scenarios
INSERT INTO cockpit_kpi_values (kpi_id, current_value, recorded_at, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'cost_savings_achieved' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  485000,
  '2025-06-23T10:00:00Z',
  'Slightly below annual target - market pricing pressures'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'supplier_performance_score' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  87.2,
  '2025-06-23T10:00:00Z',
  'Below target - quality issues with key suppliers'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'purchase_order_cycle_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  5.8,
  '2025-06-23T10:00:00Z',
  'Above target - approval process bottlenecks'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'contract_compliance_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  94.5,
  '2025-06-23T10:00:00Z',
  'Below target - off-contract spending in some departments'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'emergency_purchase_ratio' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  8.5,
  '2025-06-23T10:00:00Z',
  'Above target - poor demand planning in operations'
);

-- Insert time-based historical data (18 months: Jan 2024 - Jun 2025)
-- Monthly Procurement Volume (GOOD performance - steady growth, meeting targets)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 3200000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 3150000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 3300000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 3250000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 3400000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 3350000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 3450000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 3500000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 3600000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 3750000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 3900000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 4200000),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 3800000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 3850000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 3900000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 3950000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 4000000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 4050000);

-- Average Purchase Price Variance (BAD performance - above budget)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 2.5),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 3.1),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 3.8),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 4.2),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 4.8),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 5.2),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 5.8),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 6.1),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 5.5),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 5.9),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 6.2),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 6.8),
-- 2025 data - worsening trend
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 7.2),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 7.5),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 7.8),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 8.1),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 8.3),
((SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 8.5);

-- Supplier Lead Time (BAD performance - increasing trend)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 12.5),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 12.8),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 13.2),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 13.8),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 14.2),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 14.8),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 15.2),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 15.8),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 15.5),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 16.1),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 16.5),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 16.8),
-- 2025 data - continued increase
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 17.2),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 17.5),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 17.8),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 18.1),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 18.5),
((SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 18.8);

-- Invoice Processing Time (GOOD performance - improving trend)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 8.5),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 8.2),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 7.8),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 7.5),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 7.2),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 6.8),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 6.5),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 6.2),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 5.8),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 5.5),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 5.2),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 4.8),
-- 2025 data - continued improvement
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 4.5),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 4.2),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 3.8),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 3.5),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 3.2),
((SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 2.8);

-- Spend Under Management (GOOD performance - strong growth, exceeding targets)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 72.5),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 73.2),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 74.1),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 75.2),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 76.5),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 77.8),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 78.5),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 79.2),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 80.1),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 81.5),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 82.8),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 83.5),
-- 2025 data - continued strong growth
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 84.2),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 85.1),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 86.2),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 87.5),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 88.8),
((SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 89.5);

-- Insert KPI targets with time-aligned periods (matching actuals timeframe)
-- Single value targets (no period information needed)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'cost_savings_achieved' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'single',
  500000,
  true,
  'Annual cost savings target through strategic procurement'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'supplier_performance_score' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'single',
  90.0,
  true,
  'Supplier performance excellence target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'purchase_order_cycle_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'single',
  4.0,
  true,
  'Maximum acceptable PO cycle time'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'contract_compliance_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'single',
  98.0,
  true,
  'Contract compliance excellence target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'emergency_purchase_ratio' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'single',
  5.0,
  true,
  'Maximum acceptable emergency purchase ratio'
);

-- Time-based targets with period information aligned to actual data
-- Historical targets (2024)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'time_based',
  3500000,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 monthly procurement volume target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'time_based',
  3.0,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 price variance budget target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'time_based',
  12.0,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 supplier lead time target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'time_based',
  5.0,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 invoice processing efficiency target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'time_based',
  75.0,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 spend management coverage target'
);

-- Current year targets (2025)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_procurement_volume' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'time_based',
  4000000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 monthly procurement volume target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'average_purchase_price_variance' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'time_based',
  4.0,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 price variance budget target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'supplier_lead_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'time_based',
  14.0,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 supplier lead time target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'invoice_processing_time' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'time_based',
  4.0,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 invoice processing efficiency target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'spend_under_management' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'procurement' LIMIT 1)),
  'time_based',
  85.0,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 spend management coverage target'
);
