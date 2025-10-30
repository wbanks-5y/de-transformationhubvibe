
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useOptimizedUserApproval = () => {
  const { user, loading } = useAuth();

  const { data: userStatus = 'pending', isLoading } = useQuery({
    queryKey: ['user-approval', user?.id],
    queryFn: async () => {
      if (!user?.id) return 'pending';
      
      const { data, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error || !data) return 'pending';
      return data.status as 'pending' | 'approved' | 'rejected';
    },
    enabled: !!user?.id && !loading,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    userStatus,
    isLoading: loading || isLoading,
    isApproved: userStatus === 'approved'
  };
};
