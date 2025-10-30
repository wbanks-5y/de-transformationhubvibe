
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { isUserAdmin } from '@/lib/supabase';

export const useSecureAdminCheck = () => {
  const { user, loading } = useAuth();

  const { data: isAdmin = false, isLoading, error, refetch } = useQuery({
    queryKey: ['secure-admin-check', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      return await isUserAdmin(user.id);
    },
    enabled: !!user?.id && !loading,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    isAdmin,
    isLoading: loading || isLoading,
    error,
    refetch,
    hasAdminAccess: isAdmin && !loading && !isLoading
  };
};
