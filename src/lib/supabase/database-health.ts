import type { SupabaseClient } from '@supabase/supabase-js';

export interface DatabaseHealthStatus {
  rolesTableExists: boolean;
  userRolesTableExists: boolean;
  isAdminFunctionExists: boolean;
  secureAssignFunctionExists: boolean;
  bootstrapFunctionExists: boolean;
  adminCount: number;
  isHealthy: boolean;
  errors: string[];
  adminFunctionError?: string;
  secureAssignFunctionError?: string;
}

/**
 * Checks the health of the database schema required for the role system
 */
export const checkDatabaseHealth = async (
  client: SupabaseClient
): Promise<DatabaseHealthStatus> => {
  const status: DatabaseHealthStatus = {
    rolesTableExists: false,
    userRolesTableExists: false,
    isAdminFunctionExists: false,
    secureAssignFunctionExists: false,
    bootstrapFunctionExists: false,
    adminCount: 0,
    isHealthy: false,
    errors: []
  };

  try {
    // Check if roles table exists
    const { data: rolesData, error: rolesError } = await client
      .from('roles')
      .select('id')
      .limit(1);
    
    if (!rolesError) {
      status.rolesTableExists = true;
    } else if (rolesError.code === 'PGRST116' || rolesError.message.includes('does not exist')) {
      status.errors.push('roles table does not exist');
    } else {
      status.errors.push(`roles table check failed: ${rolesError.message}`);
    }

    // Check if user_roles table exists
    const { data: userRolesData, error: userRolesError } = await client
      .from('user_roles')
      .select('id')
      .limit(1);
    
    if (!userRolesError) {
      status.userRolesTableExists = true;
    } else if (userRolesError.code === 'PGRST116' || userRolesError.message.includes('does not exist')) {
      status.errors.push('user_roles table does not exist');
    } else {
      status.errors.push(`user_roles table check failed: ${userRolesError.message}`);
    }

    // Check if is_admin_secure function exists
    try {
      const { data: isAdminData, error: isAdminError } = await client.rpc('is_admin_secure');
      
      // If ANY error occurred, treat function as missing
      if (isAdminError) {
        const errorDetails = `${isAdminError.code || 'NO_CODE'}: ${isAdminError.message || 'NO_MESSAGE'}`;
        status.adminFunctionError = errorDetails;
        
        // Check for known "function not found" indicators
        const isMissingFunction = 
          isAdminError.code === 'PGRST116' ||  // PostgREST: function not found
          isAdminError.code === 'PGRST202' ||  // PostgREST: schema cache miss
          isAdminError.code === '42883' ||     // PostgreSQL: undefined function
          (isAdminError as any).status === 404 ||
          isAdminError.message?.toLowerCase().includes('does not exist') ||
          isAdminError.message?.toLowerCase().includes('not found') ||
          isAdminError.details?.toLowerCase().includes('does not exist') ||
          isAdminError.hint?.toLowerCase().includes('does not exist');
        
        if (isMissingFunction) {
          status.errors.push('is_admin_secure function does not exist');
          status.isAdminFunctionExists = false;
        } else {
          // Some other error - still treat as missing for safety
          status.errors.push(`is_admin_secure function check failed: ${errorDetails}`);
          status.isAdminFunctionExists = false;
        }
      } else {
        // No error means function exists (data could be true/false - doesn't matter)
        status.isAdminFunctionExists = true;
      }
    } catch (err: any) {
      const errorDetails = `${err.code || 'NO_CODE'}: ${err.message || 'NO_MESSAGE'}`;
      status.adminFunctionError = errorDetails;
      status.errors.push(`Unexpected error checking is_admin_secure: ${errorDetails}`);
      status.isAdminFunctionExists = false;
    }

    // Check if secure_assign_admin_role function exists
    try {
      // Call with a bogus email to test existence (will fail authorization, but that's ok)
      const { data: assignData, error: assignError } = await client.rpc('secure_assign_admin_role', {
        target_email: 'test-function-existence@invalid.local'
      });
      
      // If ANY error occurred, check if it's a "function not found" error
      if (assignError) {
        const errorDetails = `${assignError.code || 'NO_CODE'}: ${assignError.message || 'NO_MESSAGE'}`;
        status.secureAssignFunctionError = errorDetails;
        
        const isMissingFunction = 
          assignError.code === 'PGRST116' ||
          assignError.code === 'PGRST202' ||
          assignError.code === '42883' ||
          (assignError as any).status === 404 ||
          assignError.message?.toLowerCase().includes('does not exist') ||
          assignError.message?.toLowerCase().includes('not found') ||
          assignError.details?.toLowerCase().includes('does not exist');
        
        if (isMissingFunction) {
          status.errors.push('secure_assign_admin_role function does not exist');
          status.secureAssignFunctionExists = false;
        } else {
          // Function exists but returned an authorization/business logic error (expected)
          status.secureAssignFunctionExists = true;
        }
      } else {
        // No error means function exists and worked (shouldn't happen with bogus email, but ok)
        status.secureAssignFunctionExists = true;
      }
    } catch (err: any) {
      const errorDetails = `${err.code || 'NO_CODE'}: ${err.message || 'NO_MESSAGE'}`;
      status.secureAssignFunctionError = errorDetails;
      status.errors.push(`Unexpected error checking secure_assign_admin_role: ${errorDetails}`);
      status.secureAssignFunctionExists = false;
    }

    // Check if bootstrap_first_admin function exists
    // Note: Since this function doesn't exist in types yet, we skip this check
    // It will be created by the migration
    status.bootstrapFunctionExists = false;

    // Count existing admins (only if tables exist)
    if (status.rolesTableExists && status.userRolesTableExists) {
      try {
        // First get the admin role id
        const { data: adminRole } = await client
          .from('roles')
          .select('id')
          .eq('name', 'admin')
          .maybeSingle();
        
        if (adminRole) {
          // Then count user_roles with that role_id
          const { data: admins, error: adminsError } = await client
            .from('user_roles')
            .select('id')
            .eq('role_id', adminRole.id);
          
          if (!adminsError && admins) {
            status.adminCount = admins.length;
          }
        }
      } catch (err) {
        // Silently fail admin count check
        console.error('Could not count admins:', err);
      }
    }

  } catch (error: any) {
    status.errors.push(`Unexpected error: ${error.message}`);
  }

  // Determine overall health
  status.isHealthy = 
    status.rolesTableExists &&
    status.userRolesTableExists &&
    status.isAdminFunctionExists &&
    status.secureAssignFunctionExists &&
    status.errors.length === 0;

  return status;
};
