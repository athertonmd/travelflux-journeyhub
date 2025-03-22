
import { useAuthProviderCore } from '@/hooks/auth/useAuthProviderCore';
import { AuthContextType } from '@/types/auth.types';

/**
 * Main hook that provides the authentication context
 * This is a thin wrapper around useAuthProviderCore to maintain the same API
 */
export const useAuthProvider = (): AuthContextType => {
  // Use the core hook that contains all the auth logic
  return useAuthProviderCore();
};
