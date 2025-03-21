
import { useState, useEffect, useCallback } from 'react';
import { supabase, clearAuthData, isTokenExpired } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, AuthContextType } from '@/types/auth.types';
import { useUpdateUserState } from '@/hooks/auth/useUpdateUserState';
import { useAuthOperations } from '@/hooks/auth/useAuthOperations';
import { useSetupStatusUpdate } from '@/hooks/auth/useSetupStatusUpdate';

export const useAuthProvider = (): AuthContextType => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [checkAttempts, setCheckAttempts] = useState(0);

  // Custom hooks
  const { updateUserState } = useUpdateUserState();
  const { signUp, signIn, signOut } = useAuthOperations(setIsLoading);
  const { updateSetupStatus } = useSetupStatusUpdate(user, setUser, setIsLoading);

  // Initial session check and auth state change listener
  useEffect(() => {
    let isMounted = true;
    
    console.log('Setting up auth listener and checking session');
    
    // First set up the auth change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing user state');
          setUser(null);
          return;
        }
        
        if (session?.user) {
          console.log('Session available, updating user state');
          try {
            const userData = await updateUserState(session.user, setUser);
            if (isMounted) {
              setAuthError(null);
              setSessionChecked(true);
            }
          } catch (error) {
            if (isMounted) {
              console.error('Error updating user state from auth change:', error);
              setAuthError(error instanceof Error ? error.message : 'Error updating user state');
            }
          }
        }
      }
    );
    
    // Then check for existing session with timeout protection
    const checkSession = async () => {
      try {
        if (!isMounted) return;
        
        setIsLoading(true);
        console.log(`Checking for existing session (attempt ${checkAttempts + 1})`);
        
        // Add timeout for getSession call
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session check timed out')), 5000);
        });
        
        const sessionPromise = supabase.auth.getSession();
        
        // Race between actual API call and timeout
        const result = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (!isMounted) return;
        
        const { data, error } = result as any;
        
        if (error) {
          console.error('Session check error:', error.message);
          setAuthError(error.message);
          
          // If we had a timeout or network error, retry up to 2 times
          if (checkAttempts < 2 && (error.message.includes('timeout') || error.message.includes('network'))) {
            setCheckAttempts(prev => prev + 1);
            setIsLoading(false);
            return;
          }
          
          setIsLoading(false);
          setSessionChecked(true);
          return;
        }
        
        if (data.session?.user) {
          console.log('Existing session found, updating user state');
          try {
            await updateUserState(data.session.user, setUser);
          } catch (error) {
            console.error('Error updating user state from session check:', error);
          }
        } else {
          console.log('No existing session found');
        }
        
        setSessionChecked(true);
        setIsLoading(false);
      } catch (error: any) {
        if (!isMounted) return;
        
        console.error('Error checking session:', error);
        setAuthError(error.message);
        setIsLoading(false);
        setSessionChecked(true);
      }
    };
    
    checkSession();
    
    // Set up session expiry check interval
    const checkSessionExpiry = setInterval(async () => {
      if (!isMounted || !user) return;
      
      try {
        const expired = await isTokenExpired();
        if (expired) {
          console.log('Auth token has expired, refreshing session');
          refreshSession();
        }
      } catch (error) {
        console.error('Error checking token expiry:', error);
      }
    }, 60000); // Check every minute
    
    // Cleanup
    return () => {
      isMounted = false;
      console.log('Cleaning up auth listener');
      authListener.subscription.unsubscribe();
      clearInterval(checkSessionExpiry);
    };
  }, [updateUserState, checkAttempts]);
  
  // Refresh session functionality
  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      console.log('Attempting to refresh session');
      setIsLoading(true);
      setAuthError(null);
      
      // First check if we're already signed out
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.log('No active session to refresh');
        setIsLoading(false);
        return null;
      }
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error.message);
        setAuthError(error.message);
        
        // If token is invalid or expired, clear auth data
        if (error.message.includes('token') || error.message.includes('expired')) {
          console.log('Invalid token, clearing auth data');
          clearAuthData();
        }
        
        setIsLoading(false);
        return null;
      }
      
      if (data.session?.user) {
        console.log('Session refreshed successfully');
        const userData = await updateUserState(data.session.user, setUser);
        setIsLoading(false);
        return userData;
      }
      
      console.log('No session available after refresh');
      setIsLoading(false);
      return null;
    } catch (error: any) {
      console.error('Error refreshing session:', error);
      setAuthError(error.message);
      setIsLoading(false);
      return null;
    }
  }, [updateUserState]);
  
  // Alias logIn and logOut for backward compatibility
  const logIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    console.log('Login wrapper called');
    setIsLoading(true);
    try {
      const result = await signIn(email, password);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [signIn]);
  
  const logOut = useCallback(async (): Promise<void> => {
    console.log('Logout wrapper called');
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [signOut]);

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
