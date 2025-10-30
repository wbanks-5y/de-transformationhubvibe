
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { UserTier } from "@/types/tiers";

export const useUserTier = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-tier', user?.id],
    queryFn: async (): Promise<UserTier | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
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
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1
  });
};
