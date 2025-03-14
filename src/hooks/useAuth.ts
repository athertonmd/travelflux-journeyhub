
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { useLogIn } from '@/hooks/auth/useLogIn';
import { useLogOut } from '@/hooks/auth/useLogOut';
import { useSetupStatus } from '@/hooks/auth/useSetupStatus';
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // Get auth state management
  const { 
    user, 
    isLoading: stateLoading, 
    authError,
    refreshSession 
  } = useAuthState();
  
  // Get auth operations
  const signUp = useSignUp();
  const logInFn = useLogIn();
  const logOut = useLogOut();
  const updateSetupStatus = useSetupStatus();
  
  // Combined loading state
  const isLoading = stateLoading || isAuthLoading;
  
  // Wrapped login to handle loading state
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
  
  return {
    user,
    isLoading,
    authError,
    signUp,
    logIn,
    logOut,
    updateSetupStatus,
    refreshSession
  };
};
