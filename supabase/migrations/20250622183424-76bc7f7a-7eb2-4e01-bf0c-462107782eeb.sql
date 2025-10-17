
-- Phase 1: Rename existing tables with old_ prefix for safety
ALTER TABLE cockpit_kpi_values RENAME TO old_cockpit_kpi_values;
ALTER TABLE cockpit_kpis RENAME TO old_cockpit_kpis;

-- Create new simplified cockpit_kpis table (definitions only)
CREATE TABLE cockpit_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cockpit_type_id UUID REFERENCES cockpit_types(id),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  kpi_data_type TEXT DEFAULT 'single' CHECK (kpi_data_type IN ('single', 'time_based')),
  format_type TEXT DEFAULT 'number' CHECK (format_type IN ('number', 'percentage', 'currency')),
  format_options JSONB DEFAULT '{}',
  trend_direction TEXT DEFAULT 'higher_is_better' CHECK (trend_direction IN ('higher_is_better', 'lower_is_better', 'neutral')),
  icon TEXT,
  color_class TEXT DEFAULT 'text-blue-600',
  size_config TEXT DEFAULT 'medium' CHECK (size_config IN ('small', 'medium', 'large', 'xl')),
  weight NUMERIC DEFAULT 1.0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create new cockpit_kpi_values table (single actual values)
CREATE TABLE cockpit_kpi_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID REFERENCES cockpit_kpis(id) ON DELETE CASCADE,
  current_value NUMERIC NOT NULL,
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create new cockpit_kpi_time_based table (time series actual values)
CREATE TABLE cockpit_kpi_time_based (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID REFERENCES cockpit_kpis(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type TEXT DEFAULT 'month' CHECK (period_type IN ('year', 'quarter', 'month', 'week', 'day')),
  actual_value NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(kpi_id, period_start, period_end)
);

-- Create new cockpit_kpi_targets table (single or time-ranged targets)
CREATE TABLE cockpit_kpi_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID REFERENCES cockpit_kpis(id) ON DELETE CASCADE,
  target_type TEXT DEFAULT 'single' CHECK (target_type IN ('single', 'time_based')),
  target_value NUMERIC NOT NULL,
  period_start DATE, -- NULL for single targets
  period_end DATE,   -- NULL for single targets
  period_type TEXT CHECK (period_type IN ('year', 'quarter', 'month', 'week', 'day')),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- Ensure single targets don't have period info and time-based targets do
  CONSTRAINT valid_target_periods CHECK (
    (target_type = 'single' AND period_start IS NULL AND period_end IS NULL AND period_type IS NULL) OR
    (target_type = 'time_based' AND period_start IS NOT NULL AND period_end IS NOT NULL AND period_type IS NOT NULL)
  )
);

-- Add indexes for performance
CREATE INDEX idx_cockpit_kpi_values_kpi_id ON cockpit_kpi_values(kpi_id);
CREATE INDEX idx_cockpit_kpi_time_based_kpi_id ON cockpit_kpi_time_based(kpi_id);
CREATE INDEX idx_cockpit_kpi_time_based_period ON cockpit_kpi_time_based(period_start, period_end);
CREATE INDEX idx_cockpit_kpi_targets_kpi_id ON cockpit_kpi_targets(kpi_id);
CREATE INDEX idx_cockpit_kpi_targets_period ON cockpit_kpi_targets(period_start, period_end);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cockpit_kpis_updated_at BEFORE UPDATE ON cockpit_kpis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cockpit_kpi_values_updated_at BEFORE UPDATE ON cockpit_kpi_values FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cockpit_kpi_time_based_updated_at BEFORE UPDATE ON cockpit_kpi_time_based FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cockpit_kpi_targets_updated_at BEFORE UPDATE ON cockpit_kpi_targets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Phase 2: Migrate existing data from old tables
INSERT INTO cockpit_kpis (
  id, cockpit_type_id, name, display_name, description, 
  kpi_data_type, format_type, format_options, trend_direction,
  icon, color_class, size_config, weight, sort_order, is_active,
  created_at, updated_at
)
SELECT 
  id, cockpit_type_id, name, display_name, description,
  CASE 
    WHEN has_time_series = true THEN 'time_based'
    ELSE 'single'
  END as kpi_data_type,
  COALESCE(format_type, 'number') as format_type,
  COALESCE(format_options, '{}') as format_options,
  COALESCE(trend_direction, 'higher_is_better') as trend_direction,
  icon, 
  COALESCE(color_class, 'text-blue-600') as color_class,
  COALESCE(size_config, 'medium') as size_config,
  COALESCE(weight, 1.0) as weight,
  COALESCE(sort_order, 0) as sort_order,
  COALESCE(is_active, true) as is_active,
  COALESCE(created_at, now()) as created_at,
  COALESCE(updated_at, now()) as updated_at
FROM old_cockpit_kpis;

-- Migrate single values (from manual_value in old table)
INSERT INTO cockpit_kpi_values (kpi_id, current_value, notes, recorded_at, created_at, updated_at)
SELECT 
  id as kpi_id,
  manual_value as current_value,
  'Migrated from old manual_value' as notes,
  COALESCE(updated_at, now()) as recorded_at,
  COALESCE(created_at, now()) as created_at,
  COALESCE(updated_at, now()) as updated_at
FROM old_cockpit_kpis 
WHERE manual_value IS NOT NULL AND (has_time_series IS NULL OR has_time_series = false);

-- Migrate time-based values from old_cockpit_kpi_values
INSERT INTO cockpit_kpi_time_based (kpi_id, period_start, period_end, period_type, actual_value, created_at, updated_at)
SELECT 
  kpi_id,
  period_start::date,
  period_end::date,
  'month' as period_type, -- Default to month since old data doesn't specify
  current_value as actual_value,
  COALESCE(calculated_at, now()) as created_at,
  COALESCE(calculated_at, now()) as updated_at
FROM old_cockpit_kpi_values
WHERE current_value IS NOT NULL;

-- Migrate target values (single targets from old table)
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, notes, created_at, updated_at)
SELECT 
  id as kpi_id,
  'single' as target_type,
  target_value,
  'Migrated from old target_value' as notes,
  COALESCE(created_at, now()) as created_at,
  COALESCE(updated_at, now()) as updated_at
FROM old_cockpit_kpis 
WHERE target_value IS NOT NULL;

-- Migrate time-based targets from old_cockpit_kpi_values if they had targets
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, notes, created_at, updated_at)
SELECT 
  kpi_id,
  'time_based' as target_type,
  target_value,
  period_start::date,
  period_end::date,
  'month' as period_type,
  'Migrated from old time-based target' as notes,
  COALESCE(calculated_at, now()) as created_at,
  COALESCE(calculated_at, now()) as updated_at
FROM old_cockpit_kpi_values
WHERE target_value IS NOT NULL;

-- Create some sample data for testing
-- Sample quarterly targets for Q1-Q4 2024
INSERT INTO cockpit_kpi_targets (kpi_id, target_type, target_value, period_start, period_end, period_type, notes)
SELECT 
  k.id as kpi_id,
  'time_based' as target_type,
  CASE 
    WHEN k.format_type = 'currency' THEN 100000 + (RANDOM() * 50000)
    WHEN k.format_type = 'percentage' THEN 80 + (RANDOM() * 20)
    ELSE 1000 + (RANDOM() * 500)
  END as target_value,
  ('2024-' || quarter_num || '-01')::date as period_start,
  ('2024-' || quarter_num || '-01')::date + interval '3 months' - interval '1 day' as period_end,
  'quarter' as period_type,
  'Sample quarterly target for Q' || quarter_num || ' 2024' as notes
FROM cockpit_kpis k
CROSS JOIN (VALUES (1), (4), (7), (10)) AS quarters(quarter_num)
WHERE k.kpi_data_type = 'time_based'
LIMIT 20; -- Limit to avoid too much test data
