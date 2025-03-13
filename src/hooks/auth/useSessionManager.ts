
import { supabase } from '@/integrations/supabase/client';
import { fetchUserConfig } from './useUserConfig';
import { User } from '@/types/auth.types';

/**
 * Utility functions for managing sessions
 */
export const useSessionManager = () => {
  /**
   * Manually refresh the session and get user data
   */
  const refreshSession = async (): Promise<User | null> => {
    try {
      console.log("Manually refreshing session");
      
      // First try to get the session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session retrieval error:", sessionError);
        return null;
      }
      
      if (!sessionData.session) {
        console.log("No active session found during refresh");
        return null;
      }
      
      try {
        // If we have a session, try to refresh it
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: sessionData.session.refresh_token,
        });
        
        if (refreshError) {
          console.error("Session refresh error:", refreshError);
          // Even if refresh fails, try to fetch user config with existing session
          if (sessionData.session?.user) {
            return await fetchUserConfig(sessionData.session.user);
          }
          return null;
        }
        
        if (!refreshData.session) {
          console.log("No session after refresh attempt");
          return null;
        }
        
        console.log("Session refreshed successfully");
        return await fetchUserConfig(refreshData.session.user);
      } catch (refreshException) {
        console.error("Exception during refresh:", refreshException);
        // Fallback to existing session
        if (sessionData.session?.user) {
          return await fetchUserConfig(sessionData.session.user);
        }
        return null;
      }
    } catch (error) {
      console.error("Error in refreshSession:", error);
      return null;
    }
  };

  /**
   * Check the current session with a timeout
   */
  const checkCurrentSession = async (): Promise<{ 
    session: any | null, 
    error: Error | null 
  }> => {
    try {
      console.log("Checking current session");
      
      // Create a promise that rejects after a timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Session check timed out')), 3000);
      });
      
      // Create the session check promise
      const sessionCheckPromise = supabase.auth.getSession();
      
      // Race the promises
      const { data, error } = await Promise.race([
        sessionCheckPromise,
        timeoutPromise.then(() => {
          console.warn('Session check timed out, returning null session');
          return { data: { session: null }, error: new Error('Timed out') };
        })
      ]);
      
      if (error) {
        console.error('Session retrieval error:', error);
        return { session: null, error };
      }
      
      return { session: data.session, error: null };
    } catch (error) {
      console.error('Error checking session:', error instanceof Error ? error : new Error(String(error)));
      return { 
        session: null, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    }
  };

  /**
   * Force reset the session state (for recovery from stuck states)
   */
  const resetSessionState = async (): Promise<void> => {
    try {
      console.log("Forcefully resetting session state");
      // This will clear any cached session data and force a fresh fetch
      await supabase.auth.signOut({ scope: 'local' });
      console.log("Session state reset completed");
    } catch (error) {
      console.error("Error resetting session state:", error);
    }
  };

  return {
    refreshSession,
    checkCurrentSession,
    resetSessionState
  };
};
