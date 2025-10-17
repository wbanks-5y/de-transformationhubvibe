-- Move pg_net extension from public to extensions schema for security best practices
-- This addresses the security linter warning about extensions in public schema

-- Drop from public if it exists there
DROP EXTENSION IF EXISTS pg_net CASCADE;

-- Create in extensions schema (preferred location)
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- Grant usage on extensions schema to necessary roles
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Recreate the triggers since we dropped the extension with CASCADE
-- (The functions will automatically use the extension from the new location)

-- Recreate trigger for invitation emails
DROP TRIGGER IF EXISTS trigger_notify_user_invitation ON public.profiles;
CREATE TRIGGER trigger_notify_user_invitation
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_user_invitation();

-- Recreate trigger for approval/rejection emails
DROP TRIGGER IF EXISTS trigger_notify_user_approval ON public.profiles;
CREATE TRIGGER trigger_notify_user_approval
  AFTER UPDATE OF status ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_user_approval();