
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

/**
 * Hook that manages session refresh functionality
 */
export const useSessionRefresh = (refreshSession: () => Promise<any>) => {
  const [isRefreshingSession, setIsRefreshingSession] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  
  const handleSessionRefresh = useCallback(async () => {
    // Prevent rapid consecutive refreshes (debounce)
    const now = Date.now();
    if (now - lastRefreshTime < 5000) {
      console.log("Refresh request debounced, too soon since last attempt");
      return;
    }
    
    try {
      if (isRefreshingSession) {
        console.log("Session refresh already in progress");
        return;
      }
      
      console.log("Manually refreshing session...");
      setIsRefreshingSession(true);
      setRetryCount(prev => prev + 1);
      setLastRefreshTime(now);
      
      // Store current page path before refresh
      const currentPath = window.location.pathname;
      sessionStorage.setItem('lastActivePath', currentPath);
      
      await refreshSession();
      
      toast.success("Session refreshed successfully");
      
      // Check if we need to restore any admin state
      if (currentPath.startsWith('/admin')) {
        sessionStorage.setItem('adminSessionRestored', 'true');
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
      toast.error("Refresh failed. Please try again or reload the page");
    } finally {
      setIsRefreshingSession(false);
    }
  }, [refreshSession, isRefreshingSession, lastRefreshTime]);

  return {
    isRefreshingSession,
    retryCount,
    handleSessionRefresh,
    setIsRefreshingSession,
    lastRefreshTime
  };
};
