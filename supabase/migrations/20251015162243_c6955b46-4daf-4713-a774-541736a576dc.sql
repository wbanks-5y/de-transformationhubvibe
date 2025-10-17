-- Enhanced auto-invite trigger with comprehensive logging
CREATE OR REPLACE FUNCTION public.auto_invite_user_on_profile_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  function_url text;
  auth_user_confirmed boolean;
  http_response record;
BEGIN
  -- Check if user email is already confirmed
  SELECT (email_confirmed_at IS NOT NULL) INTO auth_user_confirmed
  FROM auth.users
  WHERE id = NEW.id;
  
  IF auth_user_confirmed IS NULL OR auth_user_confirmed = false THEN
    function_url := 'https://gvrxydwedhppmvppqwwm.supabase.co/functions/v1/invite-user';
    
    -- Call edge function and capture response with tracking header
    SELECT * INTO http_response FROM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key', true),
        'X-Trigger-Source', 'db-trigger-auto-invite'
      ),
      body := jsonb_build_object(
        'email', NEW.email,
        'organizationSlug', NULL
      ),
      timeout_milliseconds := 10000
    );
    
    -- Log to security audit log with HTTP response details
    INSERT INTO public.security_audit_log (
      user_id,
      action,
      resource_type,
      resource_id,
      details,
      success
    ) VALUES (
      NEW.id,
      'auto_invite_db_trigger',
      'edge_function_call',
      NEW.id::text,
      jsonb_build_object(
        'trigger_source', 'profiles_insert',
        'email', NEW.email,
        'function_url', function_url,
        'http_status', http_response.status,
        'http_content', left(http_response.content::text, 500),
        'timestamp', now()
      ),
      (http_response.status >= 200 AND http_response.status < 300)
    );
    
    RAISE NOTICE '[DB-TRIGGER] Auto-invite for % (ID: %) - HTTP Status: %', 
      NEW.email, NEW.id, http_response.status;
  ELSE
    RAISE NOTICE '[DB-TRIGGER] User % already confirmed, skipping', NEW.email;
  END IF;
  
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '[DB-TRIGGER] Error for %: %', NEW.email, SQLERRM;
    
    -- Log the failure to security audit
    INSERT INTO public.security_audit_log (
      user_id,
      action,
      resource_type,
      resource_id,
      details,
      success
    ) VALUES (
      NEW.id,
      'auto_invite_db_trigger_error',
      'edge_function_call',
      NEW.id::text,
      jsonb_build_object(
        'trigger_source', 'profiles_insert',
        'email', NEW.email,
        'error', SQLERRM,
        'timestamp', now()
      ),
      false
    );
    
    RETURN NEW;
END;
$$;