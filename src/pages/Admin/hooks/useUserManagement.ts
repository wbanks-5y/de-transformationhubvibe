import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { customerClient } from "@/lib/supabase/customer-client";
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from "sonner";
import { fetchAllAuthUsers, fetchAllProfiles, fetchAllUserRoles, updateUserProfile, updateUserStatus, deleteUser } from "@/services/adminService";

interface User {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string | null;
  full_name?: string;
  company?: string;
  job_title?: string;
  phone?: string;
  status?: string;
  tier?: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  invited_at: string;
  status: string;
}

export const useUserManagement = () => {
  const { organizationClient } = useOrganization();
  const [users, setUsers] = useState<User[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingInvitations = async () => {
    try {
      console.log('Fetching pending invitations via edge function...');
      
      const { data, error } = await customerClient.functions.invoke('invite-user', {
        method: 'GET'
      });
      
      if (error) {
        console.error('Error fetching invitations:', error);
        toast.error("Failed to fetch pending invitations");
        return;
      }

      console.log('Pending invitations response:', data);
      setPendingInvitations(data.invitations || []);
    } catch (error: any) {
      console.error('Error fetching pending invitations:', error);
      toast.error("Failed to fetch pending invitations");
    }
  };

  const fetchUsers = async () => {
    if (!organizationClient) {
      console.error("Organization client not available");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching users...");
      
      // Fetch all profiles first
      const profiles = await fetchAllProfiles(organizationClient).catch(err => {
        console.error("Profiles error:", err);
        throw err;
      });
      
      console.log("Profiles fetched:", profiles?.length);
      
      // Fetch all user roles
      const userRoles = await fetchAllUserRoles(organizationClient).catch(err => {
        console.error("User roles error:", err);
        return [];
      });
      
      // Fetch all auth users via the new edge function
      const allAuthUsers = await fetchAllAuthUsers().catch(err => {
        console.error("Auth users error:", err);
        throw err;
      });
      
      console.log("Auth users fetched:", allAuthUsers?.length);
      
      // Create a combined user list
      let usersList: User[] = [];
      
      // Process all auth users
      for (const authUser of allAuthUsers) {
        // Find corresponding profile if it exists
        const profile = profiles?.find(p => p.id === authUser.id);
        
        usersList.push({
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at || new Date().toISOString(),
          last_sign_in_at: authUser.last_sign_in_at,
          full_name: profile?.full_name || authUser.raw_user_meta_data?.full_name || authUser.email,
          company: profile?.company || authUser.raw_user_meta_data?.company || '',
          job_title: profile?.job_title || '',
          phone: profile?.phone || '',
          status: profile?.status || 'pending',
          tier: profile?.tier || 'essential'
        });
      }
      
      // Add any profiles that might not have corresponding auth users
      if (profiles && profiles.length > 0) {
        for (const profile of profiles) {
          // Skip if this profile is already added
          if (usersList.some(user => user.id === profile.id)) {
            continue;
          }
          
          usersList.push({
            id: profile.id,
            email: `${profile.id.slice(0, 8)}@example.com`, // Fallback email
            created_at: profile.updated_at || new Date().toISOString(),
            last_sign_in_at: null,
            full_name: profile.full_name || 'Unknown user',
            company: profile.company || '',
            job_title: profile.job_title || '',
            phone: profile.phone || '',
            status: profile.status || 'pending',
            tier: profile.tier || 'essential'
          });
        }
      }
      
      // Ensure we don't have duplicate users
      usersList = usersList.filter((user, index, self) => 
        index === self.findIndex((u) => u.id === user.id)
      );
      
      console.log("Final users list:", usersList.length);
      setUsers(usersList);
      
    } catch (error: any) {
      console.error("Error in fetchUsers:", error);
      setError(error.message || "Failed to load users");
      toast.error("Error fetching users", {
        description: error.message || "Failed to load users"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id: string, userData: any) => {
    if (!organizationClient) {
      toast.error("Organization client not available");
      return;
    }
    
    try {
      await updateUserProfile(id, {
        full_name: userData.fullName,
        company: userData.company,
        job_title: userData.jobTitle,
        phone: userData.phone,
        status: userData.status,
        tier: userData.tier
      }, organizationClient);
      
      // Re-fetch the data to ensure we have the latest state from the database
      await fetchUsers();
      
      toast.success('User updated successfully');
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user", {
        description: error.message || "An error occurred"
      });
    }
  };

  const handleUpdateUserStatus = async (id: string, status: string) => {
    if (!organizationClient) {
      toast.error("Organization client not available");
      return;
    }
    
    try {
      console.log(`Updating user ${id} status to ${status}`);
      await updateUserStatus(id, status, organizationClient);
      
      // Re-fetch the data to ensure we have the latest state from the database
      await fetchUsers();
      
      toast.success(`User ${status} successfully`);
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status", {
        description: error.message || "An error occurred"
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      
      // Re-fetch the data to ensure we have the latest state from the database
      await fetchUsers();
      
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user", {
        description: error.message || "An error occurred"
      });
    }
  };

  const refreshData = () => {
    fetchUsers();
    fetchPendingInvitations();
  };

  useEffect(() => {
    if (organizationClient) {
      fetchUsers();
      fetchPendingInvitations();
    }
  }, [organizationClient]);

  return {
    users,
    pendingInvitations,
    loading,
    error,
    handleUpdateUser,
    handleUpdateUserStatus,
    handleDeleteUser,
    refreshData,
  };
};
