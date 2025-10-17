
-- Phase 1: Clean existing finance cockpit metric data
DELETE FROM metric_time_based_data WHERE time_metric_id IN (
  SELECT mtb.id FROM metric_time_based mtb
  JOIN metric_base mb ON mtb.base_metric_id = mb.id
  JOIN cockpit_sections cs ON mb.section_id = cs.id
  JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id
  WHERE ct.name = 'finance'
);

DELETE FROM metric_multi_value_data WHERE multi_value_metric_id IN (
  SELECT mmv.id FROM metric_multi_value mmv
  JOIN metric_base mb ON mmv.base_metric_id = mb.id
  JOIN cockpit_sections cs ON mb.section_id = cs.id
  JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id
  WHERE ct.name = 'finance'
);

DELETE FROM metric_single_value WHERE base_metric_id IN (
  SELECT mb.id FROM metric_base mb
  JOIN cockpit_sections cs ON mb.section_id = cs.id
  JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id
  WHERE ct.name = 'finance'
);

DELETE FROM metric_time_based WHERE base_metric_id IN (
  SELECT mb.id FROM metric_base mb
  JOIN cockpit_sections cs ON mb.section_id = cs.id
  JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id
  WHERE ct.name = 'finance'
);

DELETE FROM metric_multi_value WHERE base_metric_id IN (
  SELECT mb.id FROM metric_base mb
  JOIN cockpit_sections cs ON mb.section_id = cs.id
  JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id
  WHERE ct.name = 'finance'
);

DELETE FROM metric_base WHERE section_id IN (
  SELECT cs.id FROM cockpit_sections cs
  JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id
  WHERE ct.name = 'finance'
);

-- Phase 2: Create enhanced metric set with comprehensive financial story

-- Get section IDs for finance cockpit
WITH finance_sections AS (
  SELECT 
    cs.id,
    cs.name as section_name
  FROM cockpit_sections cs
  JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id
  WHERE ct.name = 'finance'
),

-- Insert base metrics for each section
base_metrics_insert AS (
  INSERT INTO metric_base (id, section_id, name, display_name, description, sort_order, size_config, is_active) 
  
  -- Revenue Analysis Section Metrics
  SELECT 
    gen_random_uuid(),
    fs.id,
    'revenue_growth_trend',
    'Revenue Growth Trend',
    'Year-over-year revenue growth showing market pressures',
    1,
    'large',
    true
  FROM finance_sections fs WHERE fs.section_name = 'revenue'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'revenue_by_product',
    'Revenue by Product Line',
    'Product performance comparison with mixed results',
    2,
    'medium',
    true
  FROM finance_sections fs WHERE fs.section_name = 'revenue'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'monthly_recurring_revenue',
    'Monthly Recurring Revenue',
    'Steady MRR growth despite market challenges',
    3,
    'large',
    true
  FROM finance_sections fs WHERE fs.section_name = 'revenue'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'revenue_per_customer',
    'Revenue per Customer',
    'Concerning decline in customer value',
    4,
    'medium',
    true
  FROM finance_sections fs WHERE fs.section_name = 'revenue'
  
  -- Expense Management Section Metrics
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'operating_expenses_breakdown',
    'Operating Expenses Breakdown',
    'Cost allocation across departments',
    1,
    'large',
    true
  FROM finance_sections fs WHERE fs.section_name = 'expenses'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'cogs_trend',
    'Cost of Goods Sold Trend',
    'Rising production costs impacting margins',
    2,
    'medium',
    true
  FROM finance_sections fs WHERE fs.section_name = 'expenses'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'employee_cost_ratio',
    'Employee Costs vs Revenue',
    'Personnel expenses as percentage of revenue',
    3,
    'large',
    true
  FROM finance_sections fs WHERE fs.section_name = 'expenses'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'marketing_roi',
    'Marketing ROI by Channel',
    'Return on investment across marketing channels',
    4,
    'medium',
    true
  FROM finance_sections fs WHERE fs.section_name = 'expenses'
  
  -- Profitability Section Metrics
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'monthly_pnl_waterfall',
    'Monthly P&L Waterfall',
    'Profit and loss breakdown showing volatility',
    1,
    'xl',
    true
  FROM finance_sections fs WHERE fs.section_name = 'profitability'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'cash_flow_components',
    'Cash Flow Components',
    'Operating, investing, and financing cash flows',
    2,
    'large',
    true
  FROM finance_sections fs WHERE fs.section_name = 'profitability'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'working_capital_trend',
    'Working Capital Trend',
    'Liquidity position tightening over time',
    3,
    'medium',
    true
  FROM finance_sections fs WHERE fs.section_name = 'profitability'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'ar_aging',
    'Accounts Receivable Aging',
    'Customer payment patterns showing delays',
    4,
    'large',
    true
  FROM finance_sections fs WHERE fs.section_name = 'profitability'
  
  -- Cash Flow Section Metrics  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'burn_rate_analysis',
    'Monthly Burn Rate',
    'Cash consumption rate accelerating',
    1,
    'large',
    true
  FROM finance_sections fs WHERE fs.section_name = 'cashflow'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'debt_coverage_ratio',
    'Debt Service Coverage',
    'Ability to service debt obligations',
    2,
    'medium',
    true
  FROM finance_sections fs WHERE fs.section_name = 'cashflow'
  
  UNION ALL
  
  SELECT 
    gen_random_uuid(),
    fs.id,
    'quick_ratio_trend',
    'Quick Ratio Trend',
    'Liquidity excluding inventory declining',
    3,
    'medium',
    true
  FROM finance_sections fs WHERE fs.section_name = 'cashflow'
  
  RETURNING id, name
)

-- Insert metric configurations based on type
SELECT 1; -- Placeholder to make this a valid SELECT

-- Insert single value metrics
INSERT INTO metric_single_value (base_metric_id, metric_type, actual_value, target_value, trend)
SELECT 
  mb.id,
  'percentage',
  1.85,
  2.00,
  'down'
FROM metric_base mb
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND mb.name = 'debt_coverage_ratio';

-- Insert time-based metrics
INSERT INTO metric_time_based (base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
SELECT 
  mb.id,
  CASE mb.name
    WHEN 'revenue_growth_trend' THEN 'line'
    WHEN 'monthly_recurring_revenue' THEN 'area'
    WHEN 'revenue_per_customer' THEN 'line'
    WHEN 'cogs_trend' THEN 'line'
    WHEN 'employee_cost_ratio' THEN 'line'
    WHEN 'cash_flow_components' THEN 'stacked_area'
    WHEN 'working_capital_trend' THEN 'line'
    WHEN 'burn_rate_analysis' THEN 'area'
    WHEN 'quick_ratio_trend' THEN 'line'
  END,
  'month',
  CASE mb.name
    WHEN 'revenue_growth_trend' THEN 'Growth %'
    WHEN 'monthly_recurring_revenue' THEN 'MRR ($K)'
    WHEN 'revenue_per_customer' THEN 'Revenue ($)'
    WHEN 'cogs_trend' THEN 'COGS %'
    WHEN 'employee_cost_ratio' THEN 'Employee Cost %'
    WHEN 'cash_flow_components' THEN 'Cash Flow ($K)'
    WHEN 'working_capital_trend' THEN 'Working Capital ($K)'
    WHEN 'burn_rate_analysis' THEN 'Burn Rate ($K)'
    WHEN 'quick_ratio_trend' THEN 'Quick Ratio'
  END,
  CASE mb.name
    WHEN 'cash_flow_components' THEN true
    WHEN 'employee_cost_ratio' THEN true
    ELSE false
  END
FROM metric_base mb
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND mb.name IN (
  'revenue_growth_trend', 'monthly_recurring_revenue', 'revenue_per_customer',
  'cogs_trend', 'employee_cost_ratio', 'cash_flow_components', 
  'working_capital_trend', 'burn_rate_analysis', 'quick_ratio_trend'
);

-- Insert multi-value metrics
INSERT INTO metric_multi_value (base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
SELECT 
  mb.id,
  CASE mb.name
    WHEN 'revenue_by_product' THEN 'horizontal_bar'
    WHEN 'operating_expenses_breakdown' THEN 'pie'
    WHEN 'marketing_roi' THEN 'bar'
    WHEN 'monthly_pnl_waterfall' THEN 'bar'
    WHEN 'ar_aging' THEN 'stacked_bar'
  END,
  CASE mb.name
    WHEN 'revenue_by_product' THEN 'Product Line'
    WHEN 'operating_expenses_breakdown' THEN 'Category'
    WHEN 'marketing_roi' THEN 'Channel'
    WHEN 'monthly_pnl_waterfall' THEN 'Month'
    WHEN 'ar_aging' THEN 'Age Bucket'
  END,
  CASE mb.name
    WHEN 'revenue_by_product' THEN 'Revenue ($K)'
    WHEN 'operating_expenses_breakdown' THEN 'Amount ($K)'
    WHEN 'marketing_roi' THEN 'ROI %'
    WHEN 'monthly_pnl_waterfall' THEN 'P&L ($K)'
    WHEN 'ar_aging' THEN 'Amount ($K)'
  END,
  CASE mb.name
    WHEN 'ar_aging' THEN true
    ELSE false
  END
FROM metric_base mb
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND mb.name IN (
  'revenue_by_product', 'operating_expenses_breakdown', 'marketing_roi',
  'monthly_pnl_waterfall', 'ar_aging'
);

-- Phase 3: Populate with 24 months of realistic data

-- Revenue Growth Trend (declining from 25% to 5%)
INSERT INTO metric_time_based_data (time_metric_id, year, month, value, series_name, series_color)
SELECT 
  mtb.id,
  2023,
  month_num,
  CASE month_num
    WHEN 1 THEN 25.2
    WHEN 2 THEN 24.8
    WHEN 3 THEN 26.1
    WHEN 4 THEN 23.9
    WHEN 5 THEN 24.5
    WHEN 6 THEN 22.8
    WHEN 7 THEN 21.3
    WHEN 8 THEN 20.9
    WHEN 9 THEN 19.5
    WHEN 10 THEN 18.2
    WHEN 11 THEN 17.8
    WHEN 12 THEN 16.4
  END,
  'Growth Rate',
  '#10B981'
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(1, 12) as month_num
WHERE ct.name = 'finance' AND mb.name = 'revenue_growth_trend'

UNION ALL

SELECT 
  mtb.id,
  2024,
  month_num,
  CASE month_num
    WHEN 1 THEN 15.1
    WHEN 2 THEN 14.2
    WHEN 3 THEN 13.8
    WHEN 4 THEN 12.9
    WHEN 5 THEN 11.5
    WHEN 6 THEN 10.8
    WHEN 7 THEN 9.3
    WHEN 8 THEN 8.7
    WHEN 9 THEN 7.2
    WHEN 10 THEN 6.8
    WHEN 11 THEN 5.9
    WHEN 12 THEN 5.2
  END,
  'Growth Rate',
  '#10B981'
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(1, 12) as month_num
WHERE ct.name = 'finance' AND mb.name = 'revenue_growth_trend';

-- Monthly Recurring Revenue (steady growth)
INSERT INTO metric_time_based_data (time_metric_id, year, month, value, series_name, series_color)
SELECT 
  mtb.id,
  2023,
  month_num,
  450 + (month_num * 12) + (RANDOM() * 8 - 4),
  'MRR',
  '#3B82F6'
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(1, 12) as month_num
WHERE ct.name = 'finance' AND mb.name = 'monthly_recurring_revenue'

UNION ALL

SELECT 
  mtb.id,
  2024,
  month_num,
  594 + (month_num * 8) + (RANDOM() * 6 - 3),
  'MRR',
  '#3B82F6'
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(1, 12) as month_num
WHERE ct.name = 'finance' AND mb.name = 'monthly_recurring_revenue';

-- Revenue per Customer (declining)
INSERT INTO metric_time_based_data (time_metric_id, year, month, value, series_name, series_color)
SELECT 
  mtb.id,
  2023,
  month_num,
  2850 - (month_num * 15) + (RANDOM() * 50 - 25),
  'Revenue per Customer',
  '#F59E0B'
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(1, 12) as month_num
WHERE ct.name = 'finance' AND mb.name = 'revenue_per_customer'

UNION ALL

SELECT 
  mtb.id,
  2024,
  month_num,
  2670 - (month_num * 25) + (RANDOM() * 40 - 20),
  'Revenue per Customer',
  '#F59E0B'
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(1, 12) as month_num
WHERE ct.name = 'finance' AND mb.name = 'revenue_per_customer';

-- COGS Trend (increasing)
INSERT INTO metric_time_based_data (time_metric_id, year, month, value, series_name, series_color)
SELECT 
  mtb.id,
  2023,
  month_num,
  32.5 + (month_num * 0.8) + (RANDOM() * 2 - 1),
  'COGS %',
  '#EF4444'
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(1, 12) as month_num
WHERE ct.name = 'finance' AND mb.name = 'cogs_trend'

UNION ALL

SELECT 
  mtb.id,
  2024,
  month_num,
  42.1 + (month_num * 1.2) + (RANDOM() * 1.5 - 0.75),
  'COGS %',
  '#EF4444'
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(1, 12) as month_num
WHERE ct.name = 'finance' AND mb.name = 'cogs_trend';

-- Employee Cost Ratio (dual series)
INSERT INTO metric_time_based_data (time_metric_id, year, month, value, series_name, series_color)
SELECT 
  mtb.id,
  year_val,
  month_num,
  CASE 
    WHEN series_name = 'Employee Costs %' THEN 
      28.5 + ((year_val - 2023) * 12 + month_num) * 0.3 + (RANDOM() * 2 - 1)
    WHEN series_name = 'Revenue Growth %' THEN
      25.2 - ((year_val - 2023) * 12 + month_num) * 0.8 + (RANDOM() * 3 - 1.5)
  END,
  series_name,
  CASE series_name
    WHEN 'Employee Costs %' THEN '#8B5CF6'
    WHEN 'Revenue Growth %' THEN '#10B981'
  END
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(2023, 2024) as year_val,
generate_series(1, 12) as month_num,
(VALUES ('Employee Costs %'), ('Revenue Growth %')) as series(series_name)
WHERE ct.name = 'finance' AND mb.name = 'employee_cost_ratio';

-- Cash Flow Components (multi-series stacked area)
INSERT INTO metric_time_based_data (time_metric_id, year, month, value, series_name, series_color)
SELECT 
  mtb.id,
  year_val,
  month_num,
  CASE 
    WHEN series_name = 'Operating' THEN 
      185 - ((year_val - 2023) * 12 + month_num) * 2.5 + (RANDOM() * 20 - 10)
    WHEN series_name = 'Investing' THEN
      -35 - ((year_val - 2023) * 12 + month_num) * 1.2 + (RANDOM() * 8 - 4)
    WHEN series_name = 'Financing' THEN
      -25 + (RANDOM() * 30 - 15)
  END,
  series_name,
  CASE series_name
    WHEN 'Operating' THEN '#10B981'
    WHEN 'Investing' THEN '#F59E0B'
    WHEN 'Financing' THEN '#EF4444'
  END
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(2023, 2024) as year_val,
generate_series(1, 12) as month_num,
(VALUES ('Operating'), ('Investing'), ('Financing')) as series(series_name)
WHERE ct.name = 'finance' AND mb.name = 'cash_flow_components';

-- Working Capital Trend (declining)
INSERT INTO metric_time_based_data (time_metric_id, year, month, value, series_name, series_color)
SELECT 
  mtb.id,
  year_val,
  month_num,
  850 - ((year_val - 2023) * 12 + month_num) * 8 + (RANDOM() * 25 - 12.5),
  'Working Capital',
  '#06B6D4'
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(2023, 2024) as year_val,
generate_series(1, 12) as month_num
WHERE ct.name = 'finance' AND mb.name = 'working_capital_trend';

-- Burn Rate Analysis (increasing)
INSERT INTO metric_time_based_data (time_metric_id, year, month, value, series_name, series_color)
SELECT 
  mtb.id,
  year_val,
  month_num,
  125 + ((year_val - 2023) * 12 + month_num) * 3.2 + (RANDOM() * 15 - 7.5),
  'Monthly Burn',
  '#DC2626'
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(2023, 2024) as year_val,
generate_series(1, 12) as month_num
WHERE ct.name = 'finance' AND mb.name = 'burn_rate_analysis';

-- Quick Ratio Trend (declining liquidity)
INSERT INTO metric_time_based_data (time_metric_id, year, month, value, series_name, series_color)
SELECT 
  mtb.id,
  year_val,
  month_num,
  2.1 - ((year_val - 2023) * 12 + month_num) * 0.03 + (RANDOM() * 0.1 - 0.05),
  'Quick Ratio',
  '#8B5CF6'
FROM metric_time_based mtb
JOIN metric_base mb ON mtb.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
generate_series(2023, 2024) as year_val,
generate_series(1, 12) as month_num
WHERE ct.name = 'finance' AND mb.name = 'quick_ratio_trend';

-- Multi-value data: Revenue by Product Line
INSERT INTO metric_multi_value_data (multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order)
SELECT 
  mmv.id,
  product_name,
  revenue_value,
  'Q4 2024',
  color_val,
  sort_val
FROM metric_multi_value mmv
JOIN metric_base mb ON mmv.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
(VALUES 
  ('Enterprise Suite', 1250, '#10B981', 1),
  ('Professional Plan', 890, '#3B82F6', 2),
  ('Basic Package', 650, '#F59E0B', 3),
  ('Add-on Services', 320, '#8B5CF6', 4),
  ('Consulting', 180, '#EF4444', 5)
) as products(product_name, revenue_value, color_val, sort_val)
WHERE ct.name = 'finance' AND mb.name = 'revenue_by_product';

-- Operating Expenses Breakdown (pie chart)
INSERT INTO metric_multi_value_data (multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order)
SELECT 
  mmv.id,
  expense_category,
  expense_amount,
  'Current Month',
  color_val,
  sort_val
FROM metric_multi_value mmv
JOIN metric_base mb ON mmv.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
(VALUES 
  ('Personnel', 485, '#FF6B6B', 1),
  ('Technology', 125, '#4ECDC4', 2),
  ('Marketing', 95, '#45B7D1', 3),
  ('Facilities', 68, '#96CEB4', 4),
  ('Operations', 52, '#FECA57', 5),
  ('Legal & Compliance', 28, '#FF9FF3', 6),
  ('Other', 35, '#54A0FF', 7)
) as expenses(expense_category, expense_amount, color_val, sort_val)
WHERE ct.name = 'finance' AND mb.name = 'operating_expenses_breakdown';

-- Marketing ROI by Channel
INSERT INTO metric_multi_value_data (multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order)
SELECT 
  mmv.id,
  channel_name,
  roi_percentage,
  'Last Quarter',
  color_val,
  sort_val
FROM metric_multi_value mmv
JOIN metric_base mb ON mmv.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
(VALUES 
  ('Email Marketing', 340, '#10B981', 1),
  ('Content Marketing', 285, '#3B82F6', 2),
  ('Paid Search', 195, '#F59E0B', 3),
  ('Social Media', 125, '#8B5CF6', 4),
  ('Display Ads', 85, '#EF4444', 5),
  ('Events', 65, '#06B6D4', 6)
) as channels(channel_name, roi_percentage, color_val, sort_val)
WHERE ct.name = 'finance' AND mb.name = 'marketing_roi';

-- Monthly P&L Waterfall (last 6 months)
INSERT INTO metric_multi_value_data (multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order)
SELECT 
  mmv.id,
  month_name,
  pnl_value,
  'Net Income',
  color_val,
  sort_val
FROM metric_multi_value mmv
JOIN metric_base mb ON mmv.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
(VALUES 
  ('Jul 2024', 125, '#10B981', 1),
  ('Aug 2024', 98, '#10B981', 2),
  ('Sep 2024', 76, '#F59E0B', 3),
  ('Oct 2024', 45, '#F59E0B', 4),
  ('Nov 2024', 23, '#EF4444', 5),
  ('Dec 2024', -12, '#EF4444', 6)
) as months(month_name, pnl_value, color_val, sort_val)
WHERE ct.name = 'finance' AND mb.name = 'monthly_pnl_waterfall';

-- AR Aging (stacked bar chart)
INSERT INTO metric_multi_value_data (multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order)
SELECT 
  mmv.id,
  age_bucket,
  amount_val,
  series_name,
  color_val,
  sort_val
FROM metric_multi_value mmv
JOIN metric_base mb ON mmv.base_metric_id = mb.id
JOIN cockpit_sections cs ON mb.section_id = cs.id
JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id,
(VALUES 
  ('0-30 Days', 325, 'Current', '#10B981', 1),
  ('31-60 Days', 185, '31-60', '#F59E0B', 2),
  ('61-90 Days', 95, '61-90', '#EF4444', 3),
  ('90+ Days', 65, '90+', '#DC2626', 4)
) as aging(age_bucket, amount_val, series_name, color_val, sort_val)
WHERE ct.name = 'finance' AND mb.name = 'ar_aging';
