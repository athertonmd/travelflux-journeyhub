
import { User } from '@/types/auth.types';
import { useLogIn } from './auth/useLogIn';
import { useSignUp } from './auth/useSignUp';
import { useLogOut } from './auth/useLogOut';
import { useSetupStatus } from './auth/useSetupStatus';

export const useAuthActions = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Use the hooks without passing parameters
  const loginFn = useLogIn();
  const signupFn = useSignUp();
  const logout = useLogOut();
  const updateSetupStatus = useSetupStatus();

  // Wrapper function for login to manage global loading state
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Login wrapper called for:', email);
      setIsLoading(true);
      const success = await loginFn(email, password);
      setIsLoading(false);
      return success;
    } catch (error) {
      console.error('Login wrapper error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Wrapper function for signup to manage global loading state
  const signup = async (name: string, email: string, password: string, agencyName?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await signupFn(name, email, password, agencyName);
      setIsLoading(false);
      return success;
    } catch (error) {
      console.error('Signup wrapper error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Wrapper for logout
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setUser(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Logout wrapper error:', error);
      setIsLoading(false);
    }
  };

  // Wrapper for updating setup status
  const handleUpdateSetupStatus = async (completed: boolean): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await updateSetupStatus(completed);
      if (success && setUser) {
        // Update user state with new setup status
        setUser(prev => prev ? { ...prev, setupCompleted: completed } : null);
      }
      setIsLoading(false);
      return success;
    } catch (error) {
      console.error('Update setup status wrapper error:', error);
      setIsLoading(false);
      return false;
    }
  };

  return {
    login,
    signup,
    logout: handleLogout,
    updateSetupStatus: handleUpdateSetupStatus
  };
};
