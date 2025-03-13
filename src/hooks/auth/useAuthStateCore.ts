
import { useState, useEffect, useRef, useCallback } from 'react';
import { User } from '@/types/auth.types';
import { useSessionManager } from './useSessionManager';
import { useAuthConnectionManager } from './useAuthConnectionManager';
import { useAuthTimeoutManager } from './useAuthTimeoutManager';
import { useAuthEventHandler } from './useAuthEventHandler';

export const useAuthStateCore = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const initialSessionChecked = useRef(false);
  
  // Import specialized hooks
  const { refreshSession, checkCurrentSession } = useSessionManager();
  const { handleConnectionIssue, resetConnectionAttempts } = useAuthConnectionManager();
  const { setupAuthTimeout, clearAuthTimeout, canRefresh, setRefreshInProgress } = useAuthTimeoutManager();
  const { setupAuthListener, checkInitialSession } = useAuthEventHandler(setUser, setIsLoading);

  // Set a hard timeout for the initial auth load
  useEffect(() => {
    if (isLoading) {
      return setupAuthTimeout(() => {
        console.log("Hard timeout for auth loading reached, forcing state to not loading");
        if (isMounted.current && isLoading) {
          setIsLoading(false);
        }
      });
    }
  }, [isLoading, setupAuthTimeout]);

  useEffect(() => {
    console.log("useAuthState: Initializing auth state");
    isMounted.current = true;
    setIsLoading(true);
    resetConnectionAttempts();
    initialSessionChecked.current = false;

    // Set up auth state listener
    const { data: authListener } = setupAuthListener();
    
    // Check current session immediately with a short delay
    // to allow potential auth state change to happen first
    setTimeout(() => {
      checkInitialSession().then(result => {
        if (!result.success) {
          // Handle connection issues
          handleConnectionIssue(async (session) => {
            const { handleAuthChange } = useAuthEventHandler(setUser, setIsLoading);
            await handleAuthChange('RECONNECTED', session);
          });
        }
      });
    }, 100);

    // Cleanup function
    return () => {
      console.log("Cleaning up auth state");
      isMounted.current = false;
      clearAuthTimeout();
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [setupAuthListener, checkInitialSession, handleConnectionIssue, resetConnectionAttempts, clearAuthTimeout]);

  // Session refresh method exposed to components
  const refreshSessionAndUpdateState = useCallback(async () => {
    try {
      // Check if refresh is allowed
      if (!canRefresh()) {
        return null;
      }
      
      // Set flags to prevent duplicate refreshes
      setRefreshInProgress(true);
      
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
      setRefreshInProgress(false);
    }
  }, [refreshSession, canRefresh, setRefreshInProgress]);

  return { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading, 
    refreshSession: refreshSessionAndUpdateState 
  };
};
