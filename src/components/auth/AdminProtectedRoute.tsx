
import { Navigate } from 'react-router-dom';
import { useCachedAdminCheck } from '@/hooks/auth/use-cached-admin-check';
import AdminLoadingState from './AdminLoadingState';
import AdminErrorState from './AdminErrorState';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { isAdmin, isLoading, hasError, handleRetry } = useCachedAdminCheck();
  
  // Handle loading state
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  // Handle error state
  if (hasError) {
    return <AdminErrorState onRetry={handleRetry} />;
  }
  
  // If not admin, redirect
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // If admin, render children
  return <>{children}</>;
};

export default AdminProtectedRoute;
