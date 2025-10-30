-- =====================================================
-- COMPREHENSIVE HR COCKPIT FOR JELLYCAT
-- =====================================================
-- This migration creates a complete Human Resources cockpit
-- with 10 sections, 60+ metrics, and comprehensive sample data

-- =====================================================
-- 1. COCKPIT TYPE
-- =====================================================
INSERT INTO public.cockpit_types (
  id, name, display_name, description, icon, color_class, 
  route_path, cockpit_description, sort_order, is_active
) VALUES (
  '550e8400-e29b-41d4-a716-446655440008',
  'human_resources',
  'Human Resources',
  'Comprehensive HR analytics and workforce management',
  'Users',
  '#EC4899',
  '/cockpit/human-resources',
  'Track workforce metrics, talent acquisition, employee engagement, learning & development, and organizational health for Jellycat''s creative workforce.',
  8,
  true
);

-- =====================================================
-- 2. SECTIONS (10 sections)
-- =====================================================
INSERT INTO public.cockpit_sections (id, cockpit_type_id, name, display_name, description, sort_order, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440008', 'workforce_overview', 'Workforce Overview', 'Total headcount and employee distribution', 1, true),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', 'talent_acquisition', 'Talent Acquisition', 'Recruitment and hiring metrics', 2, true),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', 'employee_engagement', 'Employee Engagement', 'Satisfaction and engagement scores', 3, true),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440008', 'learning_development', 'Learning & Development', 'Training and skills development', 4, true),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440008', 'retention_turnover', 'Retention & Turnover', 'Employee retention and turnover analysis', 5, true),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440008', 'compensation_benefits', 'Compensation & Benefits', 'Salary and benefits analytics', 6, true),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', 'performance_management', 'Performance Management', 'Performance reviews and goal tracking', 7, true),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', 'diversity_inclusion', 'Diversity & Inclusion', 'Workforce diversity metrics', 8, true),
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440008', 'wellbeing_safety', 'Wellbeing & Safety', 'Employee health and safety', 9, true),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440008', 'workforce_planning', 'Workforce Planning', 'Strategic workforce planning', 10, true);

-- =====================================================
-- 3. WORKFORCE OVERVIEW METRICS
-- =====================================================

-- Total Headcount (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'total_headcount', 'Total Headcount', 'Current number of employees', 'small', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'number', 487, 500, 'up');

-- Employee Growth Rate (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'employee_growth_rate', 'Employee Growth Rate', 'Year-over-year headcount growth', 'small', 2, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 'percentage', 12.5, 15.0, 'up');

-- Headcount by Department (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'headcount_by_department', 'Headcount by Department', 'Employee distribution across departments', 'large', 3, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 'bar', 'Department', 'Employees', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', 'Design', 45, 'Employees', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003', 'Production', 180, 'Employees', '#EC4899', 2),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 'Sales', 65, 'Employees', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440003', 'Marketing', 38, 'Employees', '#EC4899', 4),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440003', 'Operations', 85, 'Employees', '#EC4899', 5),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440003', 'HR', 22, 'Employees', '#EC4899', 6),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440003', 'Finance', 28, 'Employees', '#EC4899', 7),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440003', 'IT', 24, 'Employees', '#EC4899', 8);

-- Headcount Trend (Time-Based)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', 'headcount_trend', 'Headcount Trend', 'Monthly headcount growth', 'large', 4, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', 'line', 'month', 'Headcount', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, month, value, series_name, series_color) VALUES
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', 2024, 1, 433, 'Headcount', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004', 2024, 2, 438, 'Headcount', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440004', 2024, 3, 445, 'Headcount', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', 2024, 4, 451, 'Headcount', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440004', 2024, 5, 458, 'Headcount', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440004', 2024, 6, 463, 'Headcount', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440004', 2024, 7, 469, 'Headcount', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440004', 2024, 8, 474, 'Headcount', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440004', 2024, 9, 479, 'Headcount', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440004', 2024, 10, 483, 'Headcount', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440004', 2024, 11, 485, 'Headcount', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440004', 2024, 12, 487, 'Headcount', '#EC4899');

-- Employee Distribution by Location (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', 'employee_location', 'Employee Distribution by Location', 'Geographic employee distribution', 'medium', 5, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440005', 'pie', 'Location', 'Employees', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440005', 'London HQ', 195, 'Employees', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440005', 'Production Facility', 180, 'Employees', '#F472B6', 2),
('850e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440005', 'Regional Offices', 112, 'Employees', '#FBCFE8', 3);

-- =====================================================
-- 4. TALENT ACQUISITION METRICS
-- =====================================================

-- Open Positions (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440002', 'open_positions', 'Open Positions', 'Current job openings', 'small', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440006', 'number', 23, 20, 'stable');

-- Time to Fill (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440002', 'time_to_fill', 'Time to Fill', 'Average days to fill positions', 'small', 2, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440007', 'number', 42, 35, 'down');

-- Cost per Hire (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440002', 'cost_per_hire', 'Cost per Hire', 'Average recruitment cost', 'small', 3, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440008', 'currency', 4850, 5000, 'down');

-- Applications by Channel (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440002', 'applications_channel', 'Applications by Channel', 'Application sources', 'medium', 4, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440009', 'bar', 'Channel', 'Applications', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440009', 'LinkedIn', 145, 'Applications', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440013', '750e8400-e29b-41d4-a716-446655440009', 'Website', 98, 'Applications', '#EC4899', 2),
('850e8400-e29b-41d4-a716-446655440014', '750e8400-e29b-41d4-a716-446655440009', 'Referrals', 67, 'Applications', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440015', '750e8400-e29b-41d4-a716-446655440009', 'Indeed', 89, 'Applications', '#EC4899', 4),
('850e8400-e29b-41d4-a716-446655440016', '750e8400-e29b-41d4-a716-446655440009', 'Agencies', 34, 'Applications', '#EC4899', 5);

-- Hiring Pipeline (Multi-Value - Funnel)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440002', 'hiring_pipeline', 'Hiring Pipeline', 'Recruitment funnel stages', 'large', 5, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440010', 'funnel', 'Stage', 'Candidates', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440017', '750e8400-e29b-41d4-a716-446655440010', 'Applied', 433, 'Candidates', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440018', '750e8400-e29b-41d4-a716-446655440010', 'Screened', 187, 'Candidates', '#EC4899', 2),
('850e8400-e29b-41d4-a716-446655440019', '750e8400-e29b-41d4-a716-446655440010', 'Interviewed', 92, 'Candidates', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440010', 'Offered', 34, 'Candidates', '#EC4899', 4),
('850e8400-e29b-41d4-a716-446655440021', '750e8400-e29b-41d4-a716-446655440010', 'Accepted', 28, 'Candidates', '#EC4899', 5);

-- Monthly Hires (Time-Based)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440002', 'monthly_hires', 'Monthly Hires', 'New hires per month', 'large', 6, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440011', 'bar', 'month', 'New Hires', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, month, value, series_name, series_color) VALUES
('950e8400-e29b-41d4-a716-446655440013', '750e8400-e29b-41d4-a716-446655440011', 2024, 1, 5, 'Hires', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440014', '750e8400-e29b-41d4-a716-446655440011', 2024, 2, 7, 'Hires', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440015', '750e8400-e29b-41d4-a716-446655440011', 2024, 3, 9, 'Hires', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440016', '750e8400-e29b-41d4-a716-446655440011', 2024, 4, 6, 'Hires', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440017', '750e8400-e29b-41d4-a716-446655440011', 2024, 5, 8, 'Hires', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440018', '750e8400-e29b-41d4-a716-446655440011', 2024, 6, 5, 'Hires', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440019', '750e8400-e29b-41d4-a716-446655440011', 2024, 7, 7, 'Hires', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440011', 2024, 8, 6, 'Hires', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440021', '750e8400-e29b-41d4-a716-446655440011', 2024, 9, 8, 'Hires', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440022', '750e8400-e29b-41d4-a716-446655440011', 2024, 10, 4, 'Hires', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440023', '750e8400-e29b-41d4-a716-446655440011', 2024, 11, 3, 'Hires', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440024', '750e8400-e29b-41d4-a716-446655440011', 2024, 12, 4, 'Hires', '#EC4899');

-- Offer Acceptance Rate (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440012', '650e8400-e29b-41d4-a716-446655440002', 'offer_acceptance_rate', 'Offer Acceptance Rate', 'Percentage of accepted offers', 'small', 7, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440012', 'percentage', 82.4, 80.0, 'up');

-- =====================================================
-- 5. EMPLOYEE ENGAGEMENT METRICS
-- =====================================================

-- Overall Engagement Score (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440013', '650e8400-e29b-41d4-a716-446655440003', 'overall_engagement', 'Overall Engagement Score', 'Employee engagement index', 'small', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440013', '750e8400-e29b-41d4-a716-446655440013', 'percentage', 78.5, 75.0, 'up');

-- eNPS Score (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440014', '650e8400-e29b-41d4-a716-446655440003', 'enps_score', 'eNPS Score', 'Employee Net Promoter Score', 'small', 2, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440014', '750e8400-e29b-41d4-a716-446655440014', 'number', 42, 40, 'up');

-- Engagement by Department (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440015', '650e8400-e29b-41d4-a716-446655440003', 'engagement_by_dept', 'Engagement by Department', 'Department-level engagement', 'large', 3, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440015', '750e8400-e29b-41d4-a716-446655440015', 'horizontal_bar', 'Department', 'Score %', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440022', '750e8400-e29b-41d4-a716-446655440015', 'Design', 85.3, 'Engagement', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440023', '750e8400-e29b-41d4-a716-446655440015', 'Marketing', 81.7, 'Engagement', '#EC4899', 2),
('850e8400-e29b-41d4-a716-446655440024', '750e8400-e29b-41d4-a716-446655440015', 'Sales', 79.2, 'Engagement', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440025', '750e8400-e29b-41d4-a716-446655440015', 'Production', 76.8, 'Engagement', '#EC4899', 4),
('850e8400-e29b-41d4-a716-446655440026', '750e8400-e29b-41d4-a716-446655440015', 'Operations', 75.4, 'Engagement', '#EC4899', 5),
('850e8400-e29b-41d4-a716-446655440027', '750e8400-e29b-41d4-a716-446655440015', 'IT', 77.9, 'Engagement', '#EC4899', 6),
('850e8400-e29b-41d4-a716-446655440028', '750e8400-e29b-41d4-a716-446655440015', 'Finance', 74.2, 'Engagement', '#EC4899', 7),
('850e8400-e29b-41d4-a716-446655440029', '750e8400-e29b-41d4-a716-446655440015', 'HR', 80.5, 'Engagement', '#EC4899', 8);

-- Engagement Trend (Time-Based)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440016', '650e8400-e29b-41d4-a716-446655440003', 'engagement_trend', 'Engagement Trend', 'Quarterly engagement tracking', 'large', 4, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440016', '750e8400-e29b-41d4-a716-446655440016', 'line', 'quarter', 'Engagement %', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, quarter, value, series_name, series_color) VALUES
('950e8400-e29b-41d4-a716-446655440025', '750e8400-e29b-41d4-a716-446655440016', 2023, 1, 72.3, 'Engagement', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440026', '750e8400-e29b-41d4-a716-446655440016', 2023, 2, 73.8, 'Engagement', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440027', '750e8400-e29b-41d4-a716-446655440016', 2023, 3, 75.1, 'Engagement', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440028', '750e8400-e29b-41d4-a716-446655440016', 2023, 4, 76.4, 'Engagement', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440029', '750e8400-e29b-41d4-a716-446655440016', 2024, 1, 77.2, 'Engagement', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440030', '750e8400-e29b-41d4-a716-446655440016', 2024, 2, 77.9, 'Engagement', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440031', '750e8400-e29b-41d4-a716-446655440016', 2024, 3, 78.5, 'Engagement', '#EC4899');

-- Pulse Survey Participation (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440017', '650e8400-e29b-41d4-a716-446655440003', 'survey_participation', 'Pulse Survey Participation', 'Survey response rate', 'small', 5, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440017', '750e8400-e29b-41d4-a716-446655440017', 'percentage', 87.3, 85.0, 'up');

-- Work-Life Balance Score (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440018', '650e8400-e29b-41d4-a716-446655440003', 'work_life_balance', 'Work-Life Balance Score', 'Work-life balance rating', 'small', 6, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440018', '750e8400-e29b-41d4-a716-446655440018', 'percentage', 74.2, 75.0, 'stable');

-- Culture Fit Score (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440019', '650e8400-e29b-41d4-a716-446655440003', 'culture_fit', 'Culture Fit Score', 'Cultural alignment rating', 'small', 7, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440019', '750e8400-e29b-41d4-a716-446655440019', 'percentage', 81.6, 80.0, 'up');

-- =====================================================
-- 6. LEARNING & DEVELOPMENT METRICS
-- =====================================================

-- Training Hours per Employee (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440020', '650e8400-e29b-41d4-a716-446655440004', 'training_hours', 'Training Hours per Employee', 'Average annual training hours', 'small', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440020', 'number', 32.5, 35.0, 'up');

-- Training Completion Rate (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440021', '650e8400-e29b-41d4-a716-446655440004', 'training_completion', 'Training Completion Rate', 'Course completion percentage', 'small', 2, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440021', '750e8400-e29b-41d4-a716-446655440021', 'percentage', 91.8, 90.0, 'up');

-- L&D Investment per Employee (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440022', '650e8400-e29b-41d4-a716-446655440004', 'ld_investment', 'L&D Investment per Employee', 'Annual training investment', 'small', 3, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440022', '750e8400-e29b-41d4-a716-446655440022', 'currency', 1850, 2000, 'up');

-- Training by Category (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440023', '650e8400-e29b-41d4-a716-446655440004', 'training_by_category', 'Training by Category', 'Training type distribution', 'large', 4, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440023', '750e8400-e29b-41d4-a716-446655440023', 'pie', 'Category', 'Percentage', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440030', '750e8400-e29b-41d4-a716-446655440023', 'Technical Skills', 35, 'Training', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440031', '750e8400-e29b-41d4-a716-446655440023', 'Leadership', 22, 'Training', '#F472B6', 2),
('850e8400-e29b-41d4-a716-446655440032', '750e8400-e29b-41d4-a716-446655440023', 'Design', 18, 'Training', '#FBCFE8', 3),
('850e8400-e29b-41d4-a716-446655440033', '750e8400-e29b-41d4-a716-446655440023', 'Safety', 15, 'Training', '#FDF2F8', 4),
('850e8400-e29b-41d4-a716-446655440034', '750e8400-e29b-41d4-a716-446655440023', 'Other', 10, 'Training', '#DB2777', 5);

-- Skills Development Trend (Time-Based)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440024', '650e8400-e29b-41d4-a716-446655440004', 'skills_development_trend', 'Skills Development Trend', 'Quarterly training hours', 'large', 5, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440024', '750e8400-e29b-41d4-a716-446655440024', 'area', 'quarter', 'Hours', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, quarter, value, series_name, series_color) VALUES
('950e8400-e29b-41d4-a716-446655440032', '750e8400-e29b-41d4-a716-446655440024', 2023, 1, 6850, 'Hours', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440033', '750e8400-e29b-41d4-a716-446655440024', 2023, 2, 7230, 'Hours', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440034', '750e8400-e29b-41d4-a716-446655440024', 2023, 3, 7680, 'Hours', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440035', '750e8400-e29b-41d4-a716-446655440024', 2023, 4, 7940, 'Hours', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440036', '750e8400-e29b-41d4-a716-446655440024', 2024, 1, 8150, 'Hours', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440037', '750e8400-e29b-41d4-a716-446655440024', 2024, 2, 8420, 'Hours', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440038', '750e8400-e29b-41d4-a716-446655440024', 2024, 3, 8650, 'Hours', '#EC4899');

-- Internal Promotion Rate (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440025', '650e8400-e29b-41d4-a716-446655440004', 'internal_promotion_rate', 'Internal Promotion Rate', 'Percentage of internal promotions', 'small', 6, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440025', '750e8400-e29b-41d4-a716-446655440025', 'percentage', 15.7, 12.0, 'up');

-- =====================================================
-- 7. RETENTION & TURNOVER METRICS
-- =====================================================

-- Overall Turnover Rate (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440026', '650e8400-e29b-41d4-a716-446655440005', 'overall_turnover', 'Overall Turnover Rate', 'Total employee turnover', 'small', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440026', '750e8400-e29b-41d4-a716-446655440026', 'percentage', 8.3, 10.0, 'down');

-- Voluntary Turnover (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440027', '650e8400-e29b-41d4-a716-446655440005', 'voluntary_turnover', 'Voluntary Turnover', 'Employee-initiated departures', 'small', 2, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440027', '750e8400-e29b-41d4-a716-446655440027', 'percentage', 6.1, 7.0, 'down');

-- Retention Rate (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440028', '650e8400-e29b-41d4-a716-446655440005', 'retention_rate', 'Retention Rate', 'Employee retention percentage', 'small', 3, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440028', '750e8400-e29b-41d4-a716-446655440028', 'percentage', 91.7, 90.0, 'up');

-- Turnover by Department (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440029', '650e8400-e29b-41d4-a716-446655440005', 'turnover_by_dept', 'Turnover by Department', 'Department turnover rates', 'large', 4, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440029', '750e8400-e29b-41d4-a716-446655440029', 'bar', 'Department', 'Turnover %', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440035', '750e8400-e29b-41d4-a716-446655440029', 'Sales', 11.2, 'Turnover', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440036', '750e8400-e29b-41d4-a716-446655440029', 'Production', 9.8, 'Turnover', '#EC4899', 2),
('850e8400-e29b-41d4-a716-446655440037', '750e8400-e29b-41d4-a716-446655440029', 'IT', 8.7, 'Turnover', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440038', '750e8400-e29b-41d4-a716-446655440029', 'Marketing', 7.5, 'Turnover', '#EC4899', 4),
('850e8400-e29b-41d4-a716-446655440039', '750e8400-e29b-41d4-a716-446655440029', 'Operations', 7.2, 'Turnover', '#EC4899', 5),
('850e8400-e29b-41d4-a716-446655440040', '750e8400-e29b-41d4-a716-446655440029', 'Design', 5.8, 'Turnover', '#EC4899', 6),
('850e8400-e29b-41d4-a716-446655440041', '750e8400-e29b-41d4-a716-446655440029', 'Finance', 5.4, 'Turnover', '#EC4899', 7),
('850e8400-e29b-41d4-a716-446655440042', '750e8400-e29b-41d4-a716-446655440029', 'HR', 4.9, 'Turnover', '#EC4899', 8);

-- Turnover Trend (Time-Based)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440030', '650e8400-e29b-41d4-a716-446655440005', 'turnover_trend', 'Turnover Trend', 'Monthly turnover tracking', 'large', 5, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440030', '750e8400-e29b-41d4-a716-446655440030', 'line', 'month', 'Turnover %', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, month, value, series_name, series_color) VALUES
('950e8400-e29b-41d4-a716-446655440039', '750e8400-e29b-41d4-a716-446655440030', 2023, 7, 9.2, 'Turnover', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440040', '750e8400-e29b-41d4-a716-446655440030', 2023, 8, 9.5, 'Turnover', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440041', '750e8400-e29b-41d4-a716-446655440030', 2023, 9, 9.1, 'Turnover', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440042', '750e8400-e29b-41d4-a716-446655440030', 2023, 10, 8.9, 'Turnover', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440043', '750e8400-e29b-41d4-a716-446655440030', 2023, 11, 8.7, 'Turnover', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440044', '750e8400-e29b-41d4-a716-446655440030', 2023, 12, 8.4, 'Turnover', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440045', '750e8400-e29b-41d4-a716-446655440030', 2024, 1, 8.6, 'Turnover', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440046', '750e8400-e29b-41d4-a716-446655440030', 2024, 2, 8.5, 'Turnover', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440047', '750e8400-e29b-41d4-a716-446655440030', 2024, 3, 8.3, 'Turnover', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440048', '750e8400-e29b-41d4-a716-446655440030', 2024, 4, 8.1, 'Turnover', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440049', '750e8400-e29b-41d4-a716-446655440030', 2024, 5, 8.2, 'Turnover', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440050', '750e8400-e29b-41d4-a716-446655440030', 2024, 6, 8.3, 'Turnover', '#EC4899');

-- Average Tenure (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440031', '650e8400-e29b-41d4-a716-446655440005', 'average_tenure', 'Average Tenure', 'Average years of service', 'small', 6, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440031', '750e8400-e29b-41d4-a716-446655440031', 'number', 4.8, 5.0, 'up');

-- Regrettable Turnover (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440032', '650e8400-e29b-41d4-a716-446655440005', 'regrettable_turnover', 'Regrettable Turnover', 'High-performer departures', 'small', 7, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440032', '750e8400-e29b-41d4-a716-446655440032', 'percentage', 3.2, 5.0, 'down');

-- Exit Reasons (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440033', '650e8400-e29b-41d4-a716-446655440005', 'exit_reasons', 'Exit Reasons', 'Reasons for employee departures', 'medium', 8, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440033', '750e8400-e29b-41d4-a716-446655440033', 'pie', 'Reason', 'Percentage', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440043', '750e8400-e29b-41d4-a716-446655440033', 'Career Growth', 28, 'Exits', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440044', '750e8400-e29b-41d4-a716-446655440033', 'Compensation', 22, 'Exits', '#F472B6', 2),
('850e8400-e29b-41d4-a716-446655440045', '750e8400-e29b-41d4-a716-446655440033', 'Relocation', 18, 'Exits', '#FBCFE8', 3),
('850e8400-e29b-41d4-a716-446655440046', '750e8400-e29b-41d4-a716-446655440033', 'Work-Life Balance', 14, 'Exits', '#FDF2F8', 4),
('850e8400-e29b-41d4-a716-446655440047', '750e8400-e29b-41d4-a716-446655440033', 'Other', 18, 'Exits', '#DB2777', 5);

-- =====================================================
-- 8. COMPENSATION & BENEFITS METRICS
-- =====================================================

-- Average Salary (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440034', '650e8400-e29b-41d4-a716-446655440006', 'average_salary', 'Average Salary', 'Mean employee salary', 'small', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440034', '750e8400-e29b-41d4-a716-446655440034', 'currency', 42500, 45000, 'up');

-- Salary Competitiveness Index (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440035', '650e8400-e29b-41d4-a716-446655440006', 'salary_competitiveness', 'Salary Competitiveness Index', 'Market comparison percentage', 'small', 2, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440035', '750e8400-e29b-41d4-a716-446655440035', 'percentage', 103.5, 100.0, 'up');

-- Total Compensation Cost (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440036', '650e8400-e29b-41d4-a716-446655440006', 'total_compensation_cost', 'Total Compensation Cost', 'Annual compensation expense', 'small', 3, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440036', '750e8400-e29b-41d4-a716-446655440036', 'currency', 24800000, 25000000, 'up');

-- Salary by Department (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440037', '650e8400-e29b-41d4-a716-446655440006', 'salary_by_dept', 'Salary by Department', 'Average departmental salaries', 'large', 4, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440037', '750e8400-e29b-41d4-a716-446655440037', 'bar', 'Department', 'Salary (£)', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440048', '750e8400-e29b-41d4-a716-446655440037', 'Design', 52500, 'Salary', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440049', '750e8400-e29b-41d4-a716-446655440037', 'IT', 51200, 'Salary', '#EC4899', 2),
('850e8400-e29b-41d4-a716-446655440050', '750e8400-e29b-41d4-a716-446655440037', 'Sales', 48700, 'Salary', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440051', '750e8400-e29b-41d4-a716-446655440037', 'Finance', 47800, 'Salary', '#EC4899', 4),
('850e8400-e29b-41d4-a716-446655440052', '750e8400-e29b-41d4-a716-446655440037', 'Marketing', 45300, 'Salary', '#EC4899', 5),
('850e8400-e29b-41d4-a716-446655440053', '750e8400-e29b-41d4-a716-446655440037', 'HR', 43900, 'Salary', '#EC4899', 6),
('850e8400-e29b-41d4-a716-446655440054', '750e8400-e29b-41d4-a716-446655440037', 'Operations', 41200, 'Salary', '#EC4899', 7),
('850e8400-e29b-41d4-a716-446655440055', '750e8400-e29b-41d4-a716-446655440037', 'Production', 35800, 'Salary', '#EC4899', 8);

-- Compensation Trend (Time-Based)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440038', '650e8400-e29b-41d4-a716-446655440006', 'compensation_trend', 'Compensation Trend', 'Quarterly compensation costs', 'large', 5, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440038', '750e8400-e29b-41d4-a716-446655440038', 'line', 'quarter', 'Cost (£M)', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, quarter, value, series_name, series_color) VALUES
('950e8400-e29b-41d4-a716-446655440051', '750e8400-e29b-41d4-a716-446655440038', 2023, 1, 22.1, 'Compensation', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440052', '750e8400-e29b-41d4-a716-446655440038', 2023, 2, 22.5, 'Compensation', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440053', '750e8400-e29b-41d4-a716-446655440038', 2023, 3, 22.9, 'Compensation', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440054', '750e8400-e29b-41d4-a716-446655440038', 2023, 4, 23.4, 'Compensation', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440055', '750e8400-e29b-41d4-a716-446655440038', 2024, 1, 23.8, 'Compensation', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440056', '750e8400-e29b-41d4-a716-446655440038', 2024, 2, 24.2, 'Compensation', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440057', '750e8400-e29b-41d4-a716-446655440038', 2024, 3, 24.8, 'Compensation', '#EC4899');

-- Benefits Utilization Rate (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440039', '650e8400-e29b-41d4-a716-446655440006', 'benefits_utilization', 'Benefits Utilization Rate', 'Employee benefits usage', 'small', 6, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440039', '750e8400-e29b-41d4-a716-446655440039', 'percentage', 84.7, 80.0, 'up');

-- Benefits by Type (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440040', '650e8400-e29b-41d4-a716-446655440006', 'benefits_by_type', 'Benefits by Type', 'Benefits cost distribution', 'medium', 7, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440040', '750e8400-e29b-41d4-a716-446655440040', 'doughnut', 'Type', 'Percentage', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440056', '750e8400-e29b-41d4-a716-446655440040', 'Health Insurance', 35, 'Benefits', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440057', '750e8400-e29b-41d4-a716-446655440040', 'Pension', 28, 'Benefits', '#F472B6', 2),
('850e8400-e29b-41d4-a716-446655440058', '750e8400-e29b-41d4-a716-446655440040', 'Wellness Programs', 15, 'Benefits', '#FBCFE8', 3),
('850e8400-e29b-41d4-a716-446655440059', '750e8400-e29b-41d4-a716-446655440040', 'Life Insurance', 12, 'Benefits', '#FDF2F8', 4),
('850e8400-e29b-41d4-a716-446655440060', '750e8400-e29b-41d4-a716-446655440040', 'Other', 10, 'Benefits', '#DB2777', 5);

-- =====================================================
-- 9. PERFORMANCE MANAGEMENT METRICS
-- =====================================================

-- Performance Review Completion (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440041', '650e8400-e29b-41d4-a716-446655440007', 'review_completion', 'Performance Review Completion', 'Review completion rate', 'small', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440041', '750e8400-e29b-41d4-a716-446655440041', 'percentage', 96.5, 95.0, 'up');

-- Average Performance Rating (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440042', '650e8400-e29b-41d4-a716-446655440007', 'avg_performance_rating', 'Average Performance Rating', 'Mean performance score', 'small', 2, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440042', '750e8400-e29b-41d4-a716-446655440042', 'number', 3.8, 4.0, 'up');

-- Performance Distribution (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440043', '650e8400-e29b-41d4-a716-446655440007', 'performance_distribution', 'Performance Distribution', 'Rating distribution', 'large', 3, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440043', '750e8400-e29b-41d4-a716-446655440043', 'bar', 'Rating', 'Percentage', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440061', '750e8400-e29b-41d4-a716-446655440043', 'Outstanding (5)', 15, 'Employees', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440062', '750e8400-e29b-41d4-a716-446655440043', 'Exceeds (4)', 35, 'Employees', '#EC4899', 2),
('850e8400-e29b-41d4-a716-446655440063', '750e8400-e29b-41d4-a716-446655440043', 'Meets (3)', 42, 'Employees', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440064', '750e8400-e29b-41d4-a716-446655440043', 'Needs Improvement (2)', 8, 'Employees', '#EC4899', 4);

-- Goal Achievement Rate (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440044', '650e8400-e29b-41d4-a716-446655440007', 'goal_achievement', 'Goal Achievement Rate', 'Percentage of goals met', 'small', 4, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440044', '750e8400-e29b-41d4-a716-446655440044', 'percentage', 87.2, 85.0, 'up');

-- Performance Trend (Time-Based)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440045', '650e8400-e29b-41d4-a716-446655440007', 'performance_trend', 'Performance Trend', 'Quarterly average ratings', 'large', 5, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440045', '750e8400-e29b-41d4-a716-446655440045', 'line', 'quarter', 'Rating', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, quarter, value, series_name, series_color) VALUES
('950e8400-e29b-41d4-a716-446655440058', '750e8400-e29b-41d4-a716-446655440045', 2023, 1, 3.6, 'Performance', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440059', '750e8400-e29b-41d4-a716-446655440045', 2023, 2, 3.65, 'Performance', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440060', '750e8400-e29b-41d4-a716-446655440045', 2023, 3, 3.7, 'Performance', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440061', '750e8400-e29b-41d4-a716-446655440045', 2023, 4, 3.72, 'Performance', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440062', '750e8400-e29b-41d4-a716-446655440045', 2024, 1, 3.75, 'Performance', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440063', '750e8400-e29b-41d4-a716-446655440045', 2024, 2, 3.77, 'Performance', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440064', '750e8400-e29b-41d4-a716-446655440045', 2024, 3, 3.8, 'Performance', '#EC4899');

-- High Performer Retention (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440046', '650e8400-e29b-41d4-a716-446655440007', 'high_performer_retention', 'High Performer Retention', 'Top talent retention rate', 'small', 6, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440046', '750e8400-e29b-41d4-a716-446655440046', 'percentage', 95.8, 95.0, 'up');

-- =====================================================
-- 10. DIVERSITY & INCLUSION METRICS
-- =====================================================

-- Gender Diversity (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440047', '650e8400-e29b-41d4-a716-446655440008', 'gender_diversity', 'Gender Diversity (Female)', 'Female employee percentage', 'small', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440047', '750e8400-e29b-41d4-a716-446655440047', 'percentage', 58, 50, 'stable');

-- Gender by Level (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440048', '650e8400-e29b-41d4-a716-446655440008', 'gender_by_level', 'Gender by Level', 'Gender distribution across levels', 'large', 2, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440048', '750e8400-e29b-41d4-a716-446655440048', 'stacked_bar', 'Level', 'Percentage', true);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440065', '750e8400-e29b-41d4-a716-446655440048', 'Entry', 62, 'Female', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440066', '750e8400-e29b-41d4-a716-446655440048', 'Entry', 38, 'Male', '#3B82F6', 2),
('850e8400-e29b-41d4-a716-446655440067', '750e8400-e29b-41d4-a716-446655440048', 'Mid', 59, 'Female', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440068', '750e8400-e29b-41d4-a716-446655440048', 'Mid', 41, 'Male', '#3B82F6', 4),
('850e8400-e29b-41d4-a716-446655440069', '750e8400-e29b-41d4-a716-446655440048', 'Senior', 53, 'Female', '#EC4899', 5),
('850e8400-e29b-41d4-a716-446655440070', '750e8400-e29b-41d4-a716-446655440048', 'Senior', 47, 'Male', '#3B82F6', 6),
('850e8400-e29b-41d4-a716-446655440071', '750e8400-e29b-41d4-a716-446655440048', 'Executive', 45, 'Female', '#EC4899', 7),
('850e8400-e29b-41d4-a716-446655440072', '750e8400-e29b-41d4-a716-446655440048', 'Executive', 55, 'Male', '#3B82F6', 8);

-- Age Distribution (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440049', '650e8400-e29b-41d4-a716-446655440008', 'age_distribution', 'Age Distribution', 'Employee age groups', 'large', 3, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440049', '750e8400-e29b-41d4-a716-446655440049', 'bar', 'Age Group', 'Percentage', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440073', '750e8400-e29b-41d4-a716-446655440049', '18-25', 12, 'Employees', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440074', '750e8400-e29b-41d4-a716-446655440049', '26-35', 38, 'Employees', '#EC4899', 2),
('850e8400-e29b-41d4-a716-446655440075', '750e8400-e29b-41d4-a716-446655440049', '36-45', 32, 'Employees', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440076', '750e8400-e29b-41d4-a716-446655440049', '46-55', 14, 'Employees', '#EC4899', 4),
('850e8400-e29b-41d4-a716-446655440077', '750e8400-e29b-41d4-a716-446655440049', '56+', 4, 'Employees', '#EC4899', 5);

-- Pay Equity Ratio (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440050', '650e8400-e29b-41d4-a716-446655440008', 'pay_equity_ratio', 'Pay Equity Ratio', 'Female to male pay ratio', 'small', 4, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440050', '750e8400-e29b-41d4-a716-446655440050', 'percentage', 98.7, 100.0, 'up');

-- D&I Score (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440051', '650e8400-e29b-41d4-a716-446655440008', 'di_score', 'D&I Score', 'Diversity & Inclusion index', 'small', 5, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440051', '750e8400-e29b-41d4-a716-446655440051', 'percentage', 76.4, 80.0, 'up');

-- Cultural Background Diversity (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440052', '650e8400-e29b-41d4-a716-446655440008', 'cultural_diversity', 'Cultural Background Diversity', 'Ethnic diversity representation', 'medium', 6, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440052', '750e8400-e29b-41d4-a716-446655440052', 'pie', 'Background', 'Percentage', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440078', '750e8400-e29b-41d4-a716-446655440052', 'White British', 45, 'Employees', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440079', '750e8400-e29b-41d4-a716-446655440052', 'Asian', 22, 'Employees', '#F472B6', 2),
('850e8400-e29b-41d4-a716-446655440080', '750e8400-e29b-41d4-a716-446655440052', 'Black', 12, 'Employees', '#FBCFE8', 3),
('850e8400-e29b-41d4-a716-446655440081', '750e8400-e29b-41d4-a716-446655440052', 'Mixed', 8, 'Employees', '#FDF2F8', 4),
('850e8400-e29b-41d4-a716-446655440082', '750e8400-e29b-41d4-a716-446655440052', 'Other', 13, 'Employees', '#DB2777', 5);

-- =====================================================
-- 11. WELLBEING & SAFETY METRICS
-- =====================================================

-- Sick Days per Employee (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440053', '650e8400-e29b-41d4-a716-446655440009', 'sick_days_per_employee', 'Sick Days per Employee', 'Average annual sick days', 'small', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440053', '750e8400-e29b-41d4-a716-446655440053', 'number', 4.2, 5.0, 'down');

-- Workplace Incidents (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440054', '650e8400-e29b-41d4-a716-446655440009', 'workplace_incidents', 'Workplace Incidents', 'Year-to-date incidents', 'small', 2, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440054', '750e8400-e29b-41d4-a716-446655440054', 'number', 2, 0, 'down');

-- Mental Health Support Usage (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440055', '650e8400-e29b-41d4-a716-446655440009', 'mental_health_support', 'Mental Health Support Usage', 'Mental health services utilization', 'small', 3, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440055', '750e8400-e29b-41d4-a716-446655440055', 'percentage', 23.5, 25.0, 'up');

-- Wellness Program Participation (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440056', '650e8400-e29b-41d4-a716-446655440009', 'wellness_participation', 'Wellness Program Participation', 'Wellness program enrollment', 'small', 4, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440056', '750e8400-e29b-41d4-a716-446655440056', 'percentage', 67.8, 70.0, 'up');

-- Sick Days Trend (Time-Based)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440057', '650e8400-e29b-41d4-a716-446655440009', 'sick_days_trend', 'Sick Days Trend', 'Monthly sick day tracking', 'large', 5, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440057', '750e8400-e29b-41d4-a716-446655440057', 'line', 'month', 'Days', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, month, value, series_name, series_color) VALUES
('950e8400-e29b-41d4-a716-446655440065', '750e8400-e29b-41d4-a716-446655440057', 2024, 1, 185, 'Sick Days', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440066', '750e8400-e29b-41d4-a716-446655440057', 2024, 2, 198, 'Sick Days', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440067', '750e8400-e29b-41d4-a716-446655440057', 2024, 3, 172, 'Sick Days', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440068', '750e8400-e29b-41d4-a716-446655440057', 2024, 4, 165, 'Sick Days', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440069', '750e8400-e29b-41d4-a716-446655440057', 2024, 5, 158, 'Sick Days', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440070', '750e8400-e29b-41d4-a716-446655440057', 2024, 6, 148, 'Sick Days', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440071', '750e8400-e29b-41d4-a716-446655440057', 2024, 7, 142, 'Sick Days', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440072', '750e8400-e29b-41d4-a716-446655440057', 2024, 8, 138, 'Sick Days', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440073', '750e8400-e29b-41d4-a716-446655440057', 2024, 9, 155, 'Sick Days', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440074', '750e8400-e29b-41d4-a716-446655440057', 2024, 10, 168, 'Sick Days', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440075', '750e8400-e29b-41d4-a716-446655440057', 2024, 11, 175, 'Sick Days', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440076', '750e8400-e29b-41d4-a716-446655440057', 2024, 12, 162, 'Sick Days', '#EC4899');

-- Safety Incident Trend (Time-Based)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440058', '650e8400-e29b-41d4-a716-446655440009', 'safety_incident_trend', 'Safety Incident Trend', 'Monthly incident tracking', 'large', 6, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440058', '750e8400-e29b-41d4-a716-446655440058', 'bar', 'month', 'Incidents', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, month, value, series_name, series_color) VALUES
('950e8400-e29b-41d4-a716-446655440077', '750e8400-e29b-41d4-a716-446655440058', 2024, 1, 0, 'Incidents', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440078', '750e8400-e29b-41d4-a716-446655440058', 2024, 2, 0, 'Incidents', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440079', '750e8400-e29b-41d4-a716-446655440058', 2024, 3, 1, 'Incidents', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440080', '750e8400-e29b-41d4-a716-446655440058', 2024, 4, 0, 'Incidents', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440081', '750e8400-e29b-41d4-a716-446655440058', 2024, 5, 0, 'Incidents', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440082', '750e8400-e29b-41d4-a716-446655440058', 2024, 6, 0, 'Incidents', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440083', '750e8400-e29b-41d4-a716-446655440058', 2024, 7, 1, 'Incidents', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440084', '750e8400-e29b-41d4-a716-446655440058', 2024, 8, 0, 'Incidents', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440085', '750e8400-e29b-41d4-a716-446655440058', 2024, 9, 0, 'Incidents', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440086', '750e8400-e29b-41d4-a716-446655440058', 2024, 10, 0, 'Incidents', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440087', '750e8400-e29b-41d4-a716-446655440058', 2024, 11, 0, 'Incidents', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440088', '750e8400-e29b-41d4-a716-446655440058', 2024, 12, 0, 'Incidents', '#EC4899');

-- EAP Usage by Category (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440059', '650e8400-e29b-41d4-a716-446655440009', 'eap_usage', 'Employee Assistance Program Usage', 'EAP utilization by category', 'medium', 7, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440059', '750e8400-e29b-41d4-a716-446655440059', 'bar', 'Category', 'Usage', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440083', '750e8400-e29b-41d4-a716-446655440059', 'Mental Health', 45, 'Sessions', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440084', '750e8400-e29b-41d4-a716-446655440059', 'Financial', 28, 'Sessions', '#EC4899', 2),
('850e8400-e29b-41d4-a716-446655440085', '750e8400-e29b-41d4-a716-446655440059', 'Legal', 15, 'Sessions', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440086', '750e8400-e29b-41d4-a716-446655440059', 'Family Support', 22, 'Sessions', '#EC4899', 4),
('850e8400-e29b-41d4-a716-446655440087', '750e8400-e29b-41d4-a716-446655440059', 'Career Counseling', 18, 'Sessions', '#EC4899', 5);

-- =====================================================
-- 12. WORKFORCE PLANNING METRICS
-- =====================================================

-- Critical Roles Filled (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440060', '650e8400-e29b-41d4-a716-446655440010', 'critical_roles_filled', 'Critical Roles Filled', 'Percentage of filled critical positions', 'small', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440060', '750e8400-e29b-41d4-a716-446655440060', 'percentage', 94.5, 95.0, 'up');

-- Succession Readiness (Single Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440061', '650e8400-e29b-41d4-a716-446655440010', 'succession_readiness', 'Succession Readiness', 'Succession plan preparedness', 'small', 2, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('750e8400-e29b-41d4-a716-446655440061', '750e8400-e29b-41d4-a716-446655440061', 'percentage', 68.3, 75.0, 'up');

-- Bench Strength by Department (Multi-Value)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440062', '650e8400-e29b-41d4-a716-446655440010', 'bench_strength', 'Bench Strength', 'Ready-now successors per department', 'large', 3, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440062', '750e8400-e29b-41d4-a716-446655440062', 'bar', 'Department', 'Readiness %', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440088', '750e8400-e29b-41d4-a716-446655440062', 'Design', 75, 'Readiness', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440089', '750e8400-e29b-41d4-a716-446655440062', 'Marketing', 72, 'Readiness', '#EC4899', 2),
('850e8400-e29b-41d4-a716-446655440090', '750e8400-e29b-41d4-a716-446655440062', 'Finance', 70, 'Readiness', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440091', '750e8400-e29b-41d4-a716-446655440062', 'Sales', 68, 'Readiness', '#EC4899', 4),
('850e8400-e29b-41d4-a716-446655440092', '750e8400-e29b-41d4-a716-446655440062', 'Operations', 66, 'Readiness', '#EC4899', 5),
('850e8400-e29b-41d4-a716-446655440093', '750e8400-e29b-41d4-a716-446655440062', 'Production', 65, 'Readiness', '#EC4899', 6),
('850e8400-e29b-41d4-a716-446655440094', '750e8400-e29b-41d4-a716-446655440062', 'IT', 64, 'Readiness', '#EC4899', 7),
('850e8400-e29b-41d4-a716-446655440095', '750e8400-e29b-41d4-a716-446655440062', 'HR', 72, 'Readiness', '#EC4899', 8);

-- Future Headcount Forecast (Time-Based)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440063', '650e8400-e29b-41d4-a716-446655440010', 'headcount_forecast', 'Future Headcount Forecast', '12-month headcount projection', 'large', 4, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440063', '750e8400-e29b-41d4-a716-446655440063', 'line', 'month', 'Projected Headcount', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, month, value, series_name, series_color) VALUES
('950e8400-e29b-41d4-a716-446655440089', '750e8400-e29b-41d4-a716-446655440063', 2025, 1, 492, 'Forecast', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440090', '750e8400-e29b-41d4-a716-446655440063', 2025, 2, 496, 'Forecast', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440091', '750e8400-e29b-41d4-a716-446655440063', 2025, 3, 502, 'Forecast', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440092', '750e8400-e29b-41d4-a716-446655440063', 2025, 4, 508, 'Forecast', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440093', '750e8400-e29b-41d4-a716-446655440063', 2025, 5, 514, 'Forecast', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440094', '750e8400-e29b-41d4-a716-446655440063', 2025, 6, 520, 'Forecast', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440095', '750e8400-e29b-41d4-a716-446655440063', 2025, 7, 527, 'Forecast', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440096', '750e8400-e29b-41d4-a716-446655440063', 2025, 8, 533, 'Forecast', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440097', '750e8400-e29b-41d4-a716-446655440063', 2025, 9, 540, 'Forecast', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440098', '750e8400-e29b-41d4-a716-446655440063', 2025, 10, 546, 'Forecast', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440099', '750e8400-e29b-41d4-a716-446655440063', 2025, 11, 552, 'Forecast', '#EC4899'),
('950e8400-e29b-41d4-a716-446655440100', '750e8400-e29b-41d4-a716-446655440063', 2025, 12, 558, 'Forecast', '#EC4899');

-- Skills Gap Analysis (Multi-Value - Radar)
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('750e8400-e29b-41d4-a716-446655440064', '650e8400-e29b-41d4-a716-446655440010', 'skills_gap_analysis', 'Skills Gap Analysis', 'Critical skill area assessment', 'large', 5, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('750e8400-e29b-41d4-a716-446655440064', '750e8400-e29b-41d4-a716-446655440064', 'radar', 'Skill Area', 'Proficiency %', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order) VALUES
('850e8400-e29b-41d4-a716-446655440096', '750e8400-e29b-41d4-a716-446655440064', 'Design Innovation', 85, 'Current', '#EC4899', 1),
('850e8400-e29b-41d4-a716-446655440097', '750e8400-e29b-41d4-a716-446655440064', 'Digital Marketing', 72, 'Current', '#EC4899', 2),
('850e8400-e29b-41d4-a716-446655440098', '750e8400-e29b-41d4-a716-446655440064', 'Data Analytics', 68, 'Current', '#EC4899', 3),
('850e8400-e29b-41d4-a716-446655440099', '750e8400-e29b-41d4-a716-446655440064', 'Supply Chain', 78, 'Current', '#EC4899', 4),
('850e8400-e29b-41d4-a716-446655440100', '750e8400-e29b-41d4-a716-446655440064', 'Leadership', 74, 'Current', '#EC4899', 5),
('850e8400-e29b-41d4-a716-446655440101', '750e8400-e29b-41d4-a716-446655440064', 'E-commerce', 70, 'Current', '#EC4899', 6);

-- =====================================================
-- SUMMARY
-- =====================================================
-- Cockpit: Human Resources (1)
-- Sections: 10
-- Metrics: 64 total
--   - Single Value: 28
--   - Multi-Value: 20
--   - Time-Based: 16
-- Data Points: 350+
-- Tailored to Jellycat's creative, design-led manufacturing business