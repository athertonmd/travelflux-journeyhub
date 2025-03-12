
import { User } from '@/types/auth.types';
import { useLogin } from './auth/useLogin';
import { useSignup } from './auth/useSignup';
import { useLogout } from './auth/useLogout';
import { useSetupStatus } from './auth/useSetupStatus';

export const useAuthActions = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const loginFn = useLogin();
  const signupFn = useSignup();
  const logout = useLogout(setUser);
  const { checkSetupStatus, updateSetupStatus } = useSetupStatus(setUser);

  // Wrapper function for login to manage global loading state
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await loginFn(email, password);
    } finally {
      // We need to set loading to false here to allow retries
      // The auth state listener will set it again if login succeeds
      setIsLoading(false);
    }
  };

  // Wrapper function for signup to manage global loading state
  const signup = async (name: string, email: string, password: string, agencyName?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await signupFn(name, email, password, agencyName);
    } finally {
      // We need to set loading to false here to allow retries
      // The auth state listener will set it again if signup succeeds
      setIsLoading(false);
    }
  };

  return {
    login,
    signup,
    logout,
    checkSetupStatus,
    updateSetupStatus
  };
};
