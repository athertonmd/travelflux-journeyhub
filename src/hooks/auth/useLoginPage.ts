
import { useAuth } from '@/contexts/AuthContext';
import { useLoginForm } from './useLoginForm';
import { useSessionRefreshUI } from './useSessionRefreshUI';
import { useAuthStatus } from './useAuthStatus';
import { useInitialSession } from './useInitialSession';

export const useLoginPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  
  const {
    isSubmitting,
    loginAttemptFailed,
    handleSubmit,
    setIsSubmitting
  } = useLoginForm();
  
  const {
    refreshingSession,
    connectionRetries,
    handleRefreshSession
  } = useSessionRefreshUI();
  
  const {
    authStuck,
    redirecting,
    setAuthStuck,
    setRedirecting
  } = useAuthStatus(authLoading, isSubmitting, user, refreshingSession);
  
  // Initialize session and handle redirects
  useInitialSession(user, setRedirecting, setIsSubmitting);

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
    setAuthStuck
  };
};
