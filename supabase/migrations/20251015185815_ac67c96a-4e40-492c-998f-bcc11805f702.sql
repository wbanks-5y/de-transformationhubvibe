-- Fix auto_invite_user_on_profile_insert to skip users who already exist in auth.users
-- This prevents "email_exists" errors when users are created via dashboard/admin
CREATE OR REPLACE FUNCTION public.auto_invite_user_on_profile_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  function_url text;
  auth_user_exists boolean;
  http_response record;
BEGIN
  -- Check if user already exists in auth.users
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = NEW.id) INTO auth_user_exists;
  
  -- Only send invite if user does NOT exist in auth.users
  -- This function is for the "create profile first, then invite" workflow only
  IF NOT auth_user_exists THEN
    function_url := 'https://gvrxydwedhppmvppqwwm.supabase.co/functions/v1/invite-user';
    
    -- Call edge function and capture response
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
    
    -- Log to security audit log
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
    RAISE NOTICE '[DB-TRIGGER] User % already exists in auth.users, skipping invite', NEW.email;
  END IF;
  
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '[DB-TRIGGER] Error for %: %', NEW.email, SQLERRM;
    
    -- Log the failure
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
$function$;