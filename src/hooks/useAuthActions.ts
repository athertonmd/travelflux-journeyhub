
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
    try {
      console.log('Login wrapper called for:', email);
      const user = await loginFn(email, password);
      return !!user; // Convert User object to boolean
    } catch (error) {
      console.error('Login wrapper error:', error);
      return false;
    }
  };

  // Wrapper function for signup to manage global loading state
  const signup = async (name: string, email: string, password: string, agencyName?: string): Promise<boolean> => {
    try {
      const user = await signupFn(name, email, password, agencyName);
      return !!user; // Convert User object to boolean
    } catch (error) {
      console.error('Signup wrapper error:', error);
      return false;
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
