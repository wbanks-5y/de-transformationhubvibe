-- Phase 1: API Key Security - Create encrypted storage for API keys
CREATE TABLE IF NOT EXISTS public.encrypted_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name TEXT NOT NULL UNIQUE,
  encrypted_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on encrypted_api_keys table
ALTER TABLE public.encrypted_api_keys ENABLE ROW LEVEL SECURITY;

-- Only admins can manage API keys
CREATE POLICY "Admins can manage encrypted API keys"
ON public.encrypted_api_keys
FOR ALL
USING (is_admin_secure());

-- Create encryption/decryption functions using pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to encrypt API keys
CREATE OR REPLACE FUNCTION public.encrypt_api_key(api_key TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT encode(
    encrypt(
      api_key::bytea, 
      Deno.env.get('ENCRYPTION_KEY')::bytea, 
      'aes'
    ), 
    'base64'
  );
$$;

-- Function to decrypt API keys (only for server use)
CREATE OR REPLACE FUNCTION public.decrypt_api_key(encrypted_key TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT convert_from(
    decrypt(
      decode(encrypted_key, 'base64'), 
      Deno.env.get('ENCRYPTION_KEY')::bytea, 
      'aes'
    ), 
    'UTF8'
  );
$$;

-- Phase 2: Clean up RLS policies - Remove redundant and conflicting policies

-- First, let's clean up the profiles table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Approved users can read profiles" ON public.profiles;

-- Create single, clear profile policies
CREATE POLICY "Users can view their own profile and admins can view all"
ON public.profiles
FOR SELECT
USING (auth.uid() = id OR is_admin_secure());

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (is_admin_secure());

-- Clean up user_roles policies
DROP POLICY IF EXISTS "Allow admin users to manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to read user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Approved users can read user roles" ON public.user_roles;

-- Create single, clear user_roles policies
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
USING (is_admin_secure());

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id OR is_admin_secure());

-- Clean up roles table policies
DROP POLICY IF EXISTS "Allow admin users to manage roles" ON public.roles;
DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON public.roles;
DROP POLICY IF EXISTS "Approved users can read roles" ON public.roles;

-- Create single, clear roles policies
CREATE POLICY "Admins can manage roles"
ON public.roles
FOR ALL
USING (is_admin_secure());

CREATE POLICY "Authenticated users can view roles"
ON public.roles
FOR SELECT
USING (true);

-- Add trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_encrypted_api_keys_updated_at
    BEFORE UPDATE ON public.encrypted_api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_timestamp();