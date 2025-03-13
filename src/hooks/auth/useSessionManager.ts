
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
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.log("No active session found during refresh");
        return null;
      }
      
      return await fetchUserConfig(data.session.user);
    } catch (error) {
      console.error("Error refreshing session:", error);
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
