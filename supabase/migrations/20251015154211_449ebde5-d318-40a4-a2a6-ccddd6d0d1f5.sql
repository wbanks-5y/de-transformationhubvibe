-- Enable pg_net extension for HTTP requests from database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to automatically invite users when profile is created
CREATE OR REPLACE FUNCTION auto_invite_user_on_profile_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  function_url text;
  auth_user_confirmed boolean;
BEGIN
  -- Check if this user has already confirmed their email in auth.users
  SELECT (email_confirmed_at IS NOT NULL) INTO auth_user_confirmed
  FROM auth.users
  WHERE id = NEW.id;
  
  -- Only proceed if user hasn't confirmed email yet
  IF auth_user_confirmed IS NULL OR auth_user_confirmed = false THEN
    
    -- Construct edge function URL for test org
    function_url := 'https://gvrxydwedhppmvppqwwm.supabase.co/functions/v1/invite-user';
    
    -- Call invite-user edge function asynchronously
    PERFORM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
      ),
      body := jsonb_build_object(
        'email', NEW.email,
        'organizationSlug', NULL
      ),
      timeout_milliseconds := 10000
    );
    
    RAISE NOTICE 'Auto-invite triggered for user: % (ID: %)', NEW.email, NEW.id;
  ELSE
    RAISE NOTICE 'User % already confirmed, skipping auto-invite', NEW.email;
  END IF;
  
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block profile creation
    RAISE WARNING 'Error in auto_invite_user_on_profile_insert for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS trigger_auto_invite_on_profile_insert ON public.profiles;

CREATE TRIGGER trigger_auto_invite_on_profile_insert
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_invite_user_on_profile_insert();

-- IMPORTANT: You must manually run this command in SQL Editor to set the service role key:
-- ALTER DATABASE postgres SET app.service_role_key = 'your-service-role-key-here';
-- Get your service role key from: Project Settings > API > service_role key