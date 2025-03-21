
import { useState, useEffect, useCallback } from 'react';
import { supabase, clearAuthData } from '@/integrations/supabase/client';
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

  // Custom hooks
  const { updateUserState } = useUpdateUserState();
  const { signUp, signIn, signOut } = useAuthOperations(setIsLoading);
  const { updateSetupStatus } = useSetupStatusUpdate(user, setUser, setIsLoading);

  // Initial session check and auth state change listener
  useEffect(() => {
    console.log('Setting up auth listener and checking session');
    
    // First set up the auth change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing user state');
          setUser(null);
          return;
        }
        
        if (session?.user) {
          console.log('Session available, updating user state');
          await updateUserState(session.user, setUser);
        }
      }
    );
    
    // Then check for existing session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        console.log('Checking for existing session');
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error.message);
          setAuthError(error.message);
          setIsLoading(false);
          return;
        }
        
        if (data.session?.user) {
          console.log('Existing session found, updating user state');
          await updateUserState(data.session.user, setUser);
        } else {
          console.log('No existing session found');
        }
        
        setSessionChecked(true);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error checking session:', error);
        setAuthError(error.message);
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Cleanup
    return () => {
      console.log('Cleaning up auth listener');
      authListener.subscription.unsubscribe();
    };
  }, [updateUserState]);
  
  // Refresh session functionality
  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      console.log('Attempting to refresh session');
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error.message);
        setAuthError(error.message);
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
