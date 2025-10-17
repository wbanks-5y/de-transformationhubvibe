
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOptimizedUserApproval } from '@/hooks/auth/use-optimized-user-approval';
import LoadingScreen from '@/components/LoadingScreen';
import PendingApprovalScreen from '@/components/auth/PendingApprovalScreen';
import AccessDeniedScreen from '@/components/auth/AccessDeniedScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
}

const ProtectedRoute = ({ children, requireApproval = true }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { userStatus, isLoading: approvalLoading, isApproved } = useOptimizedUserApproval();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // If approval is required, check approval status
  if (requireApproval) {
    if (approvalLoading) {
      return <LoadingScreen message="Checking approval status..." />;
    }

    if (userStatus === 'rejected') {
      return <AccessDeniedScreen />;
    }

    if (userStatus === 'pending' || !isApproved) {
      return <PendingApprovalScreen />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
