
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTierCheck } from '@/hooks/auth/use-tier-check';
import { type UserTier } from '@/types/tiers';
import LoadingScreen from '@/components/LoadingScreen';
import AccessDeniedScreen from './AccessDeniedScreen';

interface TierProtectedRouteProps {
  children: React.ReactNode;
  requiredTier: UserTier;
}

const TierProtectedRoute = ({ children, requiredTier }: TierProtectedRouteProps) => {
  const { hasAccess, isLoading, hasError, userTier } = useTierCheck(requiredTier);
  
  // Handle loading state
  if (isLoading) {
    return <LoadingScreen message="Checking access permissions..." />;
  }
  
  // Handle error state
  if (hasError) {
    return <AccessDeniedScreen />;
  }
  
  // If no access, show access denied
  if (!hasAccess) {
    return <AccessDeniedScreen />;
  }
  
  // If has access, render children
  return <>{children}</>;
};

export default TierProtectedRoute;
