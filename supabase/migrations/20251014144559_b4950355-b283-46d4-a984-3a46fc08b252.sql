-- Enable pg_net extension for HTTP requests from database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to send invitation email when user is created
CREATE OR REPLACE FUNCTION public.notify_user_invitation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  function_url text;
  service_role_key text;
BEGIN
  -- Get environment values from database configuration
  function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-approval-email';
  service_role_key := current_setting('app.settings.service_role_key', true);
  
  -- Call edge function to send invitation email (non-blocking)
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := jsonb_build_object(
      'email', COALESCE(NEW.email, ''),
      'full_name', COALESCE(NEW.full_name, NEW.email, 'User'),
      'status', 'invitation'
    ),
    timeout_milliseconds := 5000
  );
  
  -- Log the invitation attempt
  RAISE NOTICE 'Triggered invitation email for new user %', NEW.email;
  
  RETURN NEW;
END;
$$;

-- Create function to send approval/rejection email when status changes
CREATE OR REPLACE FUNCTION public.notify_user_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  function_url text;
  service_role_key text;
BEGIN
  -- Only send email if status changed from pending to approved/rejected
  IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
    
    -- Get environment values from database configuration
    function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-approval-email';
    service_role_key := current_setting('app.settings.service_role_key', true);
    
    -- Call edge function to send approval/rejection email (non-blocking)
    PERFORM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'email', COALESCE(NEW.email, ''),
        'full_name', COALESCE(NEW.full_name, NEW.email, 'User'),
        'status', NEW.status
      ),
      timeout_milliseconds := 5000
    );
    
    -- Log the notification attempt
    RAISE NOTICE 'Triggered approval email for user % with status %', NEW.email, NEW.status;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for invitation emails (fires on INSERT)
DROP TRIGGER IF EXISTS trigger_notify_user_invitation ON public.profiles;
CREATE TRIGGER trigger_notify_user_invitation
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_user_invitation();

-- Create trigger for approval/rejection emails (fires on UPDATE)
DROP TRIGGER IF EXISTS trigger_notify_user_approval ON public.profiles;
CREATE TRIGGER trigger_notify_user_approval
  AFTER UPDATE OF status ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_user_approval();

-- Add documentation comments
COMMENT ON FUNCTION public.notify_user_invitation() IS 
  'Automatically sends invitation email when a new user profile is created';

COMMENT ON FUNCTION public.notify_user_approval() IS 
  'Automatically sends approval/rejection email when user status changes from pending';