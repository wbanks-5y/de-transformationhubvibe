-- Fix missing is_admin_secure function and other critical database issues
-- This function was referenced in many places but appears to be missing

-- First, ensure we have the is_admin_secure function that many policies depend on
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
  );
$$;

-- Ensure we have the profiles table with proper structure
-- Only create if it doesn't exist to avoid conflicts
DO $$
BEGIN
  -- Check if profiles table exists and add created_at if missing
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'created_at') THEN
      ALTER TABLE public.profiles ADD COLUMN created_at timestamp with time zone DEFAULT now();
    END IF;
  END IF;
END $$;

-- Ensure basic admin role exists
INSERT INTO public.roles (name, description) 
VALUES ('admin', 'System Administrator')
ON CONFLICT (name) DO NOTHING;

-- Fix any search path issues for existing functions
ALTER FUNCTION public.validate_password_complexity(text) SET search_path = '';
ALTER FUNCTION public.calculate_trend_percentage(numeric, numeric) SET search_path = '';
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_admin_secure() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_approval_status_secure(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_encrypted_api_key_secure(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_encrypted_api_key_secure(text, text, uuid) TO authenticated;