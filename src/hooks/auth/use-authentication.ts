
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook for handling core authentication operations (sign in, sign up, sign out)
 */
export const useAuthentication = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      setIsAuthenticating(true);
      setLastError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLastError(error.message);
        throw error;
      }
      toast.success('Signed in successfully');
    } catch (error: any) {
      setLastError(error?.message || 'Unknown error');
      toast.error('Authentication error', {
        description: error?.message || "Failed to sign in"
      });
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Record<string, any>) => {
    try {
      setIsAuthenticating(true);
      setLastError(null);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      if (error) {
        setLastError(error.message);
        throw error;
      }
      
      toast.success('Registration successful', {
        description: 'Your account is pending admin approval. You will receive an email when your account is approved.'
      });
    } catch (error: any) {
      setLastError(error?.message || 'Unknown error');
      toast.error('Registration error', {
        description: error?.message || "Failed to sign up"
      });
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = async () => {
    try {
      setLastError(null);
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      setLastError(error?.message || 'Unknown error');
      toast.error('Sign out error', {
        description: "Failed to sign out"
      });
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    isAuthenticating,
    lastError
  };
};
