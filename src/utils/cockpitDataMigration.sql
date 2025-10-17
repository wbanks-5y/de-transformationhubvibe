
-- Delete all existing cockpit data
DELETE FROM cockpit_metric_multi_values;
DELETE FROM cockpit_metric_multi_value_config;
DELETE FROM cockpit_metric_data;
DELETE FROM cockpit_kpi_values;
DELETE FROM cockpit_kpis;
DELETE FROM cockpit_metrics;
DELETE FROM cockpit_insights;
DELETE FROM cockpit_sections;
DELETE FROM cockpit_filters;
DELETE FROM cockpit_types;

-- Create Projects Cockpit Type
INSERT INTO cockpit_types (id, name, display_name, description, cockpit_description, icon, color_class, route_path, sort_order, is_active)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'projects',
  'Projects Cockpit',
  'Project management and delivery tracking',
  'The Projects Cockpit provides real-time visibility into project status, resource allocation, budget consumption, and delivery timelines. Monitor active projects, track milestones, and identify risks before they impact delivery.',
  'folder',
  'bg-blue-500',
  '/cockpits/projects',
  1,
  true
);

-- Create Sections
INSERT INTO cockpit_sections (id, cockpit_type_id, name, display_name, description, sort_order, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'overview', 'Project Overview', 'High-level project metrics and status', 1, true),
('550e8400-e29b-41d4-a716-446655440002', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'performance', 'Performance Metrics', 'Project performance and delivery indicators', 2, true),
('550e8400-e29b-41d4-a716-446655440003', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'resources', 'Resource Management', 'Team allocation and utilization tracking', 3, true),
('550e8400-e29b-41d4-a716-446655440004', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'financials', 'Budget & Financials', 'Budget consumption and cost tracking', 4, true);

-- Create Metrics
INSERT INTO cockpit_metrics (id, section_id, name, display_name, description, metric_type, current_value, target_value, trend, icon, color_class, sort_order, size_config, chart_data, additional_data, is_active) VALUES
-- Overview Section Metrics
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'active_projects', 'Active Projects', 'Total number of currently active projects', 'number', '32', '35', 'up', 'folder', 'text-blue-600', 1, 'medium', '[{"name": "Projects", "color": "#3B82F6", "data": [{"name": "Jan", "value": 28, "timestamp": "2024-01-01"}, {"name": "Feb", "value": 30, "timestamp": "2024-02-01"}, {"name": "Mar", "value": 29, "timestamp": "2024-03-01"}, {"name": "Apr", "value": 31, "timestamp": "2024-04-01"}, {"name": "May", "value": 32, "timestamp": "2024-05-01"}]}]', '{"dataType": "multiple", "chartType": "line"}', true),

('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'project_status', 'Project Health Status', 'Distribution of project health status', 'chart', null, null, 'neutral', 'activity', 'text-green-600', 2, 'large', '[{"name": "On Track", "color": "#10B981", "data": [{"name": "On Track", "value": 80}, {"name": "At Risk", "value": 15}, {"name": "Delayed", "value": 5}]}]', '{"dataType": "multiple", "chartType": "bar"}', true),

('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'at_risk_projects', 'At-Risk Projects', 'Projects requiring immediate attention', 'chart', null, null, 'down', 'alert-triangle', 'text-red-600', 3, 'large', null, '{"dataType": "multiple", "chartType": "multi_value"}', true),

-- Performance Section Metrics  
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'on_time_delivery', 'On-Time Delivery', 'Percentage of projects delivered on schedule', 'percentage', '80', '90', 'up', 'clock', 'text-green-600', 1, 'medium', '[{"name": "Delivery Rate", "color": "#10B981", "data": [{"name": "Q1", "value": 75, "timestamp": "2024-01-01"}, {"name": "Q2", "value": 78, "timestamp": "2024-04-01"}, {"name": "Q3", "value": 80, "timestamp": "2024-07-01"}]}]', '{"dataType": "multiple", "chartType": "area"}', true),

('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'milestone_completion', 'Milestone Hit Rate', 'Percentage of milestones completed on time', 'percentage', '87', '95', 'down', 'target', 'text-orange-600', 2, 'medium', '[{"name": "Milestones", "color": "#F59E0B", "data": [{"name": "Week 1", "value": 90, "timestamp": "2024-05-01"}, {"name": "Week 2", "value": 85, "timestamp": "2024-05-08"}, {"name": "Week 3", "value": 88, "timestamp": "2024-05-15"}, {"name": "Week 4", "value": 87, "timestamp": "2024-05-22"}]}]', '{"dataType": "multiple", "chartType": "line"}', true),

('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'velocity_trend', 'Team Velocity', 'Story points completed per sprint', 'number', '142', '150', 'up', 'trending-up', 'text-blue-600', 3, 'large', '[{"name": "Story Points", "color": "#3B82F6", "data": [{"name": "Sprint 1", "value": 135, "timestamp": "2024-04-01"}, {"name": "Sprint 2", "value": 140, "timestamp": "2024-04-15"}, {"name": "Sprint 3", "value": 138, "timestamp": "2024-05-01"}, {"name": "Sprint 4", "value": 142, "timestamp": "2024-05-15"}]}]', '{"dataType": "multiple", "chartType": "bar"}', true),

-- Resources Section Metrics
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'resource_utilization', 'Resource Utilization', 'Overall team utilization rate', 'percentage', '85', '80', 'up', 'users', 'text-purple-600', 1, 'medium', '[{"name": "Utilization", "color": "#8B5CF6", "data": [{"name": "Development", "value": 90}, {"name": "Design", "value": 75}, {"name": "QA", "value": 85}, {"name": "DevOps", "value": 80}]}]', '{"dataType": "multiple", "chartType": "bar"}', true),

('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'team_capacity', 'Team Capacity', 'Available vs allocated capacity', 'chart', null, null, 'neutral', 'user-check', 'text-indigo-600', 2, 'large', '[{"name": "Available", "color": "#10B981", "data": [{"name": "Mon", "value": 8}, {"name": "Tue", "value": 8}, {"name": "Wed", "value": 6}, {"name": "Thu", "value": 8}, {"name": "Fri", "value": 7}]}, {"name": "Allocated", "color": "#EF4444", "data": [{"name": "Mon", "value": 7}, {"name": "Tue", "value": 8}, {"name": "Wed", "value": 6}, {"name": "Thu", "value": 9}, {"name": "Fri", "value": 6}]}]', '{"dataType": "multiple", "chartType": "line"}', true),

-- Financials Section Metrics
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', 'budget_consumption', 'Budget Consumption', 'Total budget utilized across all projects', 'currency', '1468000', '1600000', 'neutral', 'dollar-sign', 'text-green-600', 1, 'medium', '[{"name": "Budget", "color": "#10B981", "data": [{"name": "Q1", "value": 350000, "timestamp": "2024-01-01"}, {"name": "Q2", "value": 720000, "timestamp": "2024-04-01"}, {"name": "Q3", "value": 1100000, "timestamp": "2024-07-01"}, {"name": "Q4", "value": 1468000, "timestamp": "2024-10-01"}]}]', '{"dataType": "multiple", "chartType": "area"}', true),

('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'cost_per_project', 'Average Cost per Project', 'Mean project cost across active projects', 'currency', '45875', '50000', 'down', 'calculator', 'text-blue-600', 2, 'medium', '[{"name": "Cost", "color": "#3B82F6", "data": [{"name": "Jan", "value": 52000, "timestamp": "2024-01-01"}, {"name": "Feb", "value": 48000, "timestamp": "2024-02-01"}, {"name": "Mar", "value": 47000, "timestamp": "2024-03-01"}, {"name": "Apr", "value": 46000, "timestamp": "2024-04-01"}, {"name": "May", "value": 45875, "timestamp": "2024-05-01"}]}]', '{"dataType": "multiple", "chartType": "line"}', true),

('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', 'project_budgets', 'Project Budget Status', 'Individual project budget consumption', 'chart', null, null, 'neutral', 'pie-chart', 'text-orange-600', 3, 'large', '[{"name": "Alpha", "color": "#3B82F6", "data": [{"name": "Consumed", "value": 79}, {"name": "Remaining", "value": 21}]}, {"name": "Beta", "color": "#10B981", "data": [{"name": "Consumed", "value": 92}, {"name": "Remaining", "value": 8}]}, {"name": "Gamma", "color": "#F59E0B", "data": [{"name": "Consumed", "value": 93}, {"name": "Remaining", "value": 7}]}]', '{"dataType": "multiple", "chartType": "bar"}', true);

-- Create Multi-Value Configuration for At-Risk Projects
INSERT INTO cockpit_metric_multi_value_config (metric_id, alert_message, alert_type, show_progress, show_status) 
VALUES ('660e8400-e29b-41d4-a716-446655440003', '3 projects have critical issues that may impact delivery dates', 'critical', true, true);

-- Create Multi-Value Items for At-Risk Projects
INSERT INTO cockpit_metric_multi_values (metric_id, item_id, name, progress, status, status_color, description, sort_order, is_active) VALUES
('660e8400-e29b-41d4-a716-446655440003', 'delta-impl', 'Delta Implementation', 65, '4 days behind', 'text-red-600', 'Critical path dependency causing delays', 1, true),
('660e8400-e29b-41d4-a716-446655440003', 'ui-redesign', 'UI Redesign', 48, 'At risk', 'text-orange-600', 'Resource constraints affecting timeline', 2, true),
('660e8400-e29b-41d4-a716-446655440003', 'api-integration', 'API Integration', 72, '2 days behind', 'text-red-600', 'Third-party API changes causing rework', 3, true),
('660e8400-e29b-41d4-a716-446655440003', 'mobile-app', 'Mobile App Release', 85, 'On track', 'text-green-600', 'Testing phase proceeding as planned', 4, true),
('660e8400-e29b-41d4-a716-446655440003', 'data-migration', 'Data Migration', 35, 'Blocked', 'text-red-600', 'Waiting for security approval', 5, true);

-- Create KPIs  
INSERT INTO cockpit_kpis (id, cockpit_type_id, name, display_name, description, calculation_type, source_metrics, target_value, trend_direction, format_type, format_options, icon, color_class, sort_order, size_config, is_active) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'project_success_rate', 'Project Success Rate', 'Percentage of projects delivered on time and within budget', 'custom', '["660e8400-e29b-41d4-a716-446655440004"]', 90, 'higher_is_better', 'percentage', '{}', 'trophy', 'text-green-600', 1, 'medium', true),

('770e8400-e29b-41d4-a716-446655440002', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'team_productivity', 'Team Productivity', 'Story points delivered per team member per sprint', 'average', '["660e8400-e29b-41d4-a716-446655440006"]', 25, 'higher_is_better', 'number', '{}', 'zap', 'text-blue-600', 2, 'medium', true),

('770e8400-e29b-41d4-a716-446655440003', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'budget_efficiency', 'Budget Efficiency', 'Ratio of delivered value to budget consumed', 'custom', '["660e8400-e29b-41d4-a716-446655440009"]', 1.2, 'higher_is_better', 'number', '{"suffix": "x"}', 'trending-up', 'text-purple-600', 3, 'medium', true),

('770e8400-e29b-41d4-a716-446655440004', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'resource_optimization', 'Resource Optimization', 'Optimal utilization without overallocation', 'average', '["660e8400-e29b-41d4-a716-446655440007"]', 85, 'higher_is_better', 'percentage', '{}', 'users', 'text-indigo-600', 4, 'medium', true),

('770e8400-e29b-41d4-a716-446655440005', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'delivery_velocity', 'Delivery Velocity', 'Average time from project start to delivery', 'average', '["660e8400-e29b-41d4-a716-446655440005"]', 12, 'lower_is_better', 'number', '{"suffix": " weeks"}', 'clock', 'text-orange-600', 5, 'medium', true),

('770e8400-e29b-41d4-a716-446655440006', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'client_satisfaction', 'Client Satisfaction', 'Average client satisfaction score across projects', 'average', '[]', 4.2, 'higher_is_better', 'number', '{"suffix": "/5.0"}', 'heart', 'text-pink-600', 6, 'medium', true);

-- Create Insights with correct categories  
INSERT INTO cockpit_insights (id, cockpit_type_id, title, description, insight_type, priority, insight_category, confidence_score, source_data_ids, insight_data, is_active) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Resource Bottleneck Detected', 'Frontend development team is overallocated by 20% for the next two weeks. Consider redistributing tasks or bringing in additional resources to prevent project delays.', 'risk', 'high', 'general', 0.85, '["660e8400-e29b-41d4-a716-446655440007"]', '{"affected_projects": ["Delta Implementation", "UI Redesign"], "recommended_actions": ["Redistribute 15 story points", "Consider contractor support"]}', true),

('880e8400-e29b-41d4-a716-446655440002', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Milestone Optimization Opportunity', 'Current milestone sequence can be optimized to reduce project duration by 8 days. Parallel execution of independent tasks in Alpha and Gamma projects is possible.', 'optimization', 'medium', 'general', 0.78, '["660e8400-e29b-41d4-a716-446655440005"]', '{"time_savings": "8 days", "affected_projects": ["Alpha", "Gamma"], "optimization_type": "parallel_execution"}', true),

('880e8400-e29b-41d4-a716-446655440003', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Budget Reallocation Recommended', 'Alpha project is 10% under budget with 75% completion. Consider reallocating $12,500 to at-risk projects to prevent timeline delays.', 'opportunity', 'medium', 'general', 0.82, '["660e8400-e29b-41d4-a716-446655440009"]', '{"source_project": "Alpha", "amount": 12500, "target_projects": ["Delta Implementation", "UI Redesign"]}', true),

('880e8400-e29b-41d4-a716-446655440004', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Quality Gate Implementation', 'Projects with early quality gate implementation show 23% fewer post-delivery issues. Recommend implementing automated quality checks for all new projects.', 'opportunity', 'low', 'general', 0.91, '["660e8400-e29b-41d4-a716-446655440005"]', '{"improvement": "23% reduction", "implementation_effort": "2 weeks", "affected_metrics": ["defect_rate", "client_satisfaction"]}', true),

('880e8400-e29b-41d4-a716-446655440005', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Critical Dependency Risk', 'Data Migration project is blocked waiting for security approval. This affects 3 downstream projects and may cause cascading delays of up to 2 weeks.', 'alert', 'critical', 'general', 0.95, '["660e8400-e29b-41d4-a716-446655440003"]', '{"blocked_project": "Data Migration", "downstream_impact": 3, "potential_delay": "2 weeks", "escalation_required": true}', true),

('880e8400-e29b-41d4-a716-446655440006', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Team Velocity Trending Up', 'Development team velocity has increased 12% over the last 4 sprints. This positive trend suggests improved processes and team maturity.', 'opportunity', 'low', 'general', 0.73, '["660e8400-e29b-41d4-a716-446655440006"]', '{"velocity_increase": "12%", "trend_period": "4 sprints", "contributing_factors": ["process_improvements", "team_experience"]}', true),

('880e8400-e29b-41d4-a716-446655440007', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Client Communication Gap', 'Projects with weekly client check-ins have 40% higher satisfaction scores. Consider implementing regular communication cadence for all projects.', 'optimization', 'medium', 'general', 0.87, '["770e8400-e29b-41d4-a716-446655440006"]', '{"satisfaction_improvement": "40%", "recommended_frequency": "weekly", "implementation_cost": "low"}', true),

('880e8400-e29b-41d4-a716-446655440008', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Technology Debt Accumulation', 'Beta project shows signs of increasing technical debt. Recommend allocating 20% of next sprint to refactoring to prevent future velocity decline.', 'risk', 'medium', 'general', 0.76, '["660e8400-e29b-41d4-a716-446655440006"]', '{"affected_project": "Beta", "recommended_allocation": "20%", "risk_level": "medium", "prevention_effort": "1 sprint"}', true);

-- Create sample metric data for time series
INSERT INTO cockpit_metric_data (metric_id, timestamp, value, metadata) VALUES
-- Active Projects data
('660e8400-e29b-41d4-a716-446655440001', '2024-01-01T00:00:00Z', 28, '{"period": "monthly"}'),
('660e8400-e29b-41d4-a716-446655440001', '2024-02-01T00:00:00Z', 30, '{"period": "monthly"}'),
('660e8400-e29b-41d4-a716-446655440001', '2024-03-01T00:00:00Z', 29, '{"period": "monthly"}'),
('660e8400-e29b-41d4-a716-446655440001', '2024-04-01T00:00:00Z', 31, '{"period": "monthly"}'),
('660e8400-e29b-41d4-a716-446655440001', '2024-05-01T00:00:00Z', 32, '{"period": "monthly"}'),

-- On-Time Delivery data
('660e8400-e29b-41d4-a716-446655440004', '2024-01-01T00:00:00Z', 75, '{"period": "quarterly"}'),
('660e8400-e29b-41d4-a716-446655440004', '2024-04-01T00:00:00Z', 78, '{"period": "quarterly"}'),
('660e8400-e29b-41d4-a716-446655440004', '2024-07-01T00:00:00Z', 80, '{"period": "quarterly"}'),

-- Resource Utilization data
('660e8400-e29b-41d4-a716-446655440007', '2024-05-01T00:00:00Z', 82, '{"department": "overall"}'),
('660e8400-e29b-41d4-a716-446655440007', '2024-05-08T00:00:00Z', 84, '{"department": "overall"}'),
('660e8400-e29b-41d4-a716-446655440007', '2024-05-15T00:00:00Z', 85, '{"department": "overall"}'),
('660e8400-e29b-41d4-a716-446655440007', '2024-05-22T00:00:00Z', 85, '{"department": "overall"}');
