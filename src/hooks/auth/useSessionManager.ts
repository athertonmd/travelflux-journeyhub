
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
      
      // If we have a session, try to refresh it
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
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
    } catch (error) {
      console.error("Error in refreshSession:", error);
      return null;
    }
  };

  /**
   * Check the current session
   */
  const checkCurrentSession = async (): Promise<{ 
    session: any | null, 
    error: Error | null 
  }> => {
    try {
      console.log("Checking current session");
      const { data, error } = await supabase.auth.getSession();
      
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

  return {
    refreshSession,
    checkCurrentSession
  };
};
