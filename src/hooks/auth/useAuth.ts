
import { useSignUpAuth } from './useSignUpAuth';
import { useLoginAuth } from './useLoginAuth';
import { useLogoutAuth } from './useLogoutAuth';
import { useSessionAuth } from './useSessionAuth';
import { useSetupStatusAuth } from './useSetupStatusAuth';

export const useAuth = () => {
  const { user, isLoading, setUser, setIsLoading, refreshSession } = useSessionAuth();
  const { signUp } = useSignUpAuth();
  const { logIn } = useLoginAuth();
  const { logOut } = useLogoutAuth();
  const { updateSetupStatus } = useSetupStatusAuth(user, setUser);

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
