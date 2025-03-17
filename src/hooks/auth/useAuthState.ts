
import { useState, useEffect, useRef } from 'react';
import { User } from '@/types/auth.types';
import { useSession } from './useSession';
import { useSessionRefresh } from './useSessionRefresh';
import { useAuthStateListener } from './useAuthStateListener';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Add ref to track state between renders and cleanup
  const isMounted = useRef(true);
  
  // Initialize session hooks
  const { 
    sessionChecked, 
    setSessionChecked, 
    updateUserState, 
    checkSessionExpiry, 
    getCurrentSession 
  } = useSession();
  
  // Initialize session refresh hook
  const { 
    refreshSession, 
    resetRefreshState, 
    abortController 
  } = useSessionRefresh(updateUserState, setIsLoading, setAuthError);
  
  // Initialize auth state listener
  const { 
    setupAuthListener, 
    cleanupAuthListener 
  } = useAuthStateListener({
    isMounted,
    setUser,
    setIsLoading,
    setAuthError,
    setSessionChecked,
    updateUserState,
    checkSessionExpiry,
    refreshSession
  });

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    isMounted.current = true;
    resetRefreshState();
    
    // Initial clear state
    setIsLoading(true);
    setAuthError(null);
    setSessionChecked(false);
    
    // Setup auth listener and store reference
    const authListener = setupAuthListener();
    
    // Clean up
    return () => {
      isMounted.current = false;
      cleanupAuthListener(authListener);
      
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [setupAuthListener, cleanupAuthListener, resetRefreshState, abortController]);

  return {
    user,
    isLoading,
    authError,
    sessionChecked,
    setIsLoading,
    setAuthError,
    refreshSession
  };
};
