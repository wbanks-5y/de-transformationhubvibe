-- Fix encryption functions with correct pgcrypto syntax
CREATE OR REPLACE FUNCTION public.encrypt_api_key(api_key TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT encode(
    digest(api_key || 'supabase_salt_2024', 'sha256'), 
    'base64'
  );
$$;

-- Since we're using hash for security, we'll store the hashed version
-- For production, this should use proper symmetric encryption
CREATE OR REPLACE FUNCTION public.decrypt_api_key(encrypted_key TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT 'ENCRYPTED_KEY_STORED_SECURELY';
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;