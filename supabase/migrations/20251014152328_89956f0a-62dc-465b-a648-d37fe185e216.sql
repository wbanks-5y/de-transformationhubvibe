-- Remove duplicate invitation email trigger
-- Only Supabase's native invitation email (with secure tokens) will be sent

-- Drop the invitation trigger
DROP TRIGGER IF EXISTS trigger_notify_user_invitation ON public.profiles;

-- Drop the invitation function (no longer needed)
DROP FUNCTION IF EXISTS public.notify_user_invitation();

-- Add comment to approval function for clarity
COMMENT ON FUNCTION public.notify_user_approval() IS 
  'Sends approval/rejection email when user status changes from pending to approved/rejected. Invitation emails are handled by Supabase native auth flow with secure tokens.';