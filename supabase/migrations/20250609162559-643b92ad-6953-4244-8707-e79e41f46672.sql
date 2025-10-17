
-- Add RLS policies for business_processes table
CREATE POLICY "Allow authenticated users to read business processes" 
ON business_processes FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage business processes" 
ON business_processes FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for process_steps table
CREATE POLICY "Allow authenticated users to read process steps" 
ON process_steps FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage process steps" 
ON process_steps FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for process_variants table
CREATE POLICY "Allow authenticated users to read process variants" 
ON process_variants FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage process variants" 
ON process_variants FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for process_statistics table
CREATE POLICY "Allow authenticated users to read process statistics" 
ON process_statistics FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage process statistics" 
ON process_statistics FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for process_bottlenecks table
CREATE POLICY "Allow authenticated users to read process bottlenecks" 
ON process_bottlenecks FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage process bottlenecks" 
ON process_bottlenecks FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for process_inefficiencies table
CREATE POLICY "Allow authenticated users to read process inefficiencies" 
ON process_inefficiencies FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage process inefficiencies" 
ON process_inefficiencies FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for process_optimization_metrics table
CREATE POLICY "Allow authenticated users to read process optimization metrics" 
ON process_optimization_metrics FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage process optimization metrics" 
ON process_optimization_metrics FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for process_recommendations table
CREATE POLICY "Allow authenticated users to read process recommendations" 
ON process_recommendations FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage process recommendations" 
ON process_recommendations FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for process_step_durations table
CREATE POLICY "Allow authenticated users to read process step durations" 
ON process_step_durations FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage process step durations" 
ON process_step_durations FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_objectives table
CREATE POLICY "Allow authenticated users to read strategic objectives" 
ON strategic_objectives FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic objectives" 
ON strategic_objectives FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_initiatives table
CREATE POLICY "Allow authenticated users to read strategic initiatives" 
ON strategic_initiatives FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic initiatives" 
ON strategic_initiatives FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_objective_health table
CREATE POLICY "Allow authenticated users to read strategic objective health" 
ON strategic_objective_health FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic objective health" 
ON strategic_objective_health FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_objective_health_periods table
CREATE POLICY "Allow authenticated users to read strategic objective health periods" 
ON strategic_objective_health_periods FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic objective health periods" 
ON strategic_objective_health_periods FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_risks_opportunities table
CREATE POLICY "Allow authenticated users to read strategic risks opportunities" 
ON strategic_risks_opportunities FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic risks opportunities" 
ON strategic_risks_opportunities FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_initiative_milestones table
CREATE POLICY "Allow authenticated users to read strategic initiative milestones" 
ON strategic_initiative_milestones FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic initiative milestones" 
ON strategic_initiative_milestones FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_initiative_dependencies table
CREATE POLICY "Allow authenticated users to read strategic initiative dependencies" 
ON strategic_initiative_dependencies FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic initiative dependencies" 
ON strategic_initiative_dependencies FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_milestone_dependencies table
CREATE POLICY "Allow authenticated users to read strategic milestone dependencies" 
ON strategic_milestone_dependencies FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic milestone dependencies" 
ON strategic_milestone_dependencies FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_resource_allocations table
CREATE POLICY "Allow authenticated users to read strategic resource allocations" 
ON strategic_resource_allocations FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic resource allocations" 
ON strategic_resource_allocations FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_scenarios table
CREATE POLICY "Allow authenticated users to read strategic scenarios" 
ON strategic_scenarios FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic scenarios" 
ON strategic_scenarios FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_scenario_parameters table
CREATE POLICY "Allow authenticated users to read strategic scenario parameters" 
ON strategic_scenario_parameters FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic scenario parameters" 
ON strategic_scenario_parameters FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_scenario_outcomes table
CREATE POLICY "Allow authenticated users to read strategic scenario outcomes" 
ON strategic_scenario_outcomes FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic scenario outcomes" 
ON strategic_scenario_outcomes FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_scenario_comparisons table
CREATE POLICY "Allow authenticated users to read strategic scenario comparisons" 
ON strategic_scenario_comparisons FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic scenario comparisons" 
ON strategic_scenario_comparisons FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_scenario_impact_categories table
CREATE POLICY "Allow authenticated users to read strategic scenario impact categories" 
ON strategic_scenario_impact_categories FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic scenario impact categories" 
ON strategic_scenario_impact_categories FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_objective_kpis table
CREATE POLICY "Allow authenticated users to read strategic objective kpis" 
ON strategic_objective_kpis FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic objective kpis" 
ON strategic_objective_kpis FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for strategic_objective_processes table
CREATE POLICY "Allow authenticated users to read strategic objective processes" 
ON strategic_objective_processes FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage strategic objective processes" 
ON strategic_objective_processes FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for analyst_insights table
CREATE POLICY "Allow authenticated users to read analyst insights" 
ON analyst_insights FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage analyst insights" 
ON analyst_insights FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for analyst_insight_categories table
CREATE POLICY "Allow authenticated users to read analyst insight categories" 
ON analyst_insight_categories FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage analyst insight categories" 
ON analyst_insight_categories FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for profiles table
CREATE POLICY "Allow users to read their own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Allow admin users to read all profiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (is_admin());

CREATE POLICY "Allow users to update their own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Allow admin users to manage all profiles" 
ON profiles FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for roles table
CREATE POLICY "Allow authenticated users to read roles" 
ON roles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage roles" 
ON roles FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for user_roles table
CREATE POLICY "Allow users to read their own roles" 
ON user_roles FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Allow admin users to read all user roles" 
ON user_roles FOR SELECT 
TO authenticated 
USING (is_admin());

CREATE POLICY "Allow admin users to manage user roles" 
ON user_roles FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for security_audit_log table
CREATE POLICY "Allow admin users to read security audit log" 
ON security_audit_log FOR SELECT 
TO authenticated 
USING (is_admin());

CREATE POLICY "Allow admin users to manage security audit log" 
ON security_audit_log FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for user_preferences table
CREATE POLICY "Allow users to read their own preferences" 
ON user_preferences FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to manage their own preferences" 
ON user_preferences FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);
