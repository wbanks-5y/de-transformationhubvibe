-- Create trigger on auth.users to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Create trigger on profiles to automatically send invitation email
DROP TRIGGER IF EXISTS profiles_auto_invite ON public.profiles;
CREATE TRIGGER profiles_auto_invite
  AFTER INSERT ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION public.auto_invite_user_on_profile_insert();