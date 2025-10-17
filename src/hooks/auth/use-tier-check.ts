
import { useUserTier } from "./use-user-tier";
import { useCachedAdminCheck } from "./use-cached-admin-check";
import { hasRequiredTier, type UserTier } from "@/types/tiers";

export const useTierCheck = (requiredTier: UserTier) => {
  const { data: userTier, isLoading: tierLoading, error } = useUserTier();
  const { isAdmin, isLoading: adminLoading } = useCachedAdminCheck();

  const isLoading = tierLoading || adminLoading;

  // Admin users always have enterprise-level access
  const effectiveTier = isAdmin ? 'enterprise' : userTier;
  const hasAccess = effectiveTier ? hasRequiredTier(effectiveTier, requiredTier) : false;

  return {
    hasAccess,
    userTier: effectiveTier,
    isLoading,
    hasError: !!error,
    canAccess: (tier: UserTier) => effectiveTier ? hasRequiredTier(effectiveTier, tier) : false
  };
};
