import { useAuthState } from '@/hooks/auth/useAuthState';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { useLogIn } from '@/hooks/auth/useLogIn';
import { useLogOut } from '@/hooks/auth/useLogOut';
import { useSetupStatus } from '@/hooks/auth/useSetupStatus';
import { useState, useCallback, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';
import { AuthContextType } from '@/types/auth.types';
import { clearAuthData } from '@/integrations/supabase/client';

export const useAuth = (): AuthContextType => {
  // Initialize loading state
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // Get auth state management
  const { 
    user, 
    isLoading: stateLoading, 
    authError,
    refreshSession,
    sessionChecked 
  } = useAuthState();
  
  // Get auth operations - these hooks must be called unconditionally
  const signUpFn = useSignUp();
  const logInFn = useLogIn();
  const logOutFn = useLogOut();
  const updateSetupStatusFn = useSetupStatus();
  
  // Combined loading state
  const isLoading = stateLoading || isAuthLoading;
  
  // Define all callbacks - ensure these are always defined in the same order
  const signUp = useCallback(async (name: string, email: string, password: string, agencyName?: string) => {
    try {
      // Clear any existing auth data before signup
      clearAuthData();
      
      setIsAuthLoading(true);
      const result = await signUpFn(name, email, password, agencyName);
      setIsAuthLoading(false);
      return result;
    } catch (error: any) {
      console.error('SignUp error in useAuth:', error.message);
      toast({
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      setIsAuthLoading(false);
      return false;
    }
  }, [signUpFn]);
  
  const logIn = useCallback(async (email: string, password: string) => {
    try {
      // Always clear any existing auth state before login to prevent conflicts
      console.log('Clearing auth data before login to ensure clean state');
      clearAuthData();
      
      setIsAuthLoading(true);
      const result = await logInFn(email, password);
      setIsAuthLoading(false);
      return result;
    } catch (error: any) {
      console.error('Login error in useAuth:', error.message);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      setIsAuthLoading(false);
      return false;
    }
  }, [logInFn]);
  
  const logOut = useCallback(async () => {
    try {
      setIsAuthLoading(true);
      await logOutFn();
      
      // Always clear auth data thoroughly on logout to prevent stale tokens
      console.log('Performing complete auth data cleanup on logout');
      clearAuthData();
      
      setIsAuthLoading(false);
    } catch (error: any) {
      console.error('Logout error in useAuth:', error.message);
      toast({
        title: "Logout failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      
      // Even if logout fails, clear local storage
      clearAuthData();
      
      setIsAuthLoading(false);
    }
  }, [logOutFn]);
  
  const updateSetupStatus = useCallback(async (completed: boolean) => {
    try {
      setIsAuthLoading(true);
      const result = await updateSetupStatusFn(completed);
      setIsAuthLoading(false);
      return result;
    } catch (error: any) {
      console.error('Setup status update error in useAuth:', error.message);
      toast({
        title: "Setup status update failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      setIsAuthLoading(false);
      return false;
    }
  }, [updateSetupStatusFn]);
  
  // Use useMemo to prevent unnecessary re-renders, adding signIn and signOut to match AuthContextType
  return useMemo(() => ({
    user,
    isLoading,
    authError,
    signUp,
    signIn: logIn, // Add signIn as alias to logIn
    logIn,
    signOut: logOut, // Add signOut as alias to logOut
    logOut,
    updateSetupStatus,
    refreshSession,
    sessionChecked
  }), [
    user,
    isLoading,
    authError,
    signUp,
    logIn,
    logOut,
    updateSetupStatus,
    refreshSession,
    sessionChecked
  ]);
};
