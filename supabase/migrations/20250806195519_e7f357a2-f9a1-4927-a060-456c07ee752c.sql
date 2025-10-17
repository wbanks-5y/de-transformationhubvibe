-- Critical Security Fixes Migration
-- Fix 1: Correct function search paths for security definer functions
ALTER FUNCTION public.encrypt_api_key(text) SET search_path = '';
ALTER FUNCTION public.decrypt_api_key(text) SET search_path = '';

-- Fix 2: Create proper encrypted API key management functions
CREATE OR REPLACE FUNCTION public.get_encrypted_api_key_secure(p_key_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  encrypted_key text;
BEGIN
  -- Only allow admins to retrieve API keys
  IF NOT is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Get the encrypted key from database
  SELECT encrypted_value INTO encrypted_key
  FROM public.encrypted_api_keys 
  WHERE key_name = p_key_name
  LIMIT 1;
  
  IF encrypted_key IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Return the encrypted key (will be decrypted by edge function)
  RETURN encrypted_key;
END;
$$;

-- Fix 3: Create secure API key update function
CREATE OR REPLACE FUNCTION public.update_encrypted_api_key_secure(
  p_key_name text,
  p_encrypted_value text,
  p_created_by uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only allow admins to update API keys
  IF NOT is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Validate input
  IF p_key_name IS NULL OR p_encrypted_value IS NULL THEN
    RAISE EXCEPTION 'Invalid input parameters';
  END IF;
  
  -- Insert or update the encrypted API key
  INSERT INTO public.encrypted_api_keys (key_name, encrypted_value, created_by)
  VALUES (p_key_name, p_encrypted_value, p_created_by)
  ON CONFLICT (key_name) 
  DO UPDATE SET 
    encrypted_value = EXCLUDED.encrypted_value,
    updated_at = now(),
    created_by = EXCLUDED.created_by;
  
  -- Log the security event
  PERFORM log_security_event_enhanced(
    'api_key_updated_secure',
    'encrypted_api_key',
    p_key_name,
    jsonb_build_object(
      'updated_by', p_created_by,
      'key_length', length(p_encrypted_value)
    ),
    true,
    'info'
  );
  
  RETURN true;
END;
$$;

-- Fix 4: Add constraint to ensure key_name is unique and not empty
ALTER TABLE public.encrypted_api_keys 
ADD CONSTRAINT check_key_name_not_empty CHECK (length(trim(key_name)) > 0);

-- Fix 5: Create function to validate user approval status
CREATE OR REPLACE FUNCTION public.get_user_approval_status_secure(p_user_id uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'user_id', p.id,
    'status', p.status,
    'is_approved', (p.status = 'approved'),
    'is_admin', EXISTS (
      SELECT 1 
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = p.id 
      AND r.name = 'admin'
    ),
    'tier', p.tier,
    'created_at', p.created_at
  )
  FROM public.profiles p
  WHERE p.id = COALESCE(p_user_id, auth.uid());
$$;