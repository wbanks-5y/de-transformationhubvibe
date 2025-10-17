import { supabase } from './client';
import type { SupabaseClient } from '@supabase/supabase-js';

// Role management functions with enhanced security
export type Role = 'admin' | 'manager' | 'user';

// Function to get all available roles (admin only)
export const getRoles = async (client?: SupabaseClient) => {
  const db = client || supabase;
  try {
    // Verify admin access using secure function
    const { data: isAdmin, error: adminError } = await db.rpc('is_admin_secure');
    
    if (adminError || !isAdmin) {
      try {
        await db.rpc('log_security_event', {
          p_action: 'unauthorized_role_access',
          p_resource_type: 'roles',
          p_success: false
        });
      } catch (logError) {
        // Security logging is optional - continue even if it fails
        console.warn('Security logging not available:', logError);
      }
      throw new Error('Unauthorized access to roles');
    }

    const { data: roles, error } = await db
      .from('roles')
      .select('*') as { data: any[], error: any };
      
    if (error) {
      console.error("Error fetching roles:", error);
      return [];
    }

    try {
      await db.rpc('log_security_event', {
        p_action: 'roles_accessed',
        p_resource_type: 'roles',
        p_success: true
      });
    } catch (logError) {
      // Security logging is optional - continue even if it fails
      console.warn('Security logging not available:', logError);
    }
    
    return roles || [];
  } catch (error) {
    console.error("Error in getRoles:", error);
    return [];
  }
};

// Function to get users with their roles (admin only)
export const getUsersWithRoles = async (client?: SupabaseClient) => {
  const db = client || supabase;
  try {
    // Verify admin access
    const { data: isAdmin, error: adminError } = await db.rpc('is_admin_secure');
    
    if (adminError || !isAdmin) {
      try {
        await db.rpc('log_security_event', {
          p_action: 'unauthorized_users_access',
          p_resource_type: 'users',
          p_success: false
        });
      } catch (logError) {
        console.warn('Security logging not available:', logError);
      }
      throw new Error('Unauthorized access to user data');
    }

    // Get all user profiles
    const { data: profiles, error: profilesError } = await db
      .from('profiles')
      .select('*') as { data: any[], error: any };
      
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return [];
    }

    // Get all user_roles
    const { data: userRoles, error: userRolesError } = await db
      .from('user_roles')
      .select('*') as { data: any[], error: any };
      
    if (userRolesError) {
      console.error("Error fetching user roles:", userRolesError);
      return [];
    }

    // Get all roles
    const { data: roles, error: rolesError } = await db
      .from('roles')
      .select('*') as { data: any[], error: any };
      
    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
      return [];
    }

    // Map users to their roles
    const usersWithRoles = profiles.map(profile => {
      const userRoleEntries = userRoles.filter(ur => ur.user_id === profile.id);
      const roleIds = userRoleEntries.map(ur => ur.role_id);
      const assignedRoles = roles.filter(role => roleIds.includes(role.id));
      
      return {
        ...profile,
        roles: assignedRoles
      };
    });

    try {
      await db.rpc('log_security_event', {
        p_action: 'users_with_roles_accessed',
        p_resource_type: 'users',
        p_success: true
      });
    } catch (logError) {
      console.warn('Security logging not available:', logError);
    }

    return usersWithRoles;
  } catch (error) {
    console.error("Error in getUsersWithRoles:", error);
    return [];
  }
};

// Function to assign a role to a user
export const assignRoleToUser = async (userId: string, roleId: string, client?: SupabaseClient) => {
  const db = client || supabase;
  
  // First check if user already has this role
  const { data: existing, error: checkError } = await db
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('role_id', roleId)
    .maybeSingle();
    
  if (checkError) {
    console.error("Error checking existing role:", checkError);
    throw new Error("Failed to check existing role assignment");
  }
  
  // If role already assigned, return a specific indicator
  if (existing) {
    return { isDuplicate: true };
  }
  
  // Proceed with insertion
  const { data, error } = await db
    .from('user_roles')
    .insert({
      user_id: userId,
      role_id: roleId
    })
    .select() as { data: any, error: any };
    
  if (error) {
    console.error("Error assigning role:", error);
    throw new Error(error.message || "Failed to assign role");
  }
  
  return { isDuplicate: false, data };
};

// Function to remove a role from a user
export const removeRoleFromUser = async (userId: string, roleId: string, client?: SupabaseClient) => {
  const db = client || supabase;
  
  const { error } = await db
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role_id', roleId) as { error: any };
    
  if (error) {
    console.error("Error removing role:", error);
    throw new Error(error.message || "Failed to remove role");
  }
  
  return true;
};

// Function to create a new role
export const createRole = async (name: string, description: string, client?: SupabaseClient) => {
  const db = client || supabase;
  try {
    const { data, error } = await db
      .from('roles')
      .insert({
        name,
        description
      })
      .select() as { data: any, error: any };
      
    if (error) {
      console.error("Error creating role:", error);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error("Error in createRole:", error);
    return null;
  }
};

// Function to update a role
export const updateRole = async (id: string, name: string, description: string, client?: SupabaseClient) => {
  const db = client || supabase;
  try {
    const { data, error } = await db
      .from('roles')
      .update({
        name,
        description
      })
      .eq('id', id)
      .select() as { data: any, error: any };
      
    if (error) {
      console.error("Error updating role:", error);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error("Error in updateRole:", error);
    return null;
  }
};

// Function to delete a role
export const deleteRole = async (id: string, client?: SupabaseClient) => {
  const db = client || supabase;
  try {
    const { error } = await db
      .from('roles')
      .delete()
      .eq('id', id) as { error: any };
      
    if (error) {
      console.error("Error deleting role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteRole:", error);
    return false;
  }
};
