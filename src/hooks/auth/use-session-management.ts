
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserStatus } from '@/types/auth';

/**
 * Hook for managing session-related operations (refresh, fetch user status)
 * Optimized with reduced frequency and better timeout handling
 */
export const useSessionManagement = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);

  const fetchUserStatus = async (userId: string) => {
    if (!userId) return 'pending' as UserStatus;
    
    try {
      // Note: Uses default client as this happens during auth, before org selection
      const { data, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user status:', error);
        return 'pending' as UserStatus;
      }
      
      if (data?.status) {
        return data.status as UserStatus;
      }
      
      return 'pending' as UserStatus;
    } catch (error) {
      console.error('Error fetching user status:', error);
      return 'pending' as UserStatus;
    }
  };

  const refreshSession = async (forceRefresh = false) => {
    try {
      console.log(`Refreshing authentication session... (Attempt: ${retryAttempts + 1})`);
      setIsRefreshing(true);
      setLastError(null);
      
      // Check if we're in an admin page
      const isAdminPage = window.location.pathname.startsWith('/admin');
      
      // Increased delay for better performance
      if (retryAttempts > 0 && !forceRefresh) {
        const delayTime = Math.min(retryAttempts * 2000, 10000); // Max 10 seconds
        await new Promise(resolve => setTimeout(resolve, delayTime));
      }
      
      // First check if we have a session stored in localStorage
      const currentSession = await supabase.auth.getSession();
      
      // If valid session exists and not forcing a refresh, use it
      if (currentSession.data.session && !forceRefresh) {
        const tokenExpiryTimestamp = currentSession.data.session.expires_at;
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Only refresh if expires within 30 minutes (increased from 15)
        if (tokenExpiryTimestamp && (tokenExpiryTimestamp - currentTime) > 1800) {
          console.log('Current session is still valid, no refresh needed');
          
          // For admin pages, we also validate admin permissions are intact
          if (isAdminPage) {
            console.log('Admin page detected, validating admin status');
          }
          
          if (currentSession.data.session?.user) {
            const status = await fetchUserStatus(currentSession.data.session.user.id);
            return { 
              session: currentSession.data.session, 
              user: currentSession.data.session.user,
              userStatus: status
            };
          }
          
          return { 
            session: currentSession.data.session, 
            user: currentSession.data.session?.user ?? null,
            userStatus: 'pending' as UserStatus
          };
        }
      }
      
      // Use proper error handling for session refresh with increased timeout
      const { data, error } = await Promise.race([
        supabase.auth.refreshSession(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session refresh timeout')), 20000) // 20 second timeout
        )
      ]) as any;
      
      if (error) {
        console.error("Session refresh error:", error.message);
        
        // Increment retry attempts
        setRetryAttempts(prev => prev + 1);
        setLastError(error.message);
        
        // For critical errors or too many retries, throw immediately
        if (error.message.includes('JWT expired') || 
            error.message.includes('invalid token') || 
            retryAttempts >= 3) { // Increased retry limit
          throw error;
        }
        
        // For other errors, attempt recovery
        console.log("Attempting session recovery...");
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          throw new Error("No valid session available");
        }
        
        // Successfully recovered session
        console.log("Session recovered from getSession");
        
        if (sessionData.session?.user) {
          const status = await fetchUserStatus(sessionData.session.user.id);
          return { 
            session: sessionData.session, 
            user: sessionData.session.user,
            userStatus: status
          };
        }
        
        return { 
          session: sessionData.session, 
          user: sessionData.session?.user ?? null,
          userStatus: 'pending' as UserStatus
        };
      }
      
      console.log("Session refreshed successfully");
      // Reset retry attempts on success
      setRetryAttempts(0);
      
      if (data.session?.user) {
        const status = await fetchUserStatus(data.session.user.id);
        return { 
          session: data.session, 
          user: data.session.user,
          userStatus: status
        };
      }
      
      return { 
        session: data.session, 
        user: data.session?.user ?? null,
        userStatus: 'pending' as UserStatus
      };
    } catch (error: any) {
      console.error('Failed to refresh session:', error);
      setLastError(error?.message || 'Unknown error');
      
      // Only show toast for user-initiated refreshes or critical failures
      if (forceRefresh || retryAttempts >= 3) {
        toast.error('Failed to refresh authentication', {
          description: 'Please check your connection and try again'
        });
      }
      
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    refreshSession,
    fetchUserStatus,
    isRefreshing,
    lastError,
    retryAttempts
  };
};
