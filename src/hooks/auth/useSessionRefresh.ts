
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionManager } from './useSessionManager';

export const useSessionRefresh = () => {
  const { refreshSession } = useAuth();
  const { resetSessionState } = useSessionManager();
  const { toast } = useToast();
  
  const [refreshingSession, setRefreshingSession] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);

  // Function to handle session refresh
  const handleRefreshSession = useCallback(async (): Promise<boolean> => {
    try {
      console.log("Attempting to refresh session");
      setRefreshingSession(true);
      setConnectionRetries(prev => prev + 1);
      
      // First try to reset session state to clear any stale data
      if (connectionRetries > 0) {
        await resetSessionState();
      }
      
      // Then attempt to refresh the session
      const refreshedUser = await refreshSession();
      
      if (refreshedUser) {
        console.log("Session refresh successful, user retrieved");
        toast({
          title: "Connection restored",
          description: "Your session has been refreshed successfully.",
          variant: "default",
        });
        return true;
      } else {
        console.log("Session refresh completed but no user retrieved");
        toast({
          title: "Connection attempt failed",
          description: "Could not establish connection. Please try again or reload the page.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error during session refresh:", error);
      toast({
        title: "Session refresh failed",
        description: "Could not refresh your session. Please try reloading the page.",
        variant: "destructive",
      });
      return false;
    } finally {
      setRefreshingSession(false);
    }
  }, [refreshSession, resetSessionState, connectionRetries, toast]);

  return {
    refreshingSession,
    connectionRetries,
    handleRefreshSession,
    setRefreshingSession
  };
};
