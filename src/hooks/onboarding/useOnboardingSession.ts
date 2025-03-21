
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { clearAuthData } from '@/integrations/supabase/client';

export const useOnboardingSession = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { refreshSession } = useAuth();

  // Refresh the session
  const handleRefreshSession = useCallback(async () => {
    try {
      setError(null);
      setRetryCount(prev => prev + 1);
      
      console.log('Welcome: Manually refreshing session');
      const refreshedUser = await refreshSession();
      
      if (refreshedUser) {
        toast({
          title: "Connection restored",
          description: "Your session has been refreshed successfully."
        });
        return true;
      } else {
        setError("Session couldn't be refreshed. Please try logging in again.");
        return false;
      }
    } catch (err) {
      console.error('Welcome: Error refreshing session:', err);
      setError("An error occurred while refreshing your session.");
      return false;
    }
  }, [refreshSession]);

  // Clear all storage data and reload
  const handleClearAndReload = useCallback(() => {
    try {
      console.log('Welcome: Clearing storage and reloading');
      // Flag to prevent auth state change loops during manual clear
      sessionStorage.setItem('manual-clear-in-progress', 'true');
      
      clearAuthData();
      
      // Redirect to login with cleared=true parameter
      window.location.href = '/login?cleared=true';
    } catch (err) {
      console.error('Welcome: Error clearing storage:', err);
      toast({
        title: "Error",
        description: "Failed to clear storage. Please try again.",
        variant: "destructive"
      });
    }
  }, []);

  return {
    retryCount,
    error,
    setError,
    handleRefreshSession,
    handleClearAndReload
  };
};
