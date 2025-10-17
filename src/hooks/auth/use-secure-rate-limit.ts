import { useEnhancedSecurityValidation } from '@/hooks/auth/use-enhanced-security-validation';
import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced secure rate limiting hook that uses server-side validation
 */
export const useSecureRateLimit = () => {
  const { checkRateLimit: clientRateLimit } = useEnhancedSecurityValidation();

  const checkRateLimit = async (
    action: string, 
    maxAttempts: number = 5, 
    windowMinutes: number = 15,
    identifier?: string
  ): Promise<{ allowed: boolean; attempts?: number; maxAttempts?: number; retryAfter?: number }> => {
    try {
      // First check client-side for immediate feedback
      const clientAllowed = clientRateLimit(action);
      if (!clientAllowed) {
        return { 
          allowed: false, 
          retryAfter: windowMinutes * 60,
          attempts: maxAttempts,
          maxAttempts 
        };
      }

      // Then check server-side for authoritative rate limiting
      const { data, error } = await supabase.functions.invoke('secure-rate-limit', {
        body: {
          action,
          identifier,
          maxAttempts,
          windowMinutes
        }
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        // Fall back to allowing the action if server check fails
        return { allowed: true };
      }

      return {
        allowed: data.allowed,
        attempts: data.attempts,
        maxAttempts: data.maxAttempts,
        retryAfter: data.retryAfter
      };

    } catch (error) {
      console.error('Rate limit error:', error);
      // Fall back to allowing the action on error
      return { allowed: true };
    }
  };

  return { checkRateLimit };
};