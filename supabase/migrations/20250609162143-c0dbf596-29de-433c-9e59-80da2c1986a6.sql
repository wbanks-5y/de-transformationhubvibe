
-- Add RLS policies for cockpit_types table
CREATE POLICY "Allow authenticated users to read cockpit types" 
ON cockpit_types FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage cockpit types" 
ON cockpit_types FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for cockpit_sections table  
CREATE POLICY "Allow authenticated users to read cockpit sections" 
ON cockpit_sections FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage cockpit sections" 
ON cockpit_sections FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for cockpit_kpis table
CREATE POLICY "Allow authenticated users to read cockpit kpis" 
ON cockpit_kpis FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage cockpit kpis" 
ON cockpit_kpis FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for cockpit_kpi_values table
CREATE POLICY "Allow authenticated users to read cockpit kpi values" 
ON cockpit_kpi_values FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage cockpit kpi values" 
ON cockpit_kpi_values FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for cockpit_insights table
CREATE POLICY "Allow authenticated users to read cockpit insights" 
ON cockpit_insights FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage cockpit insights" 
ON cockpit_insights FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for cockpit_filters table
CREATE POLICY "Allow authenticated users to read cockpit filters" 
ON cockpit_filters FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage cockpit filters" 
ON cockpit_filters FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for metric_base table
CREATE POLICY "Allow authenticated users to read metric base" 
ON metric_base FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage metric base" 
ON metric_base FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for metric_single_value table
CREATE POLICY "Allow authenticated users to read single value metrics" 
ON metric_single_value FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage single value metrics" 
ON metric_single_value FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for metric_multi_value table
CREATE POLICY "Allow authenticated users to read multi value metrics" 
ON metric_multi_value FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage multi value metrics" 
ON metric_multi_value FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for metric_multi_value_data table
CREATE POLICY "Allow authenticated users to read multi value data" 
ON metric_multi_value_data FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage multi value data" 
ON metric_multi_value_data FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for metric_time_based table
CREATE POLICY "Allow authenticated users to read time based metrics" 
ON metric_time_based FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage time based metrics" 
ON metric_time_based FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for metric_time_based_data table
CREATE POLICY "Allow authenticated users to read time based data" 
ON metric_time_based_data FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage time based data" 
ON metric_time_based_data FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for cockpit_kpi_formulas table
CREATE POLICY "Allow authenticated users to read kpi formulas" 
ON cockpit_kpi_formulas FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage kpi formulas" 
ON cockpit_kpi_formulas FOR ALL 
TO authenticated 
USING (is_admin());

-- Add RLS policies for company_profile table
CREATE POLICY "Allow authenticated users to read company profile" 
ON company_profile FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow admin users to manage company profile" 
ON company_profile FOR ALL 
TO authenticated 
USING (is_admin());
