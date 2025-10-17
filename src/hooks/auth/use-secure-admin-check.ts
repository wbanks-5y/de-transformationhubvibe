
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { isUserAdmin } from '@/lib/supabase';

export const useSecureAdminCheck = () => {
  const { user, loading } = useAuth();
  const { organizationClient } = useOrganization();

  const { data: isAdmin = false, isLoading, error, refetch } = useQuery({
    queryKey: ['secure-admin-check', user?.id, organizationClient ? 'org' : 'default'],
    queryFn: async () => {
      if (!user?.id || !organizationClient) return false;
      return await isUserAdmin(user.id, organizationClient);
    },
    enabled: !!user?.id && !loading && !!organizationClient,
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
