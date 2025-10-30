-- Insert metrics for Site Operations, Resource Management, and Safety & Compliance sections

-- SITE OPERATIONS (650e8400-e29b-41d4-a716-446655440012)
-- Metric 1: Equipment Utilization
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('11111111-1111-1111-1111-111111111111', '650e8400-e29b-41d4-a716-446655440012', 'equipment_utilization', 'Equipment Utilization', 'Current equipment usage across all construction sites', 'medium', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('11111111-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'percentage', 78.5, 85.0, 'up');

-- Metric 2: Active Work Orders
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('22222222-1111-1111-1111-111111111111', '650e8400-e29b-41d4-a716-446655440012', 'active_work_orders', 'Active Work Orders', 'Distribution of work orders by current status', 'large', 2, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('22222222-2222-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', 'bar', 'Status', 'Count', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order)
VALUES
  ('22222222-3333-1111-1111-111111111111', '22222222-2222-1111-1111-111111111111', 'In Progress', 45, 'Work Orders', '#3B82F6', 1),
  ('22222222-4444-1111-1111-111111111111', '22222222-2222-1111-1111-111111111111', 'Pending', 23, 'Work Orders', '#F59E0B', 2),
  ('22222222-5555-1111-1111-111111111111', '22222222-2222-1111-1111-111111111111', 'Completed', 87, 'Work Orders', '#10B981', 3),
  ('22222222-6666-1111-1111-111111111111', '22222222-2222-1111-1111-111111111111', 'On Hold', 12, 'Work Orders', '#EF4444', 4);

-- Metric 3: Site Productivity Trend
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('33333333-1111-1111-1111-111111111111', '650e8400-e29b-41d4-a716-446655440012', 'site_productivity_trend', 'Site Productivity Trend', 'Monthly productivity metrics across construction sites', 'xl', 3, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('33333333-2222-1111-1111-111111111111', '33333333-1111-1111-1111-111111111111', 'line', 'month', 'Productivity Score', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, month, value, series_name, series_color)
VALUES
  ('33333333-3333-1111-1111-111111111111', '33333333-2222-1111-1111-111111111111', 2025, 4, 72.3, 'Productivity', '#3B82F6'),
  ('33333333-4444-1111-1111-111111111111', '33333333-2222-1111-1111-111111111111', 2025, 5, 75.8, 'Productivity', '#3B82F6'),
  ('33333333-5555-1111-1111-111111111111', '33333333-2222-1111-1111-111111111111', 2025, 6, 78.2, 'Productivity', '#3B82F6'),
  ('33333333-6666-1111-1111-111111111111', '33333333-2222-1111-1111-111111111111', 2025, 7, 81.5, 'Productivity', '#3B82F6'),
  ('33333333-7777-1111-1111-111111111111', '33333333-2222-1111-1111-111111111111', 2025, 8, 83.7, 'Productivity', '#3B82F6'),
  ('33333333-8888-1111-1111-111111111111', '33333333-2222-1111-1111-111111111111', 2025, 9, 85.4, 'Productivity', '#3B82F6');

-- RESOURCE MANAGEMENT (650e8400-e29b-41d4-a716-446655440013)
-- Metric 4: Workforce Allocation
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('44444444-1111-1111-1111-111111111111', '650e8400-e29b-41d4-a716-446655440013', 'workforce_allocation', 'Workforce Allocation', 'Current workforce deployment vs available capacity', 'medium', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('44444444-2222-1111-1111-111111111111', '44444444-1111-1111-1111-111111111111', 'percentage', 92.3, 95.0, 'up');

-- Metric 5: Material Inventory Levels
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('55555555-1111-1111-1111-111111111111', '650e8400-e29b-41d4-a716-446655440013', 'material_inventory', 'Material Inventory Levels', 'Current stock levels of key construction materials', 'large', 2, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('55555555-2222-1111-1111-111111111111', '55555555-1111-1111-1111-111111111111', 'bar', 'Material', 'Stock Level (%)', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order)
VALUES
  ('55555555-3333-1111-1111-111111111111', '55555555-2222-1111-1111-111111111111', 'Concrete', 85, 'Stock', '#3B82F6', 1),
  ('55555555-4444-1111-1111-111111111111', '55555555-2222-1111-1111-111111111111', 'Steel', 72, 'Stock', '#F59E0B', 2),
  ('55555555-5555-1111-1111-111111111111', '55555555-2222-1111-1111-111111111111', 'Lumber', 45, 'Stock', '#EF4444', 3),
  ('55555555-6666-1111-1111-111111111111', '55555555-2222-1111-1111-111111111111', 'Cement', 91, 'Stock', '#10B981', 4),
  ('55555555-7777-1111-1111-111111111111', '55555555-2222-1111-1111-111111111111', 'Rebar', 68, 'Stock', '#F59E0B', 5);

-- Metric 6: Resource Cost Trend
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('66666666-1111-1111-1111-111111111111', '650e8400-e29b-41d4-a716-446655440013', 'resource_cost_trend', 'Resource Cost Trend', 'Monthly resource and material costs', 'xl', 3, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('66666666-2222-1111-1111-111111111111', '66666666-1111-1111-1111-111111111111', 'line', 'month', 'Cost ($1000s)', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, month, value, series_name, series_color)
VALUES
  ('66666666-3333-1111-1111-111111111111', '66666666-2222-1111-1111-111111111111', 2025, 4, 245, 'Cost', '#3B82F6'),
  ('66666666-4444-1111-1111-111111111111', '66666666-2222-1111-1111-111111111111', 2025, 5, 258, 'Cost', '#3B82F6'),
  ('66666666-5555-1111-1111-111111111111', '66666666-2222-1111-1111-111111111111', 2025, 6, 267, 'Cost', '#3B82F6'),
  ('66666666-6666-1111-1111-111111111111', '66666666-2222-1111-1111-111111111111', 2025, 7, 272, 'Cost', '#3B82F6'),
  ('66666666-7777-1111-1111-111111111111', '66666666-2222-1111-1111-111111111111', 2025, 8, 281, 'Cost', '#3B82F6'),
  ('66666666-8888-1111-1111-111111111111', '66666666-2222-1111-1111-111111111111', 2025, 9, 289, 'Cost', '#3B82F6');

-- SAFETY & COMPLIANCE (650e8400-e29b-41d4-a716-446655440015)
-- Metric 7: Safety Incident Rate
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('77777777-1111-1111-1111-111111111111', '650e8400-e29b-41d4-a716-446655440015', 'safety_incident_rate', 'Safety Incident Rate', 'Incidents per 1000 working hours', 'medium', 1, true);

INSERT INTO public.metric_single_value (id, base_metric_id, metric_type, actual_value, target_value, trend)
VALUES ('77777777-2222-1111-1111-111111111111', '77777777-1111-1111-1111-111111111111', 'number', 1.8, 2.0, 'down');

-- Metric 8: Safety Inspections
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('88888888-1111-1111-1111-111111111111', '650e8400-e29b-41d4-a716-446655440015', 'safety_inspections', 'Safety Inspections', 'Results of recent safety inspections', 'large', 2, true);

INSERT INTO public.metric_multi_value (id, base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('88888888-2222-1111-1111-111111111111', '88888888-1111-1111-1111-111111111111', 'bar', 'Result', 'Count', false);

INSERT INTO public.metric_multi_value_data (id, multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order)
VALUES
  ('88888888-3333-1111-1111-111111111111', '88888888-2222-1111-1111-111111111111', 'Passed', 42, 'Inspections', '#10B981', 1),
  ('88888888-4444-1111-1111-111111111111', '88888888-2222-1111-1111-111111111111', 'Minor Issues', 8, 'Inspections', '#F59E0B', 2),
  ('88888888-5555-1111-1111-111111111111', '88888888-2222-1111-1111-111111111111', 'Major Issues', 3, 'Inspections', '#EF4444', 3);

-- Metric 9: Compliance Score Trend
INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active)
VALUES ('99999999-1111-1111-1111-111111111111', '650e8400-e29b-41d4-a716-446655440015', 'compliance_score_trend', 'Compliance Score Trend', 'Monthly safety and regulatory compliance scores', 'xl', 3, true);

INSERT INTO public.metric_time_based (id, base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES ('99999999-2222-1111-1111-111111111111', '99999999-1111-1111-1111-111111111111', 'area', 'month', 'Compliance Score (%)', false);

INSERT INTO public.metric_time_based_data (id, time_metric_id, year, month, value, series_name, series_color)
VALUES
  ('99999999-3333-1111-1111-111111111111', '99999999-2222-1111-1111-111111111111', 2025, 4, 88.5, 'Compliance', '#10B981'),
  ('99999999-4444-1111-1111-111111111111', '99999999-2222-1111-1111-111111111111', 2025, 5, 91.2, 'Compliance', '#10B981'),
  ('99999999-5555-1111-1111-111111111111', '99999999-2222-1111-1111-111111111111', 2025, 6, 93.8, 'Compliance', '#10B981'),
  ('99999999-6666-1111-1111-111111111111', '99999999-2222-1111-1111-111111111111', 2025, 7, 94.5, 'Compliance', '#10B981'),
  ('99999999-7777-1111-1111-111111111111', '99999999-2222-1111-1111-111111111111', 2025, 8, 95.1, 'Compliance', '#10B981'),
  ('99999999-8888-1111-1111-111111111111', '99999999-2222-1111-1111-111111111111', 2025, 9, 96.3, 'Compliance', '#10B981');