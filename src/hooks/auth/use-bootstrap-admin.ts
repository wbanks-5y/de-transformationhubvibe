import { useState, useEffect } from 'react';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';

/**
 * Hook for handling bootstrap admin functionality
 */
export const useBootstrapAdmin = () => {
  const { organizationClient } = useOrganization();
  const [needsBootstrap, setNeedsBootstrap] = useState<boolean | null>(null);
  const [isFirstAdmin, setIsFirstAdmin] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Check if system needs bootstrap admin
  const checkBootstrapNeeded = async () => {
    if (!organizationClient) {
      console.log('No organization client available for bootstrap check');
      return false;
    }
    
    try {
      setIsChecking(true);
      const { data, error } = await organizationClient.rpc('needs_bootstrap_admin');
      
      if (error) {
        console.error('Error checking bootstrap status:', error);
        return false;
      }
      
      setNeedsBootstrap(data);
      return data;
    } catch (error) {
      console.error('Error in checkBootstrapNeeded:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  // Check if current user is the first admin
  const checkIsFirstAdmin = async () => {
    if (!organizationClient) {
      console.log('No organization client available for first admin check');
      return false;
    }
    
    try {
      const { data, error } = await organizationClient.rpc('is_first_admin');
      
      if (error) {
        console.error('Error checking first admin status:', error);
        return false;
      }
      
      setIsFirstAdmin(data);
      return data;
    } catch (error) {
      console.error('Error in checkIsFirstAdmin:', error);
      return false;
    }
  };

  // Assign bootstrap admin role to a specific email
  const assignBootstrapAdmin = async (email: string) => {
    if (!organizationClient) {
      toast.error('Organization not available', {
        description: 'Please select an organization first'
      });
      return false;
    }
    
    try {
      const { data, error } = await organizationClient.rpc('handle_bootstrap_admin_assignment', {
        user_email: email
      });
      
      if (error) {
        console.error('Error assigning bootstrap admin:', error);
        toast.error('Failed to assign admin role', {
          description: error.message
        });
        return false;
      }
      
      if (data) {
        toast.success('Admin role assigned successfully', {
          description: `${email} is now an administrator`
        });
        // Refresh bootstrap status
        await checkBootstrapNeeded();
        return true;
      } else {
        toast.info('No action needed', {
          description: 'Admin role already exists or user not found'
        });
        return false;
      }
    } catch (error: any) {
      console.error('Error in assignBootstrapAdmin:', error);
      toast.error('Failed to assign admin role', {
        description: error?.message || 'An unexpected error occurred'
      });
      return false;
    }
  };

  // Check bootstrap status on mount
  useEffect(() => {
    if (organizationClient) {
      checkBootstrapNeeded();
      checkIsFirstAdmin();
    }
  }, [organizationClient]);

  return {
    needsBootstrap,
    isFirstAdmin,
    isChecking,
    checkBootstrapNeeded,
    checkIsFirstAdmin,
    assignBootstrapAdmin
  };
};