
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import type { UserTier } from "@/types/tiers";

export const useUserTier = () => {
  const { user } = useAuth();
  const { organizationClient } = useOrganization();

  return useQuery({
    queryKey: ['user-tier', user?.id],
    queryFn: async (): Promise<UserTier | null> => {
      if (!user?.id || !organizationClient) return null;

      const { data, error } = await organizationClient
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user tier:', error);
        return null;
      }

      return data?.tier as UserTier || 'essential';
    },
    enabled: !!user?.id && !!organizationClient,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1
  });
};
