
-- Step 1: Clean up all KPI data from both old and new tables
TRUNCATE TABLE public.strategic_objective_kpis CASCADE;
TRUNCATE TABLE public.cockpit_kpi_values CASCADE;
TRUNCATE TABLE public.cockpit_kpi_targets CASCADE;
TRUNCATE TABLE public.cockpit_kpi_time_based CASCADE;
TRUNCATE TABLE public.cockpit_kpis CASCADE;
TRUNCATE TABLE public.old_cockpit_kpi_values CASCADE;
TRUNCATE TABLE public.old_cockpit_kpis CASCADE;

-- Step 2: Drop the incorrect foreign key constraint (if it exists)
ALTER TABLE public.strategic_objective_kpis 
DROP CONSTRAINT IF EXISTS strategic_objective_kpis_kpi_id_fkey;

-- Step 3: Create the correct foreign key constraint pointing to the new cockpit_kpis table
ALTER TABLE public.strategic_objective_kpis
ADD CONSTRAINT strategic_objective_kpis_kpi_id_fkey 
FOREIGN KEY (kpi_id) REFERENCES public.cockpit_kpis(id) ON DELETE CASCADE;

-- Step 4: Add index for better performance
CREATE INDEX IF NOT EXISTS idx_strategic_objective_kpis_kpi_id 
ON public.strategic_objective_kpis(kpi_id);

-- Step 5: Drop the old KPI tables since they're no longer needed
DROP TABLE IF EXISTS public.old_cockpit_kpi_values CASCADE;
DROP TABLE IF EXISTS public.old_cockpit_kpis CASCADE;
