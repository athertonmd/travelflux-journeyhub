
import { useAuthChangeListener } from './utils/useAuthChangeListener';

type AuthStateChangeProps = {
  isMounted: React.MutableRefObject<boolean>;
  setUser: (user: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSessionChecked: (checked: boolean) => void;
  updateUserState: (supabaseUser: any) => Promise<any>;
  authStateChangeCount: React.MutableRefObject<number>;
};

export const useAuthStateChange = () => {
  const { setupAuthChangeListener } = useAuthChangeListener();

  return { setupAuthChangeListener };
};
