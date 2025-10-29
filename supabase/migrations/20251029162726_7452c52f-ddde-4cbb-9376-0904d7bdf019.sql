-- Update all profiles with tier='admin' to tier='enterprise'
-- This separates the concept of admin role from tier-based feature access
UPDATE public.profiles 
SET tier = 'enterprise' 
WHERE tier = 'admin';