
-- First, let's clean up and update the existing finance cockpit data
-- Update the existing finance cockpit type with better description
UPDATE cockpit_types 
SET 
  description = 'Financial performance and operational metrics',
  cockpit_description = 'The Finance Cockpit provides real-time visibility into financial performance, cash flow management, profitability analysis, and key financial indicators. Monitor revenue streams, expense management, budget variance, and financial health metrics for informed decision-making.',
  icon = 'dollar-sign',
  color_class = 'bg-green-500',
  sort_order = 2
WHERE name = 'finance';

-- Get the finance cockpit type ID for reference
-- We'll use this to update sections, metrics, etc.

-- Delete existing finance sections to replace with new comprehensive ones
DELETE FROM cockpit_metric_data WHERE metric_id IN (
  SELECT cm.id FROM cockpit_metrics cm 
  JOIN cockpit_sections cs ON cm.section_id = cs.id 
  JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id 
  WHERE ct.name = 'finance'
);

DELETE FROM cockpit_kpi_values WHERE kpi_id IN (
  SELECT ck.id FROM cockpit_kpis ck 
  JOIN cockpit_types ct ON ck.cockpit_type_id = ct.id 
  WHERE ct.name = 'finance'
);

DELETE FROM cockpit_kpis WHERE cockpit_type_id IN (
  SELECT id FROM cockpit_types WHERE name = 'finance'
);

DELETE FROM cockpit_metrics WHERE section_id IN (
  SELECT cs.id FROM cockpit_sections cs 
  JOIN cockpit_types ct ON cs.cockpit_type_id = ct.id 
  WHERE ct.name = 'finance'
);

DELETE FROM cockpit_insights WHERE cockpit_type_id IN (
  SELECT id FROM cockpit_types WHERE name = 'finance'
);

DELETE FROM cockpit_sections WHERE cockpit_type_id IN (
  SELECT id FROM cockpit_types WHERE name = 'finance'
);

-- Now create the new comprehensive finance sections
INSERT INTO cockpit_sections (id, cockpit_type_id, name, display_name, description, sort_order, is_active) 
SELECT 
  '650e8400-e29b-41d4-a716-446655440001',
  ct.id,
  'revenue',
  'Revenue & Growth',
  'Revenue performance and growth metrics',
  1,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '650e8400-e29b-41d4-a716-446655440002',
  ct.id,
  'profitability',
  'Profitability Analysis',
  'Profit margins and profitability indicators',
  2,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '650e8400-e29b-41d4-a716-446655440003',
  ct.id,
  'cashflow',
  'Cash Flow Management',
  'Cash flow and liquidity tracking',
  3,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '650e8400-e29b-41d4-a716-446655440004',
  ct.id,
  'expenses',
  'Cost Management',
  'Expense tracking and cost optimization',
  4,
  true
FROM cockpit_types ct WHERE ct.name = 'finance';

-- Create comprehensive metrics for Finance Cockpit
INSERT INTO cockpit_metrics (id, section_id, name, display_name, description, metric_type, current_value, target_value, trend, icon, color_class, sort_order, size_config, chart_data, additional_data, is_active) VALUES
-- Revenue Section Metrics
('760e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'total_revenue', 'Total Revenue (YTD)', 'Year-to-date total revenue across all streams', 'currency', '2847650', '3200000', 'up', 'trending-up', 'text-green-600', 1, 'medium', '[{"name": "Revenue", "color": "#10B981", "data": [{"name": "Q1", "value": 650000, "timestamp": "2024-01-01"}, {"name": "Q2", "value": 720000, "timestamp": "2024-04-01"}, {"name": "Q3", "value": 890000, "timestamp": "2024-07-01"}, {"name": "Q4", "value": 587650, "timestamp": "2024-10-01"}]}]', '{"dataType": "multiple", "chartType": "area"}', true),

('760e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'monthly_revenue', 'Monthly Revenue Trend', 'Monthly revenue performance tracking', 'chart', null, null, 'up', 'bar-chart', 'text-blue-600', 2, 'large', '[{"name": "Revenue", "color": "#3B82F6", "data": [{"name": "Jan", "value": 215000}, {"name": "Feb", "value": 218000}, {"name": "Mar", "value": 217000}, {"name": "Apr", "value": 235000}, {"name": "May", "value": 242000}, {"name": "Jun", "value": 243000}, {"name": "Jul", "value": 295000}, {"name": "Aug", "value": 298000}, {"name": "Sep", "value": 297000}, {"name": "Oct", "value": 187650}]}, {"name": "Target", "color": "#EF4444", "data": [{"name": "Jan", "value": 220000}, {"name": "Feb", "value": 220000}, {"name": "Mar", "value": 220000}, {"name": "Apr", "value": 240000}, {"name": "May", "value": 240000}, {"name": "Jun", "value": 240000}, {"name": "Jul", "value": 280000}, {"name": "Aug", "value": 280000}, {"name": "Sep", "value": 280000}, {"name": "Oct", "value": 280000}]}]', '{"dataType": "multiple", "chartType": "line"}', true),

('760e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'revenue_growth', 'Revenue Growth Rate', 'Year-over-year revenue growth percentage', 'percentage', '12.3', '10.0', 'up', 'trending-up', 'text-green-600', 3, 'medium', '[{"name": "Growth Rate", "color": "#10B981", "data": [{"name": "Q1 2023", "value": 8.5}, {"name": "Q2 2023", "value": 9.2}, {"name": "Q3 2023", "value": 10.1}, {"name": "Q4 2023", "value": 11.8}, {"name": "Q1 2024", "value": 12.3}]}]', '{"dataType": "multiple", "chartType": "line"}', true),

-- Profitability Section Metrics
('760e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', 'gross_profit_margin', 'Gross Profit Margin', 'Gross profit as percentage of revenue', 'percentage', '68.4', '65.0', 'up', 'percent', 'text-green-600', 1, 'medium', '[{"name": "Gross Margin", "color": "#10B981", "data": [{"name": "Jan", "value": 66.2}, {"name": "Feb", "value": 67.1}, {"name": "Mar", "value": 67.8}, {"name": "Apr", "value": 68.1}, {"name": "May", "value": 68.4}]}]', '{"dataType": "multiple", "chartType": "area"}', true),

('760e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002', 'net_profit_margin', 'Net Profit Margin', 'Net profit as percentage of revenue', 'percentage', '18.7', '20.0', 'down', 'trending-down', 'text-orange-600', 2, 'medium', '[{"name": "Net Margin", "color": "#F59E0B", "data": [{"name": "Jan", "value": 19.2}, {"name": "Feb", "value": 19.1}, {"name": "Mar", "value": 18.9}, {"name": "Apr", "value": 18.8}, {"name": "May", "value": 18.7}]}]', '{"dataType": "multiple", "chartType": "line"}', true),

('760e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440002', 'ebitda', 'EBITDA', 'Earnings before interest, taxes, depreciation, and amortization', 'currency', '534230', '640000', 'up', 'dollar-sign', 'text-blue-600', 3, 'large', '[{"name": "EBITDA", "color": "#3B82F6", "data": [{"name": "Q1", "value": 125000}, {"name": "Q2", "value": 142000}, {"name": "Q3", "value": 168000}, {"name": "Q4", "value": 99230}]}, {"name": "Target", "color": "#EF4444", "data": [{"name": "Q1", "value": 140000}, {"name": "Q2", "value": 150000}, {"name": "Q3", "value": 170000}, {"name": "Q4", "value": 180000}]}]', '{"dataType": "multiple", "chartType": "bar"}', true),

-- Cash Flow Section Metrics
('760e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440003', 'operating_cash_flow', 'Operating Cash Flow', 'Cash generated from core business operations', 'currency', '412890', '450000', 'up', 'banknote', 'text-green-600', 1, 'medium', '[{"name": "Cash Flow", "color": "#10B981", "data": [{"name": "Jan", "value": 85000}, {"name": "Feb", "value": 92000}, {"name": "Mar", "value": 88000}, {"name": "Apr", "value": 95000}, {"name": "May", "value": 52890}]}]', '{"dataType": "multiple", "chartType": "area"}', true),

('760e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440003', 'current_ratio', 'Current Ratio', 'Current assets divided by current liabilities', 'number', '2.34', '2.10', 'up', 'scale', 'text-blue-600', 2, 'medium', '[{"name": "Current Ratio", "color": "#3B82F6", "data": [{"name": "Q1", "value": 2.1}, {"name": "Q2", "value": 2.2}, {"name": "Q3", "value": 2.3}, {"name": "Q4", "value": 2.34}]}]', '{"dataType": "multiple", "chartType": "line"}', true),

('760e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440003', 'cash_conversion_cycle', 'Cash Conversion Cycle', 'Days to convert investments into cash flows', 'number', '42', '45', 'down', 'clock', 'text-green-600', 3, 'large', '[{"name": "Days", "color": "#10B981", "data": [{"name": "Q1", "value": 48}, {"name": "Q2", "value": 46}, {"name": "Q3", "value": 44}, {"name": "Q4", "value": 42}]}, {"name": "Industry Avg", "color": "#6B7280", "data": [{"name": "Q1", "value": 52}, {"name": "Q2", "value": 52}, {"name": "Q3", "value": 51}, {"name": "Q4", "value": 50}]}]', '{"dataType": "multiple", "chartType": "line"}', true),

-- Expenses Section Metrics
('760e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440004', 'total_expenses', 'Total Operating Expenses', 'Total monthly operating expenses', 'currency', '194300', '220000', 'down', 'minus-circle', 'text-green-600', 1, 'medium', '[{"name": "Expenses", "color": "#EF4444", "data": [{"name": "Jan", "value": 180000}, {"name": "Feb", "value": 185000}, {"name": "Mar", "value": 190000}, {"name": "Apr", "value": 195000}, {"name": "May", "value": 194300}]}]', '{"dataType": "multiple", "chartType": "area"}', true),

('760e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440004', 'expense_breakdown', 'Expense Categories', 'Breakdown of expenses by category', 'chart', null, null, 'neutral', 'pie-chart', 'text-purple-600', 2, 'large', '[{"name": "Personnel", "color": "#8B5CF6", "data": [{"name": "Personnel", "value": 64.8}]}, {"name": "Technology", "color": "#3B82F6", "data": [{"name": "Technology", "value": 4.2}]}, {"name": "Facilities", "color": "#10B981", "data": [{"name": "Facilities", "value": 8.7}]}, {"name": "Marketing", "color": "#F59E0B", "data": [{"name": "Marketing", "value": 12.1}]}, {"name": "Other", "color": "#6B7280", "data": [{"name": "Other", "value": 10.2}]}]', '{"dataType": "multiple", "chartType": "pie"}', true),

('760e8400-e29b-41d4-a716-446655440012', '650e8400-e29b-41d4-a716-446655440004', 'budget_variance', 'Budget Variance', 'Actual vs budgeted expenses variance', 'percentage', '-4.2', '0.0', 'up', 'target', 'text-green-600', 3, 'medium', '[{"name": "Variance", "color": "#10B981", "data": [{"name": "Jan", "value": -2.1}, {"name": "Feb", "value": -2.8}, {"name": "Mar", "value": -3.5}, {"name": "Apr", "value": -3.9}, {"name": "May", "value": -4.2}]}]', '{"dataType": "multiple", "chartType": "bar"}', true);

-- Create KPIs for Finance Cockpit
INSERT INTO cockpit_kpis (id, cockpit_type_id, name, display_name, description, calculation_type, source_metrics, target_value, trend_direction, format_type, format_options, icon, color_class, sort_order, size_config, weight, is_active) 
SELECT 
  '870e8400-e29b-41d4-a716-446655440001',
  ct.id,
  'revenue_performance',
  'Revenue Performance',
  'Overall revenue achievement vs target',
  'custom',
  '["760e8400-e29b-41d4-a716-446655440001"]',
  90,
  'higher_is_better',
  'percentage',
  '{}',
  'trending-up',
  'text-green-600',
  1,
  'medium',
  1.5,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '870e8400-e29b-41d4-a716-446655440002',
  ct.id,
  'profitability_index',
  'Profitability Index',
  'Combined profitability performance indicator',
  'average',
  '["760e8400-e29b-41d4-a716-446655440004", "760e8400-e29b-41d4-a716-446655440005"]',
  85,
  'higher_is_better',
  'percentage',
  '{}',
  'percent',
  'text-blue-600',
  2,
  'medium',
  1.3,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '870e8400-e29b-41d4-a716-446655440003',
  ct.id,
  'liquidity_health',
  'Liquidity Health',
  'Cash flow and liquidity strength indicator',
  'custom',
  '["760e8400-e29b-41d4-a716-446655440007", "760e8400-e29b-41d4-a716-446655440008"]',
  80,
  'higher_is_better',
  'number',
  '{"suffix": "/100"}',
  'droplets',
  'text-cyan-600',
  3,
  'medium',
  1.2,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '870e8400-e29b-41d4-a716-446655440004',
  ct.id,
  'cost_efficiency',
  'Cost Efficiency',
  'Expense management and cost optimization score',
  'custom',
  '["760e8400-e29b-41d4-a716-446655440010", "760e8400-e29b-41d4-a716-446655440012"]',
  75,
  'higher_is_better',
  'percentage',
  '{}',
  'target',
  'text-purple-600',
  4,
  'medium',
  1.0,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '870e8400-e29b-41d4-a716-446655440005',
  ct.id,
  'financial_stability',
  'Financial Stability',
  'Overall financial health and stability score',
  'average',
  '["760e8400-e29b-41d4-a716-446655440006"]',
  82,
  'higher_is_better',
  'number',
  '{"suffix": "/100"}',
  'shield',
  'text-indigo-600',
  5,
  'medium',
  1.4,
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '870e8400-e29b-41d4-a716-446655440006',
  ct.id,
  'growth_momentum',
  'Growth Momentum',
  'Revenue growth and expansion indicator',
  'custom',
  '["760e8400-e29b-41d4-a716-446655440003"]',
  88,
  'higher_is_better',
  'percentage',
  '{}',
  'rocket',
  'text-orange-600',
  6,
  'medium',
  1.1,
  true
FROM cockpit_types ct WHERE ct.name = 'finance';

-- Create Insights for Finance Cockpit
INSERT INTO cockpit_insights (id, cockpit_type_id, title, description, insight_type, priority, insight_category, confidence_score, source_data_ids, insight_data, is_active) 
SELECT 
  '980e8400-e29b-41d4-a716-446655440001',
  ct.id,
  'Revenue Target Achievement Risk',
  'Current revenue trajectory suggests we may fall short of Q4 targets by 8.2%. October performance shows a significant dip that requires immediate attention and corrective action.',
  'risk',
  'high',
  'general',
  0.92,
  '["760e8400-e29b-41d4-a716-446655440001"]',
  '{"shortfall_amount": 262350, "recommended_actions": ["Accelerate sales pipeline", "Launch promotional campaigns", "Focus on high-value clients"], "timeline": "immediate"}',
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '980e8400-e29b-41d4-a716-446655440002',
  ct.id,
  'Cash Flow Optimization Opportunity',
  'Accounts receivable optimization could improve cash flow by $156,000. Current DSO of 28 days can be reduced to 22 days through automated follow-up and early payment incentives.',
  'opportunity',
  'medium',
  'general',
  0.87,
  '["760e8400-e29b-41d4-a716-446655440007"]',
  '{"improvement_potential": 156000, "current_dso": 28, "target_dso": 22, "implementation_effort": "medium"}',
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '980e8400-e29b-41d4-a716-446655440003',
  ct.id,
  'Expense Management Excellence',
  'Operating expenses are 8.7% under budget, indicating strong cost control. This efficiency gain provides opportunity to reinvest $194,300 in growth initiatives without impacting profitability targets.',
  'opportunity',
  'low',
  'general',
  0.94,
  '["760e8400-e29b-41d4-a716-446655440010"]',
  '{"savings_amount": 194300, "efficiency_gain": 8.7, "reinvestment_options": ["R&D", "Marketing", "Technology upgrades"]}',
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '980e8400-e29b-41d4-a716-446655440004',
  ct.id,
  'Profitability Margin Pressure',
  'Net profit margin has declined 0.5% over the last quarter due to increased personnel costs. Gross margin remains strong, suggesting the issue is operational rather than revenue-based.',
  'alert',
  'medium',
  'general',
  0.89,
  '["760e8400-e29b-41d4-a716-446655440005"]',
  '{"margin_decline": 0.5, "root_cause": "personnel_costs", "mitigation_strategies": ["Process automation", "Productivity improvements", "Role optimization"]}',
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '980e8400-e29b-41d4-a716-446655440005',
  ct.id,
  'Working Capital Efficiency Gains',
  'Cash conversion cycle improvement of 6 days demonstrates enhanced working capital management. This efficiency translates to approximately $45,000 in additional working capital availability.',
  'optimization',
  'low',
  'general',
  0.83,
  '["760e8400-e29b-41d4-a716-446655440009"]',
  '{"cycle_improvement": 6, "additional_capital": 45000, "contributing_factors": ["Faster collections", "Optimized inventory", "Strategic payment timing"]}',
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '980e8400-e29b-41d4-a716-446655440006',
  ct.id,
  'EBITDA Performance Gap',
  'EBITDA is tracking 16.5% below target, primarily due to increased operational costs and lower-than-expected Q4 revenue. Requires strategic intervention to meet annual financial goals.',
  'risk',
  'high',
  'general',
  0.91,
  '["760e8400-e29b-41d4-a716-446655440006"]',
  '{"performance_gap": 16.5, "target_shortfall": 105770, "primary_causes": ["Operational costs", "Revenue shortfall"], "urgency": "high"}',
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '980e8400-e29b-41d4-a716-446655440007',
  ct.id,
  'Technology Investment ROI',
  'Current technology spend of 4.2% of revenue is generating strong automation benefits. Recommended increase to 5.5% could yield additional $34,600 in annual efficiency gains.',
  'opportunity',
  'medium',
  'general',
  0.78,
  '["760e8400-e29b-41d4-a716-446655440011"]',
  '{"current_spend_pct": 4.2, "recommended_pct": 5.5, "projected_savings": 34600, "payback_period": "14 months"}',
  true
FROM cockpit_types ct WHERE ct.name = 'finance'
UNION ALL
SELECT 
  '980e8400-e29b-41d4-a716-446655440008',
  ct.id,
  'Seasonal Revenue Pattern Optimization',
  'Q3 consistently shows highest revenue performance (+23% above average). Strategic planning to replicate Q3 conditions in other quarters could increase annual revenue by 15%.',
  'optimization',
  'medium',
  'general',
  0.85,
  '["760e8400-e29b-41d4-a716-446655440002"]',
  '{"q3_outperformance": 23, "replication_potential": 15, "key_factors": ["Marketing campaigns", "Product launches", "Customer engagement"], "implementation_complexity": "medium"}',
  true
FROM cockpit_types ct WHERE ct.name = 'finance';

-- Create sample metric data for historical tracking
INSERT INTO cockpit_metric_data (metric_id, timestamp, value, metadata) VALUES
-- Total Revenue historical data
('760e8400-e29b-41d4-a716-446655440001', '2024-01-31T23:59:59Z', 650000, '{"period": "monthly", "source": "accounting_system"}'),
('760e8400-e29b-41d4-a716-446655440001', '2024-02-29T23:59:59Z', 1370000, '{"period": "cumulative", "source": "accounting_system"}'),
('760e8400-e29b-41d4-a716-446655440001', '2024-03-31T23:59:59Z', 2090000, '{"period": "cumulative", "source": "accounting_system"}'),
('760e8400-e29b-41d4-a716-446655440001', '2024-04-30T23:59:59Z', 2810000, '{"period": "cumulative", "source": "accounting_system"}'),
('760e8400-e29b-41d4-a716-446655440001', '2024-05-31T23:59:59Z', 2847650, '{"period": "cumulative", "source": "accounting_system"}'),

-- Operating Cash Flow data
('760e8400-e29b-41d4-a716-446655440007', '2024-01-31T23:59:59Z', 85000, '{"period": "monthly", "source": "cash_flow_statement"}'),
('760e8400-e29b-41d4-a716-446655440007', '2024-02-29T23:59:59Z', 92000, '{"period": "monthly", "source": "cash_flow_statement"}'),
('760e8400-e29b-41d4-a716-446655440007', '2024-03-31T23:59:59Z', 88000, '{"period": "monthly", "source": "cash_flow_statement"}'),
('760e8400-e29b-41d4-a716-446655440007', '2024-04-30T23:59:59Z', 95000, '{"period": "monthly", "source": "cash_flow_statement"}'),
('760e8400-e29b-41d4-a716-446655440007', '2024-05-31T23:59:59Z', 52890, '{"period": "monthly", "source": "cash_flow_statement"}');
