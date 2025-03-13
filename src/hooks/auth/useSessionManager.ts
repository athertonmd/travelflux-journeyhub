
import { useSessionCheck } from './useSessionCheck';
import { useSessionRefresh } from './useSessionRefresh';
import { useSessionReset } from './useSessionReset';

/**
 * Composed hook that provides all session management utilities
 */
export const useSessionManager = () => {
  const { checkCurrentSession } = useSessionCheck();
  const { refreshSession } = useSessionRefresh();
  const { resetSessionState } = useSessionReset();

  return {
    refreshSession,
    checkCurrentSession,
    resetSessionState
  };
};
