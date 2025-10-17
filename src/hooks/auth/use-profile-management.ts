import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Provider } from '@supabase/supabase-js';

/**
 * Hook for managing user profile operations
 */
export const useProfileManagement = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const updateUserProfile = async (data: Record<string, any>) => {
    try {
      setIsUpdating(true);
      setLastError(null);
      const { error } = await supabase.auth.updateUser({
        data
      });
      if (error) {
        setLastError(error.message);
        throw error;
      }
      toast.success('Profile updated successfully');
    } catch (error: any) {
      setLastError(error?.message || 'Unknown error');
      toast.error('Failed to update profile', {
        description: error?.message || "An unknown error occurred"
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      setLastError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setLastError(error.message);
        throw error;
      }
      toast.success('Password reset email sent', {
        description: "Check your email for the password reset link"
      });
    } catch (error: any) {
      setLastError(error?.message || 'Unknown error');
      toast.error('Password reset error', {
        description: error?.message || "Failed to send reset email"
      });
      throw error;
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      setIsUpdating(true);
      setLastError(null);
      // Currently disabled, but keeping the function for future use
      toast.message('Feature coming soon', {
        description: `Sign in with ${provider} will be available soon`
      });
    } catch (error: any) {
      setLastError(error?.message || 'Unknown error');
      toast.error('Authentication error', {
        description: error?.message || `Failed to sign in with ${provider}`
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateUserProfile,
    resetPassword,
    signInWithProvider,
    isUpdating,
    lastError
  };
};
