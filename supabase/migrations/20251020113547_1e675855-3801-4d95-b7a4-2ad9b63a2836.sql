-- Construction Cockpit Data Migration (Final)
INSERT INTO public.cockpit_types (id, name, display_name, description, icon, color_class, route_path, cockpit_description, sort_order, is_active)
VALUES ('550e8400-e29b-41d4-a716-446655440010'::uuid,'construction','Construction','Construction project management, site performance, and resource tracking','building','bg-orange-500','/cockpit/construction','provides real-time visibility into project performance, site operations, resource utilization, financial metrics, and safety compliance for construction projects.',8,true);

INSERT INTO public.cockpit_sections (id, cockpit_type_id, name, display_name, description, sort_order, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440011'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'project_overview','Project Overview','High-level project health, progress, and financial metrics',1,true),
('650e8400-e29b-41d4-a716-446655440012'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'site_operations','Site Operations','Daily site activities, safety metrics, equipment utilization',2,true),
('650e8400-e29b-41d4-a716-446655440013'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'resource_management','Resource Management','Labor allocation, material tracking, subcontractor performance',3,true),
('650e8400-e29b-41d4-a716-446655440014'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'financial_performance','Financial Performance','Budget vs. actual, cost control, billing milestones',4,true),
('650e8400-e29b-41d4-a716-446655440015'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'safety_compliance','Safety & Compliance','Safety incidents, compliance checks, quality control',5,true);

INSERT INTO public.cockpit_kpis (id, cockpit_type_id, name, display_name, description, kpi_data_type, format_type, format_options, trend_direction, icon, color_class, size_config, weight, sort_order, is_active) VALUES
('750e8400-e29b-41d4-a716-446655440021'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'schedule_performance_index','Schedule Performance Index (SPI)','Measures schedule efficiency','single','number','{"decimal_places":2}','higher_is_better','calendar-clock','text-blue-600','medium',2.0,1,true),
('750e8400-e29b-41d4-a716-446655440022'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'cost_performance_index','Cost Performance Index (CPI)','Measures cost efficiency','single','number','{"decimal_places":2}','higher_is_better','trending-up','text-green-600','medium',2.0,2,true),
('750e8400-e29b-41d4-a716-446655440023'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'overall_project_completion','Overall Project Completion','Percentage of total project work completed','single','percentage','{"decimal_places":0}','higher_is_better','activity','text-purple-600','large',1.5,3,true),
('750e8400-e29b-41d4-a716-446655440024'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'equipment_utilization_rate','Equipment Utilization Rate','Percentage of equipment hours actively used','single','percentage','{"decimal_places":1}','higher_is_better','hard-hat','text-orange-600','medium',1.5,4,true),
('750e8400-e29b-41d4-a716-446655440033'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'days_since_last_incident','Days Since Last Incident','Consecutive days without lost-time incident','single','number','{"decimal_places":0}','higher_is_better','shield-check','text-green-600','medium',2.0,13,true),
('750e8400-e29b-41d4-a716-446655440034'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'safety_score','Safety Score','Composite safety performance score','single','number','{"decimal_places":0}','higher_is_better','shield','text-blue-600','medium',2.0,14,true);

INSERT INTO public.cockpit_kpi_values (kpi_id, current_value, recorded_at, notes) VALUES
('750e8400-e29b-41d4-a716-446655440021'::uuid,0.95,now(),'Slightly behind schedule'),
('750e8400-e29b-41d4-a716-446655440022'::uuid,1.02,now(),'Under budget'),
('750e8400-e29b-41d4-a716-446655440023'::uuid,67,now(),'Two-thirds complete'),
('750e8400-e29b-41d4-a716-446655440024'::uuid,78,now(),'Room for improvement'),
('750e8400-e29b-41d4-a716-446655440033'::uuid,127,now(),'Strong safety'),
('750e8400-e29b-41d4-a716-446655440034'::uuid,94,now(),'Excellent culture');

INSERT INTO public.cockpit_kpi_targets (kpi_id, target_type, target_value, is_active) VALUES
('750e8400-e29b-41d4-a716-446655440021'::uuid,'single',1.0,true),
('750e8400-e29b-41d4-a716-446655440022'::uuid,'single',1.0,true),
('750e8400-e29b-41d4-a716-446655440023'::uuid,'single',100,true),
('750e8400-e29b-41d4-a716-446655440024'::uuid,'single',85,true),
('750e8400-e29b-41d4-a716-446655440033'::uuid,'single',365,true),
('750e8400-e29b-41d4-a716-446655440034'::uuid,'single',95,true);

INSERT INTO public.metric_base (id, section_id, name, display_name, description, size_config, sort_order, is_active) VALUES
('850e8400-e29b-41d4-a716-446655440041'::uuid,'650e8400-e29b-41d4-a716-446655440011'::uuid,'multi_project_timeline','Multi-Project Timeline','Completion % over time','xl',1,true),
('850e8400-e29b-41d4-a716-446655440042'::uuid,'650e8400-e29b-41d4-a716-446655440011'::uuid,'project_portfolio_health','Project Portfolio Health','Health scores by project','large',2,true),
('850e8400-e29b-41d4-a716-446655440047'::uuid,'650e8400-e29b-41d4-a716-446655440014'::uuid,'budget_tracking','Budget Tracking','Planned vs actual spend','xl',1,true);

INSERT INTO public.metric_time_based (base_metric_id, chart_type, time_granularity, y_axis_label, allow_multiple_series)
VALUES
('850e8400-e29b-41d4-a716-446655440041'::uuid,'line','month','Completion %',true),
('850e8400-e29b-41d4-a716-446655440047'::uuid,'line','month','Amount ($)',true);

INSERT INTO public.metric_multi_value (base_metric_id, chart_type, x_axis_label, y_axis_label, allow_multiple_series)
VALUES ('850e8400-e29b-41d4-a716-446655440042'::uuid,'bar','Projects','Score',true);

INSERT INTO public.metric_time_based_data (time_metric_id, year, month, date_value, value, series_name, series_color)
SELECT mtb.id, 2024, 10, DATE '2024-10-01', 45, 'Northern Commercial', '#3B82F6'
FROM public.metric_time_based mtb WHERE mtb.base_metric_id = '850e8400-e29b-41d4-a716-446655440041'::uuid
UNION ALL
SELECT mtb.id, 2024, 11, DATE '2024-11-01', 58, 'Northern Commercial', '#3B82F6'
FROM public.metric_time_based mtb WHERE mtb.base_metric_id = '850e8400-e29b-41d4-a716-446655440041'::uuid
UNION ALL
SELECT mtb.id, 2024, 12, DATE '2024-12-01', 67, 'Northern Commercial', '#3B82F6'
FROM public.metric_time_based mtb WHERE mtb.base_metric_id = '850e8400-e29b-41d4-a716-446655440041'::uuid;

INSERT INTO public.metric_time_based_data (time_metric_id, year, month, date_value, value, series_name, series_color)
SELECT mtb.id, 2024, 10, DATE '2024-10-01', 2500000, 'Planned', '#3B82F6'
FROM public.metric_time_based mtb WHERE mtb.base_metric_id = '850e8400-e29b-41d4-a716-446655440047'::uuid
UNION ALL
SELECT mtb.id, 2024, 10, DATE '2024-10-01', 2350000, 'Actual', '#10B981'
FROM public.metric_time_based mtb WHERE mtb.base_metric_id = '850e8400-e29b-41d4-a716-446655440047'::uuid
UNION ALL
SELECT mtb.id, 2024, 11, DATE '2024-11-01', 5200000, 'Planned', '#3B82F6'
FROM public.metric_time_based mtb WHERE mtb.base_metric_id = '850e8400-e29b-41d4-a716-446655440047'::uuid
UNION ALL
SELECT mtb.id, 2024, 11, DATE '2024-11-01', 4980000, 'Actual', '#10B981'
FROM public.metric_time_based mtb WHERE mtb.base_metric_id = '850e8400-e29b-41d4-a716-446655440047'::uuid;

INSERT INTO public.metric_multi_value_data (multi_value_metric_id, x_axis_value, y_axis_value, series_name, series_color, sort_order)
SELECT mmv.id, 'Northern Commercial', 87, 'Schedule', '#3B82F6', 1
FROM public.metric_multi_value mmv WHERE mmv.base_metric_id = '850e8400-e29b-41d4-a716-446655440042'::uuid
UNION ALL
SELECT mmv.id, 'Northern Commercial', 92, 'Budget', '#10B981', 2
FROM public.metric_multi_value mmv WHERE mmv.base_metric_id = '850e8400-e29b-41d4-a716-446655440042'::uuid
UNION ALL
SELECT mmv.id, 'Airport Expansion', 95, 'Schedule', '#3B82F6', 3
FROM public.metric_multi_value mmv WHERE mmv.base_metric_id = '850e8400-e29b-41d4-a716-446655440042'::uuid;

-- Use allowed insight_type values: 'opportunity', 'risk', 'optimization', 'alert'
INSERT INTO public.cockpit_insights (id, cockpit_type_id, title, description, insight_type, priority, insight_category, confidence_score, is_active) VALUES
('950e8400-e29b-41d4-a716-446655440061'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'Project Schedule Risk','Northern Commercial project is 2 weeks behind schedule. Consider additional resources.','risk','high','general',0.85,true),
('950e8400-e29b-41d4-a716-446655440062'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'Budget Performance Optimization','Q4 projects are 3.2% under budget. Document best practices.','optimization','high','general',0.92,true),
('950e8400-e29b-41d4-a716-446655440063'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'Safety Achievement Alert','180 days without incident. Strong safety culture.','alert','high','general',1.0,true),
('950e8400-e29b-41d4-a716-446655440064'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'Equipment Utilization Opportunity','Excavation equipment showing 62% utilization. Consider reallocation.','opportunity','medium','general',0.78,true),
('950e8400-e29b-41d4-a716-446655440065'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'Material Price Alert','Steel prices increased 12%. Consider accelerating purchases.','alert','medium','general',0.88,true),
('950e8400-e29b-41d4-a716-446655440066'::uuid,'550e8400-e29b-41d4-a716-446655440010'::uuid,'Subcontractor Performance Risk','Elite Electrical missed 3 dates. Review meeting needed.','risk','medium','general',0.82,true);