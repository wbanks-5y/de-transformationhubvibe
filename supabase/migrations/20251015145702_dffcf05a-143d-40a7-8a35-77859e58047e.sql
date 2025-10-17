-- Drop the auto_invite_new_user triggers that are causing infinite loop
-- These triggers were automatically calling invite-user edge function
-- We handle invitations manually through the edge function, so these triggers are not needed

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_auto_invite_new_user ON public.profiles;
DROP FUNCTION IF EXISTS public.auto_invite_new_user() CASCADE;