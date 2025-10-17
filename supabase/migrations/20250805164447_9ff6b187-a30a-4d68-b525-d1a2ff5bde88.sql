-- Add approval workflow fields to analyst_insights table
ALTER TABLE public.analyst_insights 
ADD COLUMN approval_status text NOT NULL DEFAULT 'pending',
ADD COLUMN approved_by uuid REFERENCES auth.users(id),
ADD COLUMN approved_at timestamp with time zone;

-- Add check constraint for approval_status
ALTER TABLE public.analyst_insights 
ADD CONSTRAINT analyst_insights_approval_status_check 
CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Update existing insights to be approved (since they were manually created)
UPDATE public.analyst_insights 
SET approval_status = 'approved' 
WHERE approval_status = 'pending';

-- Create index for better performance on approval queries
CREATE INDEX idx_analyst_insights_approval_status ON public.analyst_insights(approval_status);

-- Update RLS policies to handle approval workflow
DROP POLICY IF EXISTS "Anyone can view active analyst insights" ON public.analyst_insights;
DROP POLICY IF EXISTS "Allow authenticated users to read analyst insights" ON public.analyst_insights;
DROP POLICY IF EXISTS "Authenticated users can view analyst_insights" ON public.analyst_insights;

-- New policy: Only show approved insights to non-admin users
CREATE POLICY "Users can view approved analyst insights" 
ON public.analyst_insights 
FOR SELECT 
USING (
  (approval_status = 'approved' AND is_active = true) 
  OR is_admin_secure()
);

-- Admin policy for managing insights
CREATE POLICY "Admins can manage all analyst insights" 
ON public.analyst_insights 
FOR ALL 
USING (is_admin_secure());

-- Allow edge functions to insert pending insights
CREATE POLICY "Allow edge functions to insert pending insights"
ON public.analyst_insights
FOR INSERT
WITH CHECK (approval_status = 'pending');