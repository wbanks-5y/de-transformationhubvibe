-- Create function to auto-invite users when inserted into profiles
CREATE OR REPLACE FUNCTION public.auto_invite_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  function_url text;
BEGIN
  -- Only trigger for new users with email
  IF NEW.email IS NOT NULL THEN
    
    -- Hardcoded Supabase function URL
    function_url := 'https://gvrxydwedhppmvppqwwm.supabase.co/functions/v1/invite-user';
    
    -- Call invite-user edge function (non-blocking)
    PERFORM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'email', NEW.email
      ),
      timeout_milliseconds := 5000
    );
    
    -- Log the invitation attempt
    RAISE NOTICE 'Triggered invitation email for user %', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto-invitations
DROP TRIGGER IF EXISTS trigger_auto_invite_new_user ON public.profiles;
CREATE TRIGGER trigger_auto_invite_new_user
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_invite_new_user();

-- Add documentation
COMMENT ON FUNCTION public.auto_invite_new_user() IS 
  'Automatically calls invite-user edge function when a new user profile is created. The edge function handles Supabase Auth user creation and sends invitation email with secure password-set tokens.';