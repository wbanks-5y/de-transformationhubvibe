import { useState, useEffect } from 'react';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';

export interface NonAdminUser {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
}

export const useNonAdminUsers = () => {
  const [users, setUsers] = useState<NonAdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { organizationClient } = useOrganization();

  const fetchNonAdminUsers = async () => {
    if (!organizationClient) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get the admin role ID
      const { data: adminRole, error: roleError } = await organizationClient
        .from('roles')
        .select('id')
        .eq('name', 'admin')
        .single();

      if (roleError) {
        throw new Error('Failed to fetch admin role');
      }

      // Get all users who do NOT have the admin role
      const { data: profiles, error: profilesError } = await organizationClient
        .from('profiles')
        .select('id, email, full_name, company')
        .order('email', { ascending: true });

      if (profilesError) {
        throw new Error('Failed to fetch user profiles');
      }

      // Get all user IDs that have admin role
      const { data: adminUserRoles, error: userRolesError } = await organizationClient
        .from('user_roles')
        .select('user_id')
        .eq('role_id', adminRole.id);

      if (userRolesError) {
        throw new Error('Failed to fetch user roles');
      }

      const adminUserIds = new Set(adminUserRoles?.map(ur => ur.user_id) || []);

      // Filter out users who are already admins
      const nonAdminUsers = profiles?.filter(profile => !adminUserIds.has(profile.id)) || [];

      setUsers(nonAdminUsers);
    } catch (err: any) {
      console.error('Error fetching non-admin users:', err);
      setError(err.message || 'Failed to load users');
      toast.error('Failed to load users', {
        description: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNonAdminUsers();
  }, [organizationClient]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchNonAdminUsers
  };
};
