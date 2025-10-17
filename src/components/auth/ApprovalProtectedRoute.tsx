
import React from 'react';
import { useOptimizedUserApproval } from '@/hooks/auth/use-optimized-user-approval';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PendingApprovalScreen from './PendingApprovalScreen';
import AccessDeniedScreen from './AccessDeniedScreen';
import LoadingScreen from '@/components/LoadingScreen';

interface ApprovalProtectedRouteProps {
  children: React.ReactNode;
}

const ApprovalProtectedRoute = ({ children }: ApprovalProtectedRouteProps) => {
  const { user } = useAuth();
  const { userStatus, isLoading, isApproved } = useOptimizedUserApproval();

  return (
    <ProtectedRoute>
      {isLoading ? (
        <LoadingScreen message="Checking approval status..." />
      ) : userStatus === 'pending' ? (
        <PendingApprovalScreen />
      ) : userStatus === 'rejected' ? (
        <AccessDeniedScreen />
      ) : isApproved ? (
        <>{children}</>
      ) : (
        <PendingApprovalScreen />
      )}
    </ProtectedRoute>
  );
};

export default ApprovalProtectedRoute;
