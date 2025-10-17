-- Step 1: Create invitation_tokens table in Management Database
CREATE TABLE IF NOT EXISTS public.invitation_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  email TEXT NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  organization_slug TEXT NOT NULL,
  organization_supabase_url TEXT NOT NULL,
  organization_supabase_anon_key TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for quick token lookup
CREATE INDEX idx_invitation_tokens_token ON public.invitation_tokens(token);
CREATE INDEX idx_invitation_tokens_email ON public.invitation_tokens(email);
CREATE INDEX idx_invitation_tokens_expires_at ON public.invitation_tokens(expires_at);

-- RLS policies
ALTER TABLE public.invitation_tokens ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (Management App admins) can insert tokens
CREATE POLICY "Authenticated users can insert tokens" ON public.invitation_tokens
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Anyone can read non-expired, unused tokens (needed for validation)
CREATE POLICY "Anyone can validate tokens" ON public.invitation_tokens
  FOR SELECT TO anon, authenticated
  USING (used_at IS NULL AND expires_at > now());

-- Allow updates to mark tokens as used
CREATE POLICY "Allow marking tokens as used" ON public.invitation_tokens
  FOR UPDATE TO anon, authenticated
  USING (used_at IS NULL)
  WITH CHECK (true);

-- Trigger to update updated_at
CREATE TRIGGER update_invitation_tokens_updated_at
  BEFORE UPDATE ON public.invitation_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Step 2: Add service_role_key column to organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS supabase_service_role_key TEXT;