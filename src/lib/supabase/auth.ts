import { supabase } from './client';
import type { SupabaseClient } from '@supabase/supabase-js';

// Helper function to assign admin role to a user by email - SECURE VERSION
export const assignAdminRoleByEmail = async (
  email: string, 
  client?: SupabaseClient
): Promise<boolean> => {
  const supabaseClient = client || supabase;
  try {
    // Use the secure database function instead of direct manipulation
    const { data, error } = await supabaseClient.rpc('secure_assign_admin_role', {
      target_email: email
    });
    
    if (error) {
      console.error("Error in secure admin assignment:", error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error("Error in assignAdminRoleByEmail:", error);
    return false;
  }
};

// Helper function to check if a user is an admin using secure function
export const isUserAdmin = async (
  userId: string, 
  client?: SupabaseClient
): Promise<boolean> => {
  const supabaseClient = client || supabase;
  try {
    if (!userId) return false;
    
    const { data, error } = await supabaseClient.rpc('is_admin_secure');
    
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in isUserAdmin:", error);
    return false;
  }
};
