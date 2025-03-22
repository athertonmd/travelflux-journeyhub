
import { useState, useRef } from 'react';
import { User, AuthContextType } from '@/types/auth.types';
import { useUpdateUserState } from '@/hooks/auth/useUpdateUserState';
import { useAuthOperations } from '@/hooks/auth/useAuthOperations';
import { useSetupStatusUpdate } from '@/hooks/auth/useSetupStatusUpdate';
import { useInitialSession } from '@/hooks/auth/useInitialSession';
import { useSessionRefreshLogic } from '@/hooks/auth/useSessionRefreshLogic';
import { useSessionExpiryChecker } from '@/hooks/auth/useSessionExpiryChecker';

/**
 * Core hook that provides the authentication context
 * This is the main hook that manages the auth state and provides auth operations
 */
export const useAuthProviderCore = (): AuthContextType => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [checkAttempts, setCheckAttempts] = useState(0);
  
  // Add reference to track if component is still mounted
  const isMounted = useRef(true);
  
  // Add reference to track active timeouts
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Custom hooks
  const { updateUserState } = useUpdateUserState();
  const { signUp, signIn, signOut } = useAuthOperations(setIsLoading);
  const { updateSetupStatus } = useSetupStatusUpdate(user, setUser, setIsLoading);
  
  // Hook for refreshing the session
  const { refreshSession } = useSessionRefreshLogic({
    updateUserState,
    setUser,
    setIsLoading,
    setAuthError,
    timeoutRef,
    isMounted
  });
  
  // Backward compatibility aliases for logIn/logOut
  const logIn = async (email: string, password: string): Promise<boolean> => {
    console.log('Login wrapper called');
    setIsLoading(true);
    try {
      const result = await signIn(email, password);
      return result;
    } finally {
      // Ensure loading state is always reset
      setTimeout(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }, 500);
    }
  };
  
  const logOut = async (): Promise<void> => {
    console.log('Logout wrapper called');
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize session checking and auth state change listener
  useInitialSession({
    isMounted,
    updateUserState,
    setUser,
    setIsLoading,
    setAuthError,
    setSessionChecked,
    timeoutRef,
    checkAttempts,
    setCheckAttempts
  });
  
  // Setup session expiry checker
  useSessionExpiryChecker({
    user,
    isMounted,
    refreshSession
  });

  return {
    user,
    isLoading,
    authError,
    signUp,
    signIn,
    signOut,
    logIn,
    logOut,
    updateSetupStatus,
    refreshSession,
    sessionChecked
  };
};
