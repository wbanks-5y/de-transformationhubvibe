
-- First, let's clean up any existing marketing KPI data to start fresh
DELETE FROM cockpit_kpi_targets WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_time_based WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1
  )
);

DELETE FROM cockpit_kpi_values WHERE kpi_id IN (
  SELECT id FROM cockpit_kpis WHERE cockpit_type_id = (
    SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1
  )
);

DELETE FROM cockpit_kpis WHERE cockpit_type_id = (
  SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1
);

-- Insert Marketing KPIs into cockpit_kpis table
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
  (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1),
  'marketing_roi',
  'Marketing ROI',
  'Return on investment for marketing campaigns and activities',
  'single',
  'number',
  '{"decimal_places": 1, "suffix": "x"}',
  'higher_is_better',
  'large',
  3.0,
  1,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1),
  'lead_conversion_rate',
  'Lead Conversion Rate',
  'Percentage of leads that convert to paying customers',
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
  (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1),
  'customer_acquisition_cost',
  'Customer Acquisition Cost (CAC)',
  'Average cost to acquire one new customer through marketing efforts',
  'single',
  'currency',
  '{"decimal_places": 0, "currency_code": "USD"}',
  'lower_is_better',
  'medium',
  2.7,
  3,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1),
  'brand_awareness_score',
  'Brand Awareness Score',
  'Percentage of target market that recognizes the brand',
  'single',
  'percentage',
  '{"decimal_places": 0}',
  'higher_is_better',
  'small',
  2.3,
  4,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1),
  'email_open_rate',
  'Email Open Rate',
  'Percentage of sent emails that are opened by recipients',
  'single',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'small',
  2.1,
  5,
  true
),
-- Time-Based KPIs
(
  (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1),
  'monthly_lead_generation',
  'Monthly Lead Generation',
  'Total number of qualified leads generated per month',
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
  (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1),
  'cost_per_lead',
  'Cost Per Lead (CPL)',
  'Average marketing cost to generate one qualified lead',
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
  (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1),
  'website_traffic',
  'Website Traffic',
  'Monthly unique visitors to company website',
  'time_based',
  'number',
  '{"decimal_places": 0}',
  'higher_is_better',
  'medium',
  2.4,
  8,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1),
  'social_media_engagement_rate',
  'Social Media Engagement Rate',
  'Percentage of social media followers engaging with content',
  'time_based',
  'percentage',
  '{"decimal_places": 1}',
  'higher_is_better',
  'small',
  2.2,
  9,
  true
),
(
  (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1),
  'marketing_qualified_leads',
  'Marketing Qualified Leads (MQL)',
  'Number of leads that meet qualification criteria for sales handoff',
  'time_based',
  'number',
  '{"decimal_places": 0}',
  'higher_is_better',
  'medium',
  2.8,
  10,
  true
);

-- Insert current single KPI values (June 2025) - Mixed performance scenarios
INSERT INTO cockpit_kpi_values (kpi_id, current_value, recorded_at, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'marketing_roi' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  3.2,
  '2025-06-23T10:00:00Z',
  'Below target - campaign efficiency needs improvement'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'lead_conversion_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  18.5,
  '2025-06-23T10:00:00Z',
  'Below target - lead qualification and nurturing gaps'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'customer_acquisition_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  185,
  '2025-06-23T10:00:00Z',
  'Above target - rising advertising costs and competition'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'brand_awareness_score' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  72,
  '2025-06-23T10:00:00Z',
  'Slightly below target - brand building initiatives needed'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'email_open_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  24.8,
  '2025-06-23T10:00:00Z',
  'Below target - email content and segmentation optimization required'
);

-- Insert time-based historical data (18 months: Jan 2024 - Jun 2025)
-- Monthly Lead Generation (GOOD performance - strong growth with seasonality)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data - showing seasonal marketing patterns
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 450),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 520),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 580),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 620),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 680),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 640),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 590),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 580),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 720),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 850),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 920),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 950),
-- 2025 data - continued growth
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 780),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 820),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 890),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 930),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 980),
((SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 1020);

-- Cost Per Lead (BAD performance - rising costs)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data - showing cost inflation
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 45.50),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 46.25),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 47.80),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 48.90),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 50.15),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 51.75),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 53.20),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 54.65),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 55.90),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 57.25),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 58.80),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 60.15),
-- 2025 data - continued cost increases
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 61.50),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 62.90),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 64.25),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 65.80),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 67.15),
((SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 68.90);

-- Website Traffic (GOOD performance - steady growth)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data - showing steady growth
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 28500),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 29200),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 30800),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 32100),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 33600),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 34200),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 33900),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 34800),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 36500),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 38200),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 39800),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 41500),
-- 2025 data - continued growth
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 40200),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 41800),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 43400),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 44900),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 46200),
((SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 47800);

-- Social Media Engagement Rate (BAD performance - declining trend)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data - showing declining engagement
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 4.8),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 4.6),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 4.4),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 4.2),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 4.0),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 3.9),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 3.7),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 3.5),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 3.4),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 3.2),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 3.1),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 2.9),
-- 2025 data - continued decline
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 2.8),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 2.7),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 2.5),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 2.4),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 2.3),
((SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 2.2);

-- Marketing Qualified Leads (GOOD performance - solid growth)
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value) VALUES
-- 2024 data - showing good growth
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-01-01', '2024-01-31', 'month', 185),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-02-01', '2024-02-29', 'month', 210),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-03-01', '2024-03-31', 'month', 235),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-04-01', '2024-04-30', 'month', 250),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-05-01', '2024-05-31', 'month', 275),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-06-01', '2024-06-30', 'month', 265),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-07-01', '2024-07-31', 'month', 245),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-08-01', '2024-08-31', 'month', 240),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-09-01', '2024-09-30', 'month', 290),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-10-01', '2024-10-31', 'month', 340),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-11-01', '2024-11-30', 'month', 370),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2024-12-01', '2024-12-31', 'month', 385),
-- 2025 data - continued growth
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-01-01', '2025-01-31', 'month', 315),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-02-01', '2025-02-28', 'month', 330),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-03-01', '2025-03-31', 'month', 360),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-04-01', '2025-04-30', 'month', 375),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-05-01', '2025-05-31', 'month', 395),
((SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)), '2025-06-01', '2025-06-30', 'month', 410);

-- Insert KPI targets with time-aligned periods (matching actuals timeframe)
-- Single value targets (no period information needed)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'marketing_roi' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'single',
  4.0,
  true,
  'Target marketing ROI for campaign efficiency'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'lead_conversion_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'single',
  22.0,
  true,
  'Target conversion rate for qualified leads'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'customer_acquisition_cost' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'single',
  150.0,
  true,
  'Maximum acceptable customer acquisition cost'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'brand_awareness_score' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'single',
  75.0,
  true,
  'Target brand recognition in market'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'email_open_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'single',
  28.0,
  true,
  'Industry benchmark email open rate'
);

-- Time-based targets with period information aligned to actual data
-- Historical targets (2024)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'time_based',
  600,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 monthly lead generation target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'time_based',
  50.0,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 cost per lead budget target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'time_based',
  35000,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 website traffic growth target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'time_based',
  4.5,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 social media engagement target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'time_based',
  250,
  '2024-01-01',
  '2024-12-31',
  'month',
  true,
  '2024 MQL generation target'
);

-- Current year targets (2025)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, is_active, notes) VALUES
(
  (SELECT id FROM cockpit_kpis WHERE name = 'monthly_lead_generation' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'time_based',
  850,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 monthly lead generation target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'cost_per_lead' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'time_based',
  55.0,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 cost per lead budget target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'website_traffic' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'time_based',
  45000,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 website traffic growth target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'social_media_engagement_rate' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'time_based',
  3.5,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 social media engagement target'
),
(
  (SELECT id FROM cockpit_kpis WHERE name = 'marketing_qualified_leads' AND cockpit_type_id = (SELECT id FROM cockpit_types WHERE name = 'marketing' LIMIT 1)),
  'time_based',
  350,
  '2025-01-01',
  '2025-12-31',
  'month',
  true,
  '2025 MQL generation target'
);
