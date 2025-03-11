
import { User } from '@/types/auth.types';
import { useLogin } from './auth/useLogin';
import { useSignup } from './auth/useSignup';
import { useLogout } from './auth/useLogout';
import { useSetupStatus } from './auth/useSetupStatus';

export const useAuthActions = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const login = useLogin(setUser, setIsLoading);
  const signup = useSignup(setUser, setIsLoading);
  const logout = useLogout(setUser);
  const { checkSetupStatus, updateSetupStatus } = useSetupStatus(setUser);

  return {
    login,
    signup,
    logout,
    checkSetupStatus,
    updateSetupStatus
  };
};
