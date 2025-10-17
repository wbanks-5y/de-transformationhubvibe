
// Re-export the supabase client and helper functions for backwards compatibility
export { supabase } from '@/integrations/supabase/client';
import { supabase } from '@/integrations/supabase/client';

// Helper functions for common auth operations
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
