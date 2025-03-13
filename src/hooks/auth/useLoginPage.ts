
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useLoginPage = () => {
  const { user, isLoading: authLoading, logIn, refreshSession } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [loginAttemptFailed, setLoginAttemptFailed] = useState(false);
  const [authStuck, setAuthStuck] = useState(false);
  const [refreshingSession, setRefreshingSession] = useState(false);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
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
        setIsSubmitting(false);
      }
    }
  }, [authLoading, user, isSubmitting, redirecting]);

  // Handle auth stuck situation
  useEffect(() => {
    if (authLoading) {
      const timer = setTimeout(() => {
        if (authLoading && !user) {
          setAuthStuck(true);
          toast({
            title: "Authentication taking too long",
            description: "Having trouble authenticating? Try refreshing your session.",
            variant: "default",
          });
        }
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    } else {
      setAuthStuck(false);
    }
  }, [authLoading, user, toast]);

  // Function to handle session refresh
  const handleRefreshSession = async () => {
    setRefreshingSession(true);
    try {
      await refreshSession();
    } catch (error) {
      console.error("Session refresh failed", error);
      toast({
        title: "Session refresh failed",
        description: "Could not refresh your session. Please try logging in again.",
        variant: "destructive",
      });
    } finally {
      setRefreshingSession(false);
      setAuthStuck(false);
      setIsSubmitting(false); // Reset submission state after refresh attempt
    }
  };

  // Handle form submission
  const handleSubmit = async (email: string, password: string): Promise<boolean> => {
    setIsSubmitting(true);
    setLoginAttemptFailed(false);
    
    try {
      const success = await logIn(email, password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        });
        return true;
      } else {
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
      console.error("Login failed", error);
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
    handleSubmit,
    handleRefreshSession
  };
};
