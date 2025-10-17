
import { Navigate } from 'react-router-dom';
import { useSecureAdminCheck } from '@/hooks/auth/use-secure-admin-check';
import AdminLoadingState from './AdminLoadingState';
import AdminErrorState from './AdminErrorState';

interface SecureAdminProtectedRouteProps {
  children: React.ReactNode;
}

const SecureAdminProtectedRoute = ({ children }: SecureAdminProtectedRouteProps) => {
  const { isAdmin, isLoading, error, refetch } = useSecureAdminCheck();
  
  // Handle loading state
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  // Handle error state
  if (error) {
    return (
      <AdminErrorState 
        onRetry={refetch} 
        canRetry={true}
        sessionValid={true}
        message="Unable to verify admin permissions. Please try again."
      />
    );
  }
  
  // If not admin, redirect
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // If admin, render children
  return <>{children}</>;
};

export default SecureAdminProtectedRoute;
