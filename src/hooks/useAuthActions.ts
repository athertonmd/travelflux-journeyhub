
import { User } from '@/types/auth.types';
import { useLogIn } from './auth/useLogIn';
import { useSignUp } from './auth/useSignUp';
import { useLogOut } from './auth/useLogOut';
import { useSetupStatus } from './auth/useSetupStatus';

export const useAuthActions = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const loginFn = useLogIn(setIsLoading);
  const signupFn = useSignUp(setIsLoading);
  const logout = useLogOut(setIsLoading);
  const updateSetupStatus = useSetupStatus(setUser);

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
    updateSetupStatus
  };
};
