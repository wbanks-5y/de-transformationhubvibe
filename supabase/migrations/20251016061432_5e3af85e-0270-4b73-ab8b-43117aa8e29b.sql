-- Fix foreign key constraint to allow user deletion while preserving audit logs
-- Drop existing foreign key constraint
ALTER TABLE public.security_audit_log 
DROP CONSTRAINT IF EXISTS security_audit_log_user_id_fkey;

-- Ensure user_id column allows NULL values
ALTER TABLE public.security_audit_log 
ALTER COLUMN user_id DROP NOT NULL;

-- Recreate foreign key with ON DELETE SET NULL
ALTER TABLE public.security_audit_log
ADD CONSTRAINT security_audit_log_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE SET NULL;

-- Add index for performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id 
ON public.security_audit_log(user_id) 
WHERE user_id IS NOT NULL;