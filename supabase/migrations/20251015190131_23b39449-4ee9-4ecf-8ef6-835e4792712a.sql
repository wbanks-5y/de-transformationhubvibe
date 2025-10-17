-- Remove automatic invite triggers
-- Users will be manually invited from the management area instead

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS profiles_auto_invite ON public.profiles;