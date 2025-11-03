-- Add user_id column to existing invitation_tokens table
ALTER TABLE public.invitation_tokens 
ADD COLUMN IF NOT EXISTS user_id uuid;

-- Add invited_by column to track who sent the invitation
ALTER TABLE public.invitation_tokens 
ADD COLUMN IF NOT EXISTS invited_by uuid;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS invitation_tokens_user_id_idx ON public.invitation_tokens (user_id);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view invitation tokens" ON public.invitation_tokens;
DROP POLICY IF EXISTS "Admins can insert invitation tokens" ON public.invitation_tokens;
DROP POLICY IF EXISTS "Admins can update invitation tokens" ON public.invitation_tokens;
DROP POLICY IF EXISTS "Admins can delete invitation tokens" ON public.invitation_tokens;

-- Recreate RLS policies for admin access
CREATE POLICY "Admins can view invitation tokens"
  ON public.invitation_tokens
  FOR SELECT
  USING (public.is_admin_secure());

CREATE POLICY "Admins can insert invitation tokens"
  ON public.invitation_tokens
  FOR INSERT
  WITH CHECK (public.is_admin_secure());

CREATE POLICY "Admins can update invitation tokens"
  ON public.invitation_tokens
  FOR UPDATE
  USING (public.is_admin_secure());

CREATE POLICY "Admins can delete invitation tokens"
  ON public.invitation_tokens
  FOR DELETE
  USING (public.is_admin_secure());