
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';

export const useOptimizedUserApproval = () => {
  const { user, loading } = useAuth();
  const { organizationClient, currentOrganization } = useOrganization();

  const { data: userStatus = 'pending', isLoading } = useQuery({
    queryKey: ['user-approval', user?.id, currentOrganization?.slug],
    queryFn: async () => {
      if (!user?.id || !organizationClient) return 'pending';
      
      const { data, error } = await organizationClient
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error || !data) return 'pending';
      return data.status as 'pending' | 'approved' | 'rejected';
    },
    enabled: !!user?.id && !loading && !!organizationClient,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    userStatus,
    isLoading: loading || isLoading,
    isApproved: userStatus === 'approved'
  };
};
