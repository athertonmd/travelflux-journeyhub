
import { useEffect, useRef, useCallback } from 'react';
import { clearAuthData } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';
import { useSessionCheck } from './useSessionCheck';
import { useAuthStateChange } from './useAuthStateChange';
import { useTokenChecker } from './useTokenChecker';

type AuthListenerProps = {
  isMounted: React.MutableRefObject<boolean>;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setAuthError: (error: string | null) => void;
  setSessionChecked: (checked: boolean) => void;
  updateUserState: (supabaseUser: any) => Promise<User | null>;
  checkSessionExpiry: () => Promise<boolean>;
  refreshSession: () => Promise<User | null>;
};

export const useAuthStateListener = ({
  isMounted,
  setUser,
  setIsLoading,
  setAuthError,
  setSessionChecked,
  updateUserState,
  checkSessionExpiry,
  refreshSession
}: AuthListenerProps) => {
  const tokenCheckIntervalRef = useRef<number | null>(null);
  const initialCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const authStateChangeCount = useRef<number>(0);
  
  // Initialize our custom hooks
  const { checkSession } = useSessionCheck();
  const { setupAuthChangeListener } = useAuthStateChange();
  const { setupTokenChecker } = useTokenChecker();
  
  const setupAuthListener = useCallback(() => {
    console.log('Setting up auth state listener');
    
    // Check initial session
    checkSession({
      isMounted,
      setUser,
      setIsLoading,
      setAuthError,
      setSessionChecked,
      updateUserState,
      initialCheckTimeoutRef
    });
    
    // Set up auth state change listener
    const authListener = setupAuthChangeListener({
      isMounted,
      setUser,
      setIsLoading,
      setSessionChecked,
      updateUserState,
      authStateChangeCount
    });
    
    // Set up token checker
    tokenCheckIntervalRef.current = setupTokenChecker({
      isMounted,
      checkSessionExpiry,
      refreshSession,
      setIsLoading,
      setUser
    });
    
    // Reset the state change counter every minute
    const resetCounter = setInterval(() => {
      authStateChangeCount.current = 0;
    }, 60000);
    
    return {
      authListener,
      resetCounter
    };
  }, [
    isMounted, 
    setUser, 
    setIsLoading, 
    setAuthError, 
    setSessionChecked, 
    updateUserState, 
    checkSessionExpiry, 
    refreshSession
  ]);

  // Cleanup function
  const cleanupAuthListener = useCallback((listenerData: any) => {
    console.log('Cleaning up auth state listener');
    
    if (listenerData?.authListener) {
      listenerData.authListener.subscription.unsubscribe();
    }
    
    if (listenerData?.resetCounter) {
      clearInterval(listenerData.resetCounter);
    }
    
    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
      tokenCheckIntervalRef.current = null;
    }
    
    if (initialCheckTimeoutRef.current) {
      clearTimeout(initialCheckTimeoutRef.current);
      initialCheckTimeoutRef.current = null;
    }
  }, []);

  return {
    setupAuthListener,
    cleanupAuthListener
  };
};
