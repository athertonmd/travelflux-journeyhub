
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';
import { fetchUserConfig } from './useUserConfig';
import { useSessionManager } from './useSessionManager';

export const useAuthStateCore = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const initialSessionChecked = useRef(false);
  const { refreshSession, checkCurrentSession } = useSessionManager();
  const lastRefreshAttempt = useRef<number>(0);
  const MAX_REFRESH_FREQUENCY = 5000; // 5 seconds between refresh attempts

  useEffect(() => {
    console.log("useAuthState: Initializing auth state");
    isMounted.current = true;
    setIsLoading(true);

    // Function to handle auth state changes
    const handleAuthChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event, session ? 'with session' : 'no session');

      // Don't set loading again if we're about to clear the user
      if (event !== 'SIGNED_OUT') {
        setIsLoading(true);
      }
      
      if (!session || !session.user) {
        if (isMounted.current) {
          console.log('No active session, setting user to null');
          setUser(null);
          setIsLoading(false);
        }
        return;
      }
      
      try {
        const userWithConfig = await fetchUserConfig(session.user);
        
        if (isMounted.current) {
          if (userWithConfig) {
            console.log("Setting authenticated user:", userWithConfig);
            setUser(userWithConfig);
          } else {
            console.warn("Failed to fetch user config, user will remain null");
            setUser(null);
          }
          console.log("Setting isLoading to false after processing auth change");
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user config during auth change:', error);
        if (isMounted.current) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    // Check current session immediately
    const checkSession = async () => {
      try {
        const { session } = await checkCurrentSession();
        initialSessionChecked.current = true;
        
        if (session) {
          console.log("Found existing session, handling auth state");
          await handleAuthChange('INITIAL', session);
        } else {
          console.log('No active session found');
          if (isMounted.current) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    checkSession();

    // Cleanup function
    return () => {
      console.log("Cleaning up auth state");
      isMounted.current = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Session refresh method exposed to components
  const refreshSessionAndUpdateState = async () => {
    try {
      // Prevent refreshing too frequently 
      const now = Date.now();
      if (now - lastRefreshAttempt.current < MAX_REFRESH_FREQUENCY) {
        console.log("Throttling refresh attempts, too many attempts in a short period");
        return null;
      }
      
      lastRefreshAttempt.current = now;
      
      console.log("Refreshing session and updating state");
      setIsLoading(true);
      const userWithConfig = await refreshSession();
      
      if (isMounted.current) {
        if (userWithConfig) {
          console.log("Setting refreshed user data:", userWithConfig);
          setUser(userWithConfig);
        } else {
          console.log("No user returned after refresh, setting user to null");
          setUser(null);
        }
        setIsLoading(false);
      }
      
      return userWithConfig;
    } catch (error) {
      console.error("Error in refreshSessionAndUpdateState:", error);
      if (isMounted.current) {
        setUser(null);
        setIsLoading(false);
      }
      return null;
    }
  };

  return { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading, 
    refreshSession: refreshSessionAndUpdateState 
  };
};
