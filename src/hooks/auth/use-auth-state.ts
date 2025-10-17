
import { useState } from 'react';
import { UserStatus } from '@/types/auth';

/**
 * Hook for managing authentication state
 */
export const useAuthState = () => {
  const [userStatus, setUserStatus] = useState<UserStatus>('pending');
  
  return {
    userStatus,
    setUserStatus
  };
};
