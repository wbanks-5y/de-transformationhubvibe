-- Fix search_path security issue - use empty string and fully qualified names
CREATE OR REPLACE FUNCTION public.auto_invite_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  function_url text;
BEGIN
  -- Only trigger for new users with email
  IF NEW.email IS NOT NULL THEN
    
    -- Hardcoded Supabase function URL
    function_url := 'https://gvrxydwedhppmvppqwwm.supabase.co/functions/v1/invite-user';
    
    -- Call invite-user edge function (non-blocking) with fully qualified function name
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