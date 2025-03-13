
import { useAuth } from '@/contexts/AuthContext';
import { useLoginForm } from './useLoginForm';
import { useSessionRefreshUI } from './useSessionRefreshUI';
import { useAuthStatus } from './useAuthStatus';
import { useInitialSession } from './useInitialSession';
import { useSessionReset } from './useSessionReset';
import { useEffect } from 'react';

export const useLoginPage = () => {
  const { user, isLoading: authLoading, refreshSession } = useAuth();
  
  const {
    isSubmitting,
    loginAttemptFailed,
    handleSubmit,
    setIsSubmitting
  } = useLoginForm();
  
  const {
    refreshingSession,
    connectionRetries,
    handleRefreshSession,
    setRefreshingSession
  } = useSessionRefreshUI();
  
  const { resetSessionState } = useSessionReset();
  
  const {
    authStuck,
    redirecting,
    setAuthStuck,
    setRedirecting
  } = useAuthStatus(authLoading, isSubmitting, user, refreshingSession);
  
  // Initialize session and handle redirects
  useInitialSession(user, setRedirecting, setIsSubmitting);
  
  // Reset session state if there was a previous stuck state
  useEffect(() => {
    if (localStorage.getItem('auth_previously_stuck') === 'true') {
      console.log("Detected previous stuck state, resetting session");
      resetSessionState().then(() => {
        localStorage.removeItem('auth_previously_stuck');
        setRefreshingSession(false);
      });
    }
  }, [resetSessionState, setRefreshingSession]);

  return {
    user,
    authLoading,
    isSubmitting,
    redirecting,
    loginAttemptFailed,
    authStuck,
    refreshingSession,
    connectionRetries,
    handleSubmit,
    handleRefreshSession,
    setAuthStuck,
    refreshSession
  };
};
