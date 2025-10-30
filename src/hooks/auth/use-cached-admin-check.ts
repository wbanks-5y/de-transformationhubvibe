
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { isUserAdmin } from '@/lib/supabase';

export const useCachedAdminCheck = () => {
  const { user, loading } = useAuth();

  const { data: isAdmin = false, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      return await isUserAdmin(user.id);
    },
    enabled: !!user?.id && !loading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    isAdmin,
    isLoading: loading || isLoading,
    hasError: !!error,
    handleRetry: refetch
  };
};
