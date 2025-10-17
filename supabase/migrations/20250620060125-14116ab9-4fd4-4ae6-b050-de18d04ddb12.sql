
-- Step 1: Remove existing finance cockpit KPIs and their values
DELETE FROM cockpit_kpi_values WHERE kpi_id IN (
  SELECT ck.id FROM cockpit_kpis ck 
  JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id 
  WHERE ct.name = 'finance'
);

DELETE FROM cockpit_kpis WHERE cockpit_type_id IN (
  SELECT id FROM cockpit_types WHERE name = 'finance'
);

-- Step 2: Insert new standard financial health KPIs
INSERT INTO cockpit_kpis (
  id, cockpit_type_id, name, display_name, description, 
  kpi_data_type, manual_value, target_value, trend_direction, 
  format_type, format_options, icon, color_class, sort_order, 
  size_config, weight, is_active
) 
SELECT 
  gen_random_uuid(),
  ct.id,
  'gross_profit_margin',
  'Gross Profit Margin',
  'Percentage of revenue remaining after direct costs',
  'manual',
  68.5,
  65.0,
  'higher_is_better',
  'percentage',
  '{}'::jsonb,
  'trending-up',
  'text-green-600',
  1,
  'medium',
  1.5,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'

UNION ALL

SELECT 
  gen_random_uuid(),
  ct.id,
  'net_profit_margin',
  'Net Profit Margin',
  'Percentage of revenue remaining as profit after all expenses',
  'manual',
  18.2,
  20.0,
  'higher_is_better',
  'percentage',
  '{}'::jsonb,
  'dollar-sign',
  'text-blue-600',
  2,
  'medium',
  1.4,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'

UNION ALL

SELECT 
  gen_random_uuid(),
  ct.id,
  'return_on_assets',
  'Return on Assets (ROA)',
  'How efficiently company uses assets to generate profit',
  'manual',
  12.8,
  15.0,
  'higher_is_better',
  'percentage',
  '{}'::jsonb,
  'bar-chart',
  'text-purple-600',
  3,
  'medium',
  1.3,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'

UNION ALL

SELECT 
  gen_random_uuid(),
  ct.id,
  'return_on_equity',
  'Return on Equity (ROE)',
  'Return generated on shareholders equity',
  'manual',
  22.4,
  18.0,
  'higher_is_better',
  'percentage',
  '{}'::jsonb,
  'trending-up',
  'text-green-600',
  4,
  'medium',
  1.2,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'

UNION ALL

SELECT 
  gen_random_uuid(),
  ct.id,
  'current_ratio',
  'Current Ratio',
  'Ability to pay short-term obligations with current assets',
  'manual',
  2.3,
  2.0,
  'higher_is_better',
  'number',
  '{"suffix": ":1"}'::jsonb,
  'shield',
  'text-cyan-600',
  5,
  'medium',
  1.1,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'

UNION ALL

SELECT 
  gen_random_uuid(),
  ct.id,
  'quick_ratio',
  'Quick Ratio',
  'Ability to pay short-term debts with liquid assets',
  'manual',
  1.8,
  1.5,
  'higher_is_better',
  'number',
  '{"suffix": ":1"}'::jsonb,
  'droplets',
  'text-blue-600',
  6,
  'medium',
  1.0,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'

UNION ALL

SELECT 
  gen_random_uuid(),
  ct.id,
  'debt_to_equity',
  'Debt-to-Equity Ratio',
  'Company financial leverage and risk level',
  'manual',
  0.45,
  0.50,
  'lower_is_better',
  'number',
  '{"suffix": ":1"}'::jsonb,
  'scale',
  'text-orange-600',
  7,
  'medium',
  1.2,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'

UNION ALL

SELECT 
  gen_random_uuid(),
  ct.id,
  'interest_coverage',
  'Interest Coverage Ratio',
  'Ability to pay interest on outstanding debt',
  'manual',
  8.5,
  5.0,
  'higher_is_better',
  'number',
  '{"suffix": "x"}'::jsonb,
  'shield-check',
  'text-green-600',
  8,
  'medium',
  1.1,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'

UNION ALL

SELECT 
  gen_random_uuid(),
  ct.id,
  'asset_turnover',
  'Asset Turnover Ratio',
  'Efficiency of using assets to generate sales',
  'manual',
  1.2,
  1.0,
  'higher_is_better',
  'number',
  '{"suffix": "x"}'::jsonb,
  'refresh-cw',
  'text-purple-600',
  9,
  'medium',
  1.0,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'

UNION ALL

SELECT 
  gen_random_uuid(),
  ct.id,
  'inventory_turnover',
  'Inventory Turnover',
  'How efficiently inventory is converted to sales',
  'manual',
  6.8,
  8.0,
  'higher_is_better',
  'number',
  '{"suffix": "x"}'::jsonb,
  'package',
  'text-indigo-600',
  10,
  'medium',
  0.9,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'

UNION ALL

SELECT 
  gen_random_uuid(),
  ct.id,
  'working_capital_ratio',
  'Working Capital Ratio',
  'Short-term financial health and operational efficiency',
  'manual',
  1.35,
  1.25,
  'higher_is_better',
  'number',
  '{"suffix": ":1"}'::jsonb,
  'coins',
  'text-yellow-600',
  11,
  'medium',
  1.0,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'

UNION ALL

SELECT 
  gen_random_uuid(),
  ct.id,
  'revenue_growth',
  'Revenue Growth Rate',
  'Year-over-year revenue growth percentage',
  'manual',
  15.3,
  12.0,
  'higher_is_better',
  'percentage',
  '{}'::jsonb,
  'trending-up',
  'text-green-600',
  12,
  'medium',
  1.3,
  true
FROM cockpit_types ct WHERE ct.name = 'finance';

-- Step 3: Add sample KPI values for the last few periods
INSERT INTO cockpit_kpi_values (
  kpi_id, current_value, previous_value, trend_percentage, 
  period_start, period_end, calculation_metadata
)
-- Gross Profit Margin values
SELECT 
  ck.id,
  68.5,
  65.2,
  5.1,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "monthly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'gross_profit_margin'

UNION ALL

-- Net Profit Margin values
SELECT 
  ck.id,
  18.2,
  17.8,
  2.2,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "monthly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'net_profit_margin'

UNION ALL

-- Return on Assets values
SELECT 
  ck.id,
  12.8,
  11.9,
  7.6,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "quarterly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'return_on_assets'

UNION ALL

-- Return on Equity values
SELECT 
  ck.id,
  22.4,
  20.1,
  11.4,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "quarterly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'return_on_equity'

UNION ALL

-- Current Ratio values
SELECT 
  ck.id,
  2.3,
  2.1,
  9.5,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "monthly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'current_ratio'

UNION ALL

-- Quick Ratio values
SELECT 
  ck.id,
  1.8,
  1.6,
  12.5,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "monthly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'quick_ratio'

UNION ALL

-- Debt-to-Equity values (lower is better, so negative trend is good)
SELECT 
  ck.id,
  0.45,
  0.52,
  -13.5,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "quarterly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'debt_to_equity'

UNION ALL

-- Interest Coverage values
SELECT 
  ck.id,
  8.5,
  7.2,
  18.1,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "quarterly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'interest_coverage'

UNION ALL

-- Asset Turnover values
SELECT 
  ck.id,
  1.2,
  1.1,
  9.1,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "quarterly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'asset_turnover'

UNION ALL

-- Inventory Turnover values
SELECT 
  ck.id,
  6.8,
  6.2,
  9.7,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "quarterly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'inventory_turnover'

UNION ALL

-- Working Capital Ratio values
SELECT 
  ck.id,
  1.35,
  1.28,
  5.5,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "monthly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'working_capital_ratio'

UNION ALL

-- Revenue Growth values
SELECT 
  ck.id,
  15.3,
  12.8,
  19.5,
  '2024-10-01'::timestamp with time zone,
  '2024-10-31'::timestamp with time zone,
  '{"period": "yearly", "data_source": "manual"}'::jsonb
FROM cockpit_kpis ck 
JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id
WHERE ct.name = 'finance' AND ck.name = 'revenue_growth';
