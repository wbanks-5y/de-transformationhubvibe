/**
 * Helper functions for organization-specific configurations
 */

/**
 * Determines the correct invite-user edge function name based on organization's Supabase URL.
 * MasterDB uses 'invite-users' (plural), 5Y Database uses 'invite-user' (singular).
 */
export const getInviteUserFunctionName = (supabaseUrl: string): string => {
  if (supabaseUrl.includes('mcbvzxnkhcohiieeovdp')) {
    return 'invite-users';
  }
  return 'invite-user';
};
