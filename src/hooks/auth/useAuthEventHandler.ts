
import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';
import { fetchUserConfig } from './useUserConfig';

/**
 * Hook to handle authentication events
 */
export const useAuthEventHandler = (setUser: React.Dispatch<React.SetStateAction<User | null>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const authStateChangeHandled = useRef(false);
  
  // Function to handle auth state changes
  const handleAuthChange = useCallback(async (event: string, session: any) => {
    console.log('Auth state changed:', event, session ? 'with session' : 'no session');
    authStateChangeHandled.current = true;

    if (!session || !session.user) {
      console.log('No active session, setting user to null');
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    try {
      const userWithConfig = await fetchUserConfig(session.user);
      
      if (userWithConfig) {
        console.log("Setting authenticated user:", userWithConfig);
        setUser(userWithConfig);
      } else {
        console.warn("Failed to fetch user config, user will remain null");
        setUser(null);
      }
      console.log("Setting isLoading to false after processing auth change");
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user config during auth change:', error);
      setUser(null);
      setIsLoading(false);
    }
  }, [setUser, setIsLoading]);

  const setupAuthListener = useCallback(() => {
    console.log("Setting up auth state listener");
    return supabase.auth.onAuthStateChange(handleAuthChange);
  }, [handleAuthChange]);

  const checkInitialSession = useCallback(async () => {
    if (!authStateChangeHandled.current) {
      console.log("Checking initial session as no auth state change detected yet");
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
          return { success: false, error };
        }
        
        if (data.session) {
          console.log("Found existing session, handling auth state");
          await handleAuthChange('INITIAL', data.session);
          return { success: true, session: data.session };
        } else {
          console.log('No active session found');
          setIsLoading(false);
          return { success: true, session: null };
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
        return { success: false, error };
      }
    } else {
      console.log("Skipping initial session check as auth state change was already handled");
      return { success: true, skipped: true };
    }
  }, [handleAuthChange, setIsLoading]);

  return {
    handleAuthChange,
    setupAuthListener,
    checkInitialSession,
    authStateChangeHandled
  };
};
