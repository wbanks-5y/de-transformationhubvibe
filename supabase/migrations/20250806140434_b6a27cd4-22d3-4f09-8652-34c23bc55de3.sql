-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.encrypt_api_key(api_key TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT encode(
    encrypt(
      api_key::bytea, 
      'supabase_encryption_key_2024'::bytea, 
      'aes'
    ), 
    'base64'
  );
$$;

CREATE OR REPLACE FUNCTION public.decrypt_api_key(encrypted_key TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT convert_from(
    decrypt(
      decode(encrypted_key, 'base64'), 
      'supabase_encryption_key_2024'::bytea, 
      'aes'
    ), 
    'UTF8'
  );
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