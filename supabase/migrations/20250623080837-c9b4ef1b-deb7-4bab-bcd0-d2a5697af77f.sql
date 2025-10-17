
-- First, let's clean up any existing finance KPI data to start fresh
DELETE FROM cockpit_kpi_targets WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_time_based WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_values WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1
  )
);

DELETE FROM cockpit_kpis WHERE cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1
);

-- Insert Finance KPIs into cockpit_kpis table
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
  (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1),
  'monthly_revenue',
  'Monthly Revenue',
  'Total monthly revenue across all business units',
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
  (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1),
  'gross_profit_margin',
  'Gross Profit Margin',
  'Gross profit as percentage of total revenue',
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
  (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1),
  'operating_cash_flow',
  'Operating Cash Flow',
  'Cash generated from core business operations',
  'single',
  'currency',
  '{"decimal_places": 0, "currency_code": "USD"}',
  'higher_is_better',
  'large',
  2.5,
  3,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1),
  'accounts_receivable_days',
  'Accounts Receivable Days',
  'Average number of days to collect receivables',
  'single',
  'number',
  '{"decimal_places": 0}',
  'lower_is_better',
  'small',
  2.0,
  4,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1),
  'debt_to_equity_ratio',
  'Debt-to-Equity Ratio',
  'Total debt divided by total equity',
  'single',
  'number',
  '{"decimal_places": 2}',
  'lower_is_better',
  'small',
  2.0,
  5,
  true
),
-- Time-Based KPIs
(
  (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1),
  'monthly_revenue_growth',
  'Monthly Revenue Growth',
  'Month-over-month revenue growth tracking',
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
  (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1),
  'operating_expenses',
  'Operating Expenses',
  'Monthly operating expenses tracking',
  'time_based',
  'currency',
  '{"decimal_places": 0, "currency_code": "USD"}',
  'lower_is_better',
  'medium',
  2.5,
  7,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1),
  'net_profit_margin',
  'Net Profit Margin',
  'Net profit as percentage of revenue over time',
  'time_based',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'medium',
  2.5,
  8,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1),
  'working_capital',
  'Working Capital',
  'Current assets minus current liabilities',
  'time_based',
  'currency',
  '{"decimal_places": 0, "currency_code": "USD"}',
  'higher_is_better',
  'medium',
  2.0,
  9,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1),
  'ebitda',
  'EBITDA',
  'Earnings before interest, taxes, depreciation, and amortization',
  'time_based',
  'currency',
  '{"decimal_places": 0, "currency_code": "USD"}',
  'higher_is_better',
  'large',
  3.0,
  10,
  true
);

-- Insert current single KPI values (June 2025) - Mixed performance scenarios
INSERT INTO cockpit_kpi_values (kpi_id, current_value, recorded_at, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  2450000,
  '2025-06-23T10:00:00Z',
  'Slightly below target - market competition'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'gross_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  42.5,
  '2025-06-23T10:00:00Z',
  'Below target - rising cost of goods sold'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'operating_cash_flow' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  385000,
  '2025-06-23T10:00:00Z',
  'Slightly below target - timing of collections'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'accounts_receivable_days' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  38,
  '2025-06-23T10:00:00Z',
  'Above target - collection process needs improvement'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'debt_to_equity_ratio' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  0.65,
  '2025-06-23T10:00:00Z',
  'Above target - high debt levels concern'
);

-- Insert time-based historical data (18 months: Jan 2024 - Jun 2025)
-- Monthly Revenue Growth (GOOD performance - strong upward trend)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 1950000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 1980000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 2020000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 2050000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 2100000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 2150000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 2180000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 2220000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 2250000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 2300000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 2350000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 2400000),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 2380000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 2420000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 2450000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 2480000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 2460000),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 2450000);

-- Operating Expenses (BAD performance - trending above budget)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 1420000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 1450000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 1480000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 1520000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 1550000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 1580000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 1600000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 1630000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 1650000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 1680000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 1720000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 1750000),
-- 2025 data - worsening trend
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 1780000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 1800000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 1820000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 1840000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 1860000),
((SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 1875000);

-- Net Profit Margin (BAD performance - declining trend)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 18.5),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 17.8),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 17.2),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 16.8),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 16.5),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 16.2),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 15.8),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 15.5),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 15.2),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 14.8),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 14.5),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 14.2),
-- 2025 data - continued decline
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 13.8),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 13.5),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 13.2),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 12.8),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 12.5),
((SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 12.2);

-- Working Capital (GOOD performance - stable and meeting targets)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 850000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 870000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 890000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 910000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 925000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 940000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 955000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 970000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 985000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 1000000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 1015000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 1030000),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 1045000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 1060000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 1075000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 1090000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 1105000),
((SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 1120000);

-- EBITDA (GOOD performance - strong growth, exceeding targets)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 420000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 435000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 450000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 465000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 485000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 505000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 520000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 535000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 550000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 580000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 610000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 635000),
-- 2025 data
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 650000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 665000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 680000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 695000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 710000),
((SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 725000);

-- Insert KPI targets with time-aligned periods (matching actuals timeframe)
-- Single value targets (no period information needed)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'single',
  2500000,
  true,
  'Monthly revenue target for sustainable growth'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'gross_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'single',
  45.0,
  true,
  'Gross profit margin target for healthy profitability'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'operating_cash_flow' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'single',
  400000,
  true,
  'Operating cash flow target for liquidity'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'accounts_receivable_days' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'single',
  30,
  true,
  'Maximum acceptable days to collect receivables'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'debt_to_equity_ratio' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'single',
  0.50,
  true,
  'Maximum acceptable debt-to-equity ratio'
);

-- Time-based targets with period information aligned to actual data
-- Historical targets (2024)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'time_based',
  2000000,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 monthly revenue target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'time_based',
  1500000,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 operating expenses budget'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'time_based',
  18.0,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 net profit margin target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'time_based',
  900000,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 working capital target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'time_based',
  500000,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 EBITDA target'
);

-- Current year targets (2025)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_revenue_growth' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'time_based',
  2500000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 monthly revenue target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'operating_expenses' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'time_based',
  1750000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 operating expenses budget'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'net_profit_margin' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'time_based',
  15.0,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 net profit margin target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'working_capital' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'time_based',
  1050000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 working capital target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'ebitda' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'finance' LIMIT 1)),
  'time_based',
  650000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 EBITDA target'
);
