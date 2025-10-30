
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  lastResetTime: number | null;
  canRequestReset: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const RESET_COOLDOWN_MS = 60000; // 1 minute cooldown
const STORAGE_KEY = 'password_reset_last_time';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastResetTime, setLastResetTime] = useState<number | null>(null);

  // Initialize last reset time from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedTime = parseInt(stored, 10);
      setLastResetTime(parsedTime);
      console.log('Loaded last reset time from storage:', new Date(parsedTime).toLocaleString());
    }
  }, []);

  // Calculate if user can request reset
  const canRequestReset = !lastResetTime || (Date.now() - lastResetTime) > RESET_COOLDOWN_MS;

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData?: Record<string, any>) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: userData
      }
    });

    if (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    console.log('🔍 Reset password attempt started:', {
      email,
      canRequestReset,
      lastResetTime: lastResetTime ? new Date(lastResetTime).toLocaleString() : 'none',
      timeSinceLastReset: lastResetTime ? Date.now() - lastResetTime : 'N/A',
      cooldownRemaining: lastResetTime ? Math.max(0, RESET_COOLDOWN_MS - (Date.now() - lastResetTime)) : 0
    });

    // Check client-side rate limiting
    if (!canRequestReset) {
      const timeLeft = Math.ceil((RESET_COOLDOWN_MS - (Date.now() - (lastResetTime || 0))) / 1000);
      const errorMsg = `Please wait ${timeLeft} seconds before requesting another password reset.`;
      console.log('❌ Client-side rate limit hit:', errorMsg);
      throw new Error(errorMsg);
    }

    // Construct the correct redirect URL for password reset
    const resetUrl = `${window.location.origin}/reset-password`;
    
    console.log('📧 Sending password reset email:', {
      email,
      redirectTo: resetUrl,
      currentOrigin: window.location.origin,
      timestamp: new Date().toISOString()
    });
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });

      if (error) {
        console.error('❌ Supabase reset password error:', {
          message: error.message,
          status: error.status,
          errorCode: error.name,
          timestamp: new Date().toISOString()
        });
        
        // Handle specific rate limit error patterns
        const isRateLimit = error.message.includes('rate limit') || 
                           error.message.includes('429') ||
                           error.message.includes('Too many requests') ||
                           error.status === 429;
        
        if (isRateLimit) {
          // Update the timestamp even on server rate limit to prevent immediate retry
          const now = Date.now();
          setLastResetTime(now);
          localStorage.setItem(STORAGE_KEY, now.toString());
          console.log('⏰ Updated rate limit timestamp due to server error:', new Date(now).toLocaleString());
          
          throw new Error('Too many password reset requests. Please wait 1 minute before trying again, or check your email inbox and spam folder for the reset link.');
        }
        
        throw error;
      }

      // Update last reset time on successful request
      const now = Date.now();
      setLastResetTime(now);
      localStorage.setItem(STORAGE_KEY, now.toString());
      
      console.log('✅ Password reset email sent successfully:', {
        timestamp: new Date(now).toLocaleString(),
        nextAllowedTime: new Date(now + RESET_COOLDOWN_MS).toLocaleString()
      });

      toast.success('Password reset email sent! Check your inbox for the reset link.');
    } catch (error: any) {
      console.error('💥 Unexpected error in resetPassword:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    signUp,
    resetPassword,
    lastResetTime,
    canRequestReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
