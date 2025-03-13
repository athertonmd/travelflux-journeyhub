
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
        setTimeout(() => reject(new Error('Session check timed out')), 5000); // Increased timeout from 3000ms to 5000ms
      });
      
      // Create the session check promise
      const sessionCheckPromise = supabase.auth.getSession();
      
      // Race the promises
      const result = await Promise.race([
        sessionCheckPromise,
        timeoutPromise.catch(err => {
          console.warn('Session check timed out, falling back to cached session');
          // Instead of rejecting, return a fallback result
          return { data: { session: null }, error: new Error('Timed out but continuing') };
        })
      ]);
      
      // TypeScript safety for the result
      const { data, error } = result as { data: { session: any }, error: Error | null };
      
      if (error) {
        // Only log as error if it's not our handled timeout
        if (error.message !== 'Timed out but continuing') {
          console.error('Session retrieval error:', error);
        } else {
          console.warn('Using fallback for timed out session check');
        }
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
