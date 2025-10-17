-- Schema Split Migration Script
-- Execute this in Supabase SQL Editor to split configuration tables into config schema

-- Step 1: Create config schema
CREATE SCHEMA IF NOT EXISTS config;

-- Step 2: Move configuration tables to config schema
ALTER TABLE public.cockpit_types SET SCHEMA config;
ALTER TABLE public.cockpit_sections SET SCHEMA config;
ALTER TABLE public.cockpit_filters SET SCHEMA config;
ALTER TABLE public.cockpit_kpis SET SCHEMA config;
ALTER TABLE public.cockpit_kpi_formulas SET SCHEMA config;
ALTER TABLE public.metric_base SET SCHEMA config;
ALTER TABLE public.metric_multi_value SET SCHEMA config;
ALTER TABLE public.metric_time_based SET SCHEMA config;
ALTER TABLE public.strategic_scenarios SET SCHEMA config;
ALTER TABLE public.strategic_scenario_parameters SET SCHEMA config;
ALTER TABLE public.strategic_scenario_impact_categories SET SCHEMA config;
ALTER TABLE public.roles SET SCHEMA config;
ALTER TABLE public.business_processes SET SCHEMA config;
ALTER TABLE public.milestone_templates SET SCHEMA config;

-- Step 3: Update RLS policies for config schema tables
-- Cockpit types
ALTER TABLE config.cockpit_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.cockpit_types;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON config.cockpit_types;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON config.cockpit_types;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON config.cockpit_types;

CREATE POLICY "Enable read access for all users" ON config.cockpit_types FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.cockpit_types FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.cockpit_types FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.cockpit_types FOR DELETE USING (auth.role() = 'authenticated');

-- Cockpit sections
ALTER TABLE config.cockpit_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.cockpit_sections;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON config.cockpit_sections;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON config.cockpit_sections;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON config.cockpit_sections;

CREATE POLICY "Enable read access for all users" ON config.cockpit_sections FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.cockpit_sections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.cockpit_sections FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.cockpit_sections FOR DELETE USING (auth.role() = 'authenticated');

-- Cockpit filters
ALTER TABLE config.cockpit_filters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.cockpit_filters;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON config.cockpit_filters;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON config.cockpit_filters;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON config.cockpit_filters;

CREATE POLICY "Enable read access for all users" ON config.cockpit_filters FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.cockpit_filters FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.cockpit_filters FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.cockpit_filters FOR DELETE USING (auth.role() = 'authenticated');

-- Cockpit KPIs
ALTER TABLE config.cockpit_kpis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.cockpit_kpis;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON config.cockpit_kpis;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON config.cockpit_kpis;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON config.cockpit_kpis;

CREATE POLICY "Enable read access for all users" ON config.cockpit_kpis FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.cockpit_kpis FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.cockpit_kpis FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.cockpit_kpis FOR DELETE USING (auth.role() = 'authenticated');

-- Cockpit KPI formulas
ALTER TABLE config.cockpit_kpi_formulas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.cockpit_kpi_formulas;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON config.cockpit_kpi_formulas;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON config.cockpit_kpi_formulas;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON config.cockpit_kpi_formulas;

CREATE POLICY "Enable read access for all users" ON config.cockpit_kpi_formulas FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.cockpit_kpi_formulas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.cockpit_kpi_formulas FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.cockpit_kpi_formulas FOR DELETE USING (auth.role() = 'authenticated');

-- Metric base
ALTER TABLE config.metric_base ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.metric_base;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON config.metric_base;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON config.metric_base;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON config.metric_base;

CREATE POLICY "Enable read access for all users" ON config.metric_base FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.metric_base FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.metric_base FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.metric_base FOR DELETE USING (auth.role() = 'authenticated');

-- Continue with remaining tables...
-- Metric multi value
ALTER TABLE config.metric_multi_value ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.metric_multi_value;
CREATE POLICY "Enable read access for all users" ON config.metric_multi_value FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.metric_multi_value FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.metric_multi_value FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.metric_multi_value FOR DELETE USING (auth.role() = 'authenticated');

-- Metric time based
ALTER TABLE config.metric_time_based ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.metric_time_based;
CREATE POLICY "Enable read access for all users" ON config.metric_time_based FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.metric_time_based FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.metric_time_based FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.metric_time_based FOR DELETE USING (auth.role() = 'authenticated');

-- Strategic scenarios
ALTER TABLE config.strategic_scenarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.strategic_scenarios;
CREATE POLICY "Enable read access for all users" ON config.strategic_scenarios FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.strategic_scenarios FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.strategic_scenarios FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.strategic_scenarios FOR DELETE USING (auth.role() = 'authenticated');

-- Strategic scenario parameters
ALTER TABLE config.strategic_scenario_parameters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.strategic_scenario_parameters;
CREATE POLICY "Enable read access for all users" ON config.strategic_scenario_parameters FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.strategic_scenario_parameters FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.strategic_scenario_parameters FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.strategic_scenario_parameters FOR DELETE USING (auth.role() = 'authenticated');

-- Strategic scenario impact categories
ALTER TABLE config.strategic_scenario_impact_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.strategic_scenario_impact_categories;
CREATE POLICY "Enable read access for all users" ON config.strategic_scenario_impact_categories FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.strategic_scenario_impact_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.strategic_scenario_impact_categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.strategic_scenario_impact_categories FOR DELETE USING (auth.role() = 'authenticated');

-- Roles
ALTER TABLE config.roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.roles;
CREATE POLICY "Enable read access for all users" ON config.roles FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.roles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.roles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.roles FOR DELETE USING (auth.role() = 'authenticated');

-- Business processes
ALTER TABLE config.business_processes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.business_processes;
CREATE POLICY "Enable read access for all users" ON config.business_processes FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.business_processes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.business_processes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.business_processes FOR DELETE USING (auth.role() = 'authenticated');

-- Milestone templates
ALTER TABLE config.milestone_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON config.milestone_templates;
CREATE POLICY "Enable read access for all users" ON config.milestone_templates FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON config.milestone_templates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON config.milestone_templates FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON config.milestone_templates FOR DELETE USING (auth.role() = 'authenticated');

-- Step 4: Grant permissions
GRANT USAGE ON SCHEMA config TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA config TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA config TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA config TO anon, authenticated;

-- Step 5: Verification queries
SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'config' ORDER BY tablename;