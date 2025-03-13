
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const refreshInProgress = useRef<boolean>(false);
  const MAX_REFRESH_FREQUENCY = 5000; // 5 seconds between refresh attempts
  const authTimeout = useRef<NodeJS.Timeout | null>(null);
  const authStateChangeHandled = useRef(false);

  // Set a hard timeout for the initial auth load
  useEffect(() => {
    if (isLoading) {
      authTimeout.current = setTimeout(() => {
        console.log("Hard timeout for auth loading reached, forcing state to not loading");
        if (isMounted.current && isLoading) {
          setIsLoading(false);
        }
      }, 10000); // 10 second hard timeout - increased from 5s for network issues
    }
    
    return () => {
      if (authTimeout.current) {
        clearTimeout(authTimeout.current);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    console.log("useAuthState: Initializing auth state");
    isMounted.current = true;
    setIsLoading(true);
    authStateChangeHandled.current = false;

    // Function to handle auth state changes
    const handleAuthChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event, session ? 'with session' : 'no session');
      authStateChangeHandled.current = true;

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

    // Set up auth state listener - directly using the code you provided
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    // Check current session immediately
    const checkSession = async () => {
      try {
        // Only check the session if no auth state change has been handled yet
        if (!authStateChangeHandled.current) {
          console.log("Checking initial session as no auth state change detected yet");
          const { data } = await supabase.auth.getSession();
          initialSessionChecked.current = true;
          
          if (data.session) {
            console.log("Found existing session, handling auth state");
            await handleAuthChange('INITIAL', data.session);
          } else {
            console.log('No active session found');
            if (isMounted.current) {
              setIsLoading(false);
            }
          }
        } else {
          console.log("Skipping initial session check as auth state change was already handled");
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    // Set short timeout to allow potential auth state change to happen first
    setTimeout(checkSession, 100);

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
  const refreshSessionAndUpdateState = useCallback(async () => {
    try {
      // Check if refresh is already in progress
      if (refreshInProgress.current) {
        console.log("Refresh already in progress, skipping");
        return null;
      }
      
      // Prevent refreshing too frequently 
      const now = Date.now();
      if (now - lastRefreshAttempt.current < MAX_REFRESH_FREQUENCY) {
        console.log("Throttling refresh attempts, too many attempts in a short period");
        return null;
      }
      
      // Set flags to prevent duplicate refreshes
      lastRefreshAttempt.current = now;
      refreshInProgress.current = true;
      
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
    } finally {
      // Ensure flag is reset even if there's an error
      refreshInProgress.current = false;
    }
  }, [refreshSession]);

  return { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading, 
    refreshSession: refreshSessionAndUpdateState 
  };
};
