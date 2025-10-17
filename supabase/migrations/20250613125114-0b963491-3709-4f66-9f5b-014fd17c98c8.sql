
-- Add tier field to profiles table
ALTER TABLE public.profiles ADD COLUMN tier TEXT NOT NULL DEFAULT 'essential';

-- Create a check constraint for valid tier values
ALTER TABLE public.profiles ADD CONSTRAINT valid_tier CHECK (tier IN ('essential', 'professional', 'enterprise', 'admin'));

-- Update existing profiles to have appropriate tiers (you can adjust this logic as needed)
-- For now, setting all existing users to 'professional' as a safe default
UPDATE public.profiles SET tier = 'professional' WHERE tier = 'essential';

-- Create an index on the tier column for better performance
CREATE INDEX idx_profiles_tier ON public.profiles(tier);

-- Create a security definer function to check user tier
CREATE OR REPLACE FUNCTION public.get_user_tier(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT tier
  FROM public.profiles
  WHERE id = user_id;
$$;

-- Create a function to check if user has required tier or higher
CREATE OR REPLACE FUNCTION public.has_tier_access(user_id uuid, required_tier text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN (SELECT tier FROM public.profiles WHERE id = user_id) = 'admin' THEN true
    WHEN required_tier = 'essential' THEN (SELECT tier FROM public.profiles WHERE id = user_id) IN ('essential', 'professional', 'enterprise', 'admin')
    WHEN required_tier = 'professional' THEN (SELECT tier FROM public.profiles WHERE id = user_id) IN ('professional', 'enterprise', 'admin')
    WHEN required_tier = 'enterprise' THEN (SELECT tier FROM public.profiles WHERE id = user_id) IN ('enterprise', 'admin')
    ELSE false
  END;
$$;
