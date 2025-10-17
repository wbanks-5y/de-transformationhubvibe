-- Fix permission issue: Update notification functions to use hardcoded Supabase URL
-- This removes the need for ALTER DATABASE permissions

-- Update invitation notification function
CREATE OR REPLACE FUNCTION public.notify_user_invitation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  function_url text;
BEGIN
  -- Use hardcoded Supabase project URL
  function_url := 'https://gvrxydwedhppmvppqwwm.supabase.co/functions/v1/send-approval-email';
  
  -- Call edge function to send invitation email (non-blocking)
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
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

-- Update approval notification function
CREATE OR REPLACE FUNCTION public.notify_user_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  function_url text;
BEGIN
  -- Only send email if status changed from pending to approved/rejected
  IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
    
    -- Use hardcoded Supabase project URL
    function_url := 'https://gvrxydwedhppmvppqwwm.supabase.co/functions/v1/send-approval-email';
    
    -- Call edge function to send approval/rejection email (non-blocking)
    PERFORM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
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

-- Update function comments
COMMENT ON FUNCTION public.notify_user_invitation() IS 
  'Automatically sends invitation email when a new user profile is created. Uses hardcoded Supabase URL to avoid permission issues.';

COMMENT ON FUNCTION public.notify_user_approval() IS 
  'Automatically sends approval/rejection email when user status changes from pending. Uses hardcoded Supabase URL to avoid permission issues.';