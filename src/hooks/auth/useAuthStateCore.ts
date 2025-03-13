
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';
import { fetchUserConfig } from './useUserConfig';
import { useSessionManager } from './useSessionManager';
import { toast } from '@/hooks/use-toast';

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
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  // Set a hard timeout for the initial auth load
  useEffect(() => {
    if (isLoading) {
      authTimeout.current = setTimeout(() => {
        console.log("Hard timeout for auth loading reached, forcing state to not loading");
        if (isMounted.current && isLoading) {
          setIsLoading(false);
        }
      }, 10000); // 10 second hard timeout
    }
    
    return () => {
      if (authTimeout.current) {
        clearTimeout(authTimeout.current);
      }
    };
  }, [isLoading]);

  // Function to handle connection issues
  const handleConnectionIssue = async () => {
    if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts.current++;
      console.log(`Attempting reconnection (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`);
      
      // Clear session and try again
      try {
        await supabase.auth.signOut({ scope: 'local' });
        console.log("Session cleared, attempting to reconnect");
        
        // Wait a moment before checking session again
        setTimeout(async () => {
          try {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
              console.log("Reconnection successful, handling auth state");
              // We need to define handleAuthChange before using it here
              if (typeof handleAuthChange === 'function') {
                await handleAuthChange('RECONNECTED', data.session);
              }
            } else {
              console.log("No session after reconnection attempt");
              if (isMounted.current) {
                setIsLoading(false);
              }
            }
          } catch (error) {
            console.error("Error during reconnection attempt:", error);
            if (isMounted.current) {
              setIsLoading(false);
            }
          }
        }, 1000);
      } catch (error) {
        console.error("Error clearing session during reconnection:", error);
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    } else {
      console.log("Max reconnection attempts reached, giving up");
      if (isMounted.current) {
        setIsLoading(false);
        toast({
          title: "Connection issues detected",
          description: "Please try logging in again or check your internet connection",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    console.log("useAuthState: Initializing auth state");
    isMounted.current = true;
    setIsLoading(true);
    authStateChangeHandled.current = false;
    reconnectAttempts.current = 0;

    // Function to handle auth state changes - Define this function within the useEffect scope
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

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    // Check current session immediately
    const checkSession = async () => {
      try {
        if (!authStateChangeHandled.current) {
          console.log("Checking initial session as no auth state change detected yet");
          const { data, error } = await supabase.auth.getSession();
          initialSessionChecked.current = true;
          
          if (error) {
            console.error("Error getting initial session:", error);
            handleConnectionIssue();
            return;
          }
          
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
        handleConnectionIssue();
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
