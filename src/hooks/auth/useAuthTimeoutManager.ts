
import { useRef, useCallback } from 'react';

/**
 * Hook to manage timeouts for authentication operations
 */
export const useAuthTimeoutManager = () => {
  const authTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshAttempt = useRef<number>(0);
  const refreshInProgress = useRef<boolean>(false);
  const MAX_REFRESH_FREQUENCY = 5000; // 5 seconds between refresh attempts

  // Clear any existing timeouts
  const clearAuthTimeout = useCallback(() => {
    if (authTimeout.current) {
      clearTimeout(authTimeout.current);
      authTimeout.current = null;
    }
  }, []);

  // Create a new timeout
  const setupAuthTimeout = useCallback((callback: () => void, timeoutMs: number = 10000) => {
    clearAuthTimeout();
    authTimeout.current = setTimeout(callback, timeoutMs);
    
    return () => clearAuthTimeout();
  }, [clearAuthTimeout]);

  // Check if a refresh is allowed based on the throttling rules
  const canRefresh = useCallback((): boolean => {
    if (refreshInProgress.current) {
      console.log("Refresh already in progress, skipping");
      return false;
    }
    
    const now = Date.now();
    if (now - lastRefreshAttempt.current < MAX_REFRESH_FREQUENCY) {
      console.log("Throttling refresh attempts, too many attempts in a short period");
      return false;
    }
    
    return true;
  }, []);

  // Set refresh in progress state
  const setRefreshInProgress = useCallback((inProgress: boolean) => {
    refreshInProgress.current = inProgress;
    if (inProgress) {
      lastRefreshAttempt.current = Date.now();
    }
  }, []);

  return {
    setupAuthTimeout,
    clearAuthTimeout,
    canRefresh,
    setRefreshInProgress,
    refreshInProgress,
    lastRefreshAttempt
  };
};
