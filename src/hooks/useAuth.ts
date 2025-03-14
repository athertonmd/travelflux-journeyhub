
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { useLogIn } from '@/hooks/auth/useLogIn';
import { useLogOut } from '@/hooks/auth/useLogOut';
import { useSetupStatus } from '@/hooks/auth/useSetupStatus';
import { useState } from 'react';

export const useAuth = () => {
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // Get auth state management
  const { 
    user, 
    isLoading: stateLoading, 
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
  const logIn = async (email: string, password: string) => {
    try {
      setIsAuthLoading(true);
      const result = await logInFn(email, password);
      setIsAuthLoading(false);
      return result;
    } catch (error) {
      setIsAuthLoading(false);
      return false;
    }
  };
  
  return {
    user,
    isLoading,
    signUp,
    logIn,
    logOut,
    updateSetupStatus,
    refreshSession
  };
};
