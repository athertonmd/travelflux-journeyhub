
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionManager } from './useSessionManager';

export const useLoginPage = () => {
  const { user, isLoading: authLoading, logIn, refreshSession } = useAuth();
  const { resetSessionState, checkCurrentSession } = useSessionManager();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [loginAttemptFailed, setLoginAttemptFailed] = useState(false);
  const [authStuck, setAuthStuck] = useState(false);
  const [refreshingSession, setRefreshingSession] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);
  
  // Check for existing session immediately
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { session, error } = await checkCurrentSession();
        if (error) {
          console.log("Error checking initial session:", error.message);
        }
      } catch (error) {
        console.error("Exception checking initial session:", error);
      }
    };
    
    checkExistingSession();
  }, [checkCurrentSession]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log("User is authenticated, redirecting to dashboard");
      setRedirecting(true);
      setIsSubmitting(false); // Reset loading state when user data is available
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Reset submission state when auth loading completes
  useEffect(() => {
    if (!authLoading && isSubmitting) {
      // If auth is no longer loading but we don't have a user and we're not redirecting,
      // then the login likely failed
      if (!user && !redirecting) {
        console.log("Auth loading completed but no user and not redirecting, resetting submission state");
        setIsSubmitting(false);
      }
    }
  }, [authLoading, user, isSubmitting, redirecting]);

  // Handle auth stuck situation
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    // Only start the timer if we're in a loading state and not already stuck
    if ((authLoading || isSubmitting) && !authStuck && !refreshingSession) {
      console.log("Starting auth stuck detection timer");
      timer = setTimeout(() => {
        if ((authLoading || isSubmitting) && !user && !refreshingSession) {
          console.log("Authentication appears to be stuck");
          setAuthStuck(true);
          toast({
            title: "Authentication taking too long",
            description: "Having trouble connecting to the authentication service. You can try refreshing your session.",
            variant: "default",
          });
        }
      }, 5000); // 5 seconds
    } else if (!authLoading && !isSubmitting) {
      // If we're not loading anymore, make sure we're not in "stuck" state
      if (authStuck) {
        console.log("Resetting auth stuck state as loading has completed");
        setAuthStuck(false);
      }
    }
    
    return () => {
      if (timer) {
        console.log("Clearing auth stuck detection timer");
        clearTimeout(timer);
      }
    };
  }, [authLoading, isSubmitting, user, refreshingSession, authStuck, toast]);

  // Function to handle session refresh
  const handleRefreshSession = useCallback(async (): Promise<boolean> => {
    try {
      console.log("Attempting to refresh session");
      setRefreshingSession(true);
      setConnectionRetries(prev => prev + 1);
      
      // First try to reset session state to clear any stale data
      if (connectionRetries > 0) {
        await resetSessionState();
      }
      
      // Then attempt to refresh the session
      const refreshedUser = await refreshSession();
      
      if (refreshedUser) {
        console.log("Session refresh successful, user retrieved");
        toast({
          title: "Connection restored",
          description: "Your session has been refreshed successfully.",
          variant: "default",
        });
        setAuthStuck(false);
        return true;
      } else {
        console.log("Session refresh completed but no user retrieved");
        toast({
          title: "Connection attempt failed",
          description: "Could not establish connection. Please try again or reload the page.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error during session refresh:", error);
      toast({
        title: "Session refresh failed",
        description: "Could not refresh your session. Please try reloading the page.",
        variant: "destructive",
      });
      return false;
    } finally {
      setRefreshingSession(false);
      // Only reset auth stuck if we've successfully refreshed or if this was the first retry
      if (connectionRetries <= 1) {
        setAuthStuck(false);
      }
      setIsSubmitting(false); // Reset submission state after refresh attempt
    }
  }, [refreshSession, resetSessionState, connectionRetries, toast]);

  // Handle form submission
  const handleSubmit = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Login form submitted");
      setIsSubmitting(true);
      setLoginAttemptFailed(false);
      
      // Clear any previous stuck state
      if (authStuck) {
        setAuthStuck(false);
      }
      
      const success = await logIn(email, password);
      
      if (success) {
        console.log("Login successful");
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
          variant: "default",
        });
        return true;
      } else {
        console.log("Login returned unsuccessful");
        setLoginAttemptFailed(true);
        setIsSubmitting(false); // Reset loading state on failure
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login threw an exception:", error);
      setLoginAttemptFailed(true);
      setIsSubmitting(false); // Reset loading state on error
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

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
    handleRefreshSession
  };
};
