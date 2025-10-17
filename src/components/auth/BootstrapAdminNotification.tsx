import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { useBootstrapAdmin } from '@/hooks/auth';
import { toast } from 'sonner';
import { Shield, AlertTriangle } from 'lucide-react';

/**
 * Component that handles bootstrap admin notifications and warnings
 */
const BootstrapAdminNotification = () => {
  const { user } = useAuth();
  const { organizationClient } = useOrganization();
  
  // Don't run bootstrap checks without organization context
  if (!organizationClient) {
    return null;
  }
  
  const { needsBootstrap, isFirstAdmin, isChecking } = useBootstrapAdmin();

  useEffect(() => {
    // Show notification only if user is the actual first admin
    if (user && isFirstAdmin === true && !isChecking) {
      // Use user-specific localStorage key to prevent showing to other admins
      const notificationKey = `first_admin_notification_${user.id}`;
      if (localStorage.getItem(notificationKey) !== 'shown') {
        toast.success('Welcome, Administrator!', {
          description: 'You have been assigned as the first administrator of this system. Please secure your account and configure additional users as needed.',
          duration: 8000,
          icon: <Shield className="h-4 w-4" />
        });
        localStorage.setItem(notificationKey, 'shown');
      }
    }
  }, [user, isFirstAdmin, isChecking]);

  // Show warning if system still needs bootstrap admin
  useEffect(() => {
    if (needsBootstrap === true && !user) {
      toast.info('System Setup Required', {
        description: 'This system needs an administrator. The first user to register will automatically become the admin.',
        duration: 6000,
        icon: <AlertTriangle className="h-4 w-4" />
      });
    }
  }, [needsBootstrap, user]);

  // This component doesn't render anything - it only handles notifications
  return null;
};

export default BootstrapAdminNotification;