
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';

export const useOptimizedUserApproval = () => {
  const { user, loading, session } = useAuth();
  const { organizationClient, currentOrganization } = useOrganization();

  const { data: userStatus = 'pending', isLoading } = useQuery({
    queryKey: ['user-approval', user?.id, currentOrganization?.slug, session?.access_token],
    queryFn: async () => {
      if (!user?.id || !organizationClient) return 'pending';
      
      console.log('[user-approval] Querying with authenticated client:', {
        userId: user.id,
        hasAccessToken: !!session?.access_token,
        orgSlug: currentOrganization?.slug
      });
      
      const { data, error } = await organizationClient
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('[user-approval] Error fetching profile:', error);
        return 'pending';
      }
      
      if (!data) {
        console.warn('[user-approval] No profile found for user:', user.id);
        return 'pending';
      }
      
      console.log('[user-approval] Profile status:', data.status);
      return data.status as 'pending' | 'approved' | 'rejected';
    },
    enabled: !!user?.id && !loading && !!organizationClient && !!session?.access_token,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    userStatus,
    isLoading: loading || isLoading,
    isApproved: userStatus === 'approved'
  };
};
