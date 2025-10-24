import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from '@supabase/supabase-js';

// Type definitions
export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string | null;
  raw_user_meta_data?: any;
  email_confirmed_at?: string | null;
  invited_at?: string | null;
}

export interface UserProfile {
  id: string;
  email: string | null;
  created_at: string | null;
  full_name: string | null;
  company: string | null;
  job_title: string | null;
  phone: string | null;
  updated_at: string | null;
  status: string | null;
  tier: string | null;
}

/**
 * Fetch all users from Supabase Auth API via edge function
 * @deprecated No longer used - user data is fetched directly from profiles table
 */
export const fetchAllAuthUsers = async (): Promise<AuthUser[]> => {
  try {
    console.log('Fetching all auth users via edge function...');
    
    // Use the get-auth-users edge function
    const { data, error } = await supabase.functions.invoke('get-auth-users', {
      method: 'GET'
    });
    
    if (error) {
      console.error('Error fetching auth users:', error);
      throw new Error(error.message || 'Failed to fetch auth users');
    }

    console.log('Auth users response:', data);
    return data.users || [];
  } catch (error) {
    console.error("Error fetching auth users:", error);
    
    // Fallback: return at least the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      return [
        {
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          raw_user_meta_data: user.user_metadata,
          email_confirmed_at: user.email_confirmed_at,
          invited_at: user.invited_at
        }
      ];
    }
    
    return [];
  }
};

/**
 * Fetch all user profiles from the database
 */
export const fetchAllProfiles = async (client?: SupabaseClient): Promise<UserProfile[]> => {
  const supabaseClient = client || supabase;
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*');
    
  if (error) {
    throw error;
  }
  
  return data || [];
};

/**
 * Fetch all user roles from the database
 */
export const fetchAllUserRoles = async (client?: SupabaseClient) => {
  const supabaseClient = client || supabase;
  const { data, error } = await supabaseClient
    .from('user_roles')
    .select('*');
    
  if (error) {
    throw error;
  }
  
  return data || [];
};

/**
 * Update a user profile - creates profile if it doesn't exist
 */
export const updateUserProfile = async (
  id: string,
  profileData: Partial<UserProfile>,
  client?: SupabaseClient
): Promise<UserProfile> => {
  const supabaseClient = client || supabase;
  // Check if profile already exists
  const { data: existingProfile, error: fetchError } = await supabaseClient
    .from('profiles')
    .select()
    .eq('id', id)
    .maybeSingle();
    
  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
    throw fetchError;
  }
  
  if (existingProfile) {
    // Update existing profile
    const { data, error } = await supabaseClient
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } else {
    // Create new profile
    const { data, error } = await supabaseClient
      .from('profiles')
      .insert({
        id,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};

/**
 * Update a user's status - ensures profile exists first
 */
export const updateUserStatus = async (id: string, status: string, client?: SupabaseClient): Promise<void> => {
  const supabaseClient = client || supabase;
  // First ensure the profile exists by trying to fetch it
  const { data: existingProfile, error: fetchError } = await supabaseClient
    .from('profiles')
    .select()
    .eq('id', id)
    .maybeSingle();
    
  if (fetchError && fetchError.code === 'PGRST116') {
    // Profile doesn't exist, create it with the new status
    const { error: insertError } = await supabaseClient
      .from('profiles')
      .insert({
        id,
        status,
        updated_at: new Date().toISOString()
      });
      
    if (insertError) throw insertError;
  } else if (fetchError) {
    // Some other error occurred
    throw fetchError;
  } else {
    // Profile exists, update it
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (updateError) throw updateError;
  }
};

/**
 * Delete a user completely - removes from auth and all related data
 */
export const deleteUser = async (id: string): Promise<void> => {
  try {
    console.log(`Deleting user ${id}...`);
    
    // Call the edge function to delete the user with proper permissions
    const { data, error } = await supabase.functions.invoke('delete-user', {
      body: { userId: id }
    });
    
    if (error) {
      console.error('Error calling delete-user function:', error);
      throw new Error(error.message || 'Failed to delete user');
    }
    
    if (data?.error) {
      console.error('Error from delete-user function:', data.error);
      throw new Error(data.error);
    }
    
    console.log(`User ${id} deleted successfully`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
