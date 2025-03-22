
import { useEffect } from 'react';
import { isTokenExpired } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

interface SessionExpiryCheckerProps {
  user: User | null;
  isMounted: React.MutableRefObject<boolean>;
  refreshSession: () => Promise<User | null>;
}

/**
 * Hook to periodically check if the session token has expired
 */
export const useSessionExpiryChecker = ({
  user,
  isMounted,
  refreshSession
}: SessionExpiryCheckerProps) => {
  useEffect(() => {
    // Set up session expiry check interval
    const checkSessionExpiry = setInterval(async () => {
      if (!isMounted.current || !user) return;
      
      try {
        const expired = await isTokenExpired();
        if (expired) {
          console.log('Auth token has expired, refreshing session');
          refreshSession();
        }
      } catch (error) {
        console.error('Error checking token expiry:', error);
      }
    }, 60000); // Check every minute

    // Cleanup when unmounting
    return () => {
      clearInterval(checkSessionExpiry);
    };
  }, [user, isMounted, refreshSession]);
};
