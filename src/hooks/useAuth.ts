
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { useLogIn } from '@/hooks/auth/useLogIn';
import { useLogOut } from '@/hooks/auth/useLogOut';
import { useSetupStatus } from '@/hooks/auth/useSetupStatus';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';
import { AuthContextType } from '@/types/auth.types';

export const useAuth = (): AuthContextType => {
  // Initialize all state first
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
  const signUp = useCallback(async (email: string, password: string, name: string, agencyName: string) => {
    try {
      setIsAuthLoading(true);
      const result = await signUpFn(email, password, name, agencyName);
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
      setIsAuthLoading(false);
    } catch (error: any) {
      console.error('Logout error in useAuth:', error.message);
      toast({
        title: "Logout failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
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
  
  // Always define the effect - this should be the last hook
  useEffect(() => {
    let isMounted = true;
    console.log('Running useAuth effect');
    
    return () => {
      console.log('Cleaning up useAuth effect');
      isMounted = false;
      setIsAuthLoading(false);
    };
  }, []);
  
  // Use useMemo to prevent unnecessary re-renders
  return useMemo(() => ({
    user,
    isLoading,
    authError,
    signUp,
    logIn,
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
