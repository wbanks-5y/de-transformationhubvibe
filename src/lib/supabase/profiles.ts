import { supabase } from './client';
import type { SupabaseClient } from '@supabase/supabase-js';

// Security-enhanced profile management
export const ensureUserProfile = async (userId: string, userData?: any, client?: SupabaseClient) => {
  const supabaseClient = client || supabase;
  if (!userId) return null;
  
  try {
    // Log security event for profile access
    await supabaseClient.rpc('log_security_event', {
      p_action: 'profile_access',
      p_resource_type: 'profile',
      p_resource_id: userId,
      p_success: true
    });

    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabaseClient
      .from('profiles')
      .select()
      .eq('id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching profile:", fetchError);
      return null;
    }
    
    // If profile exists, return it
    if (existingProfile) {
      return existingProfile;
    }
    
    // Otherwise create profile with enhanced security
    const { data: user } = await supabaseClient.auth.getUser();
    const userMetadata = user?.user?.user_metadata || {};
    
    const profileData = {
      id: userId,
      full_name: userData?.full_name || userMetadata.full_name || '',
      company: userData?.company || userMetadata.company || '',
      job_title: userData?.job_title || userMetadata.job_title || '',
      phone: userData?.phone || userMetadata.phone || '',
      updated_at: new Date().toISOString()
    };
    
    const { data: newProfile, error: insertError } = await supabaseClient
      .from('profiles')
      .insert(profileData)
      .select()
      .single();
      
    if (insertError) {
      console.error("Error creating profile:", insertError);
      await supabaseClient.rpc('log_security_event', {
        p_action: 'profile_creation_failed',
        p_resource_type: 'profile',
        p_resource_id: userId,
        p_success: false,
        p_details: { error: insertError.message }
      });
      return null;
    }

    await supabaseClient.rpc('log_security_event', {
      p_action: 'profile_created',
      p_resource_type: 'profile',
      p_resource_id: userId,
      p_success: true
    });
    
    return newProfile;
  } catch (error) {
    console.error("Error in ensureUserProfile:", error);
    await supabaseClient.rpc('log_security_event', {
      p_action: 'profile_error',
      p_resource_type: 'profile',
      p_resource_id: userId,
      p_success: false,
      p_details: { error: String(error) }
    });
    return null;
  }
};
