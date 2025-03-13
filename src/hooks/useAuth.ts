
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { useLogIn } from '@/hooks/auth/useLogIn';
import { useLogOut } from '@/hooks/auth/useLogOut';
import { useSetupStatus } from '@/hooks/auth/useSetupStatus';

export const useAuth = () => {
  // Get auth state management
  const { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading, 
    refreshSession 
  } = useAuthState();
  
  // Get auth operations
  const signUp = useSignUp(setIsLoading);
  const logIn = useLogIn(setIsLoading);
  const logOut = useLogOut(setIsLoading);
  const updateSetupStatus = useSetupStatus(setUser);
  
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
