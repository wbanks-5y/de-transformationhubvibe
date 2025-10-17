-- Create rate limiting table for server-side rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limit_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  action text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Add index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup ON public.rate_limit_attempts 
(identifier, action, created_at DESC);

-- Enable RLS
ALTER TABLE public.rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- RLS policies for rate limiting table
CREATE POLICY "Users can view their own rate limit attempts" 
ON public.rate_limit_attempts 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can insert rate limit attempts" 
ON public.rate_limit_attempts 
FOR INSERT 
WITH CHECK (true);

-- Admins can view all rate limiting data
CREATE POLICY "Admins can view all rate limit attempts" 
ON public.rate_limit_attempts 
FOR ALL 
USING (is_admin_secure());

-- Create cleanup function to remove old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Delete attempts older than 24 hours
  DELETE FROM public.rate_limit_attempts 
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;