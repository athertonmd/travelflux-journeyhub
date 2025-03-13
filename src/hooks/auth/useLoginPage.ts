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
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Handle auth stuck situation
  useEffect(() => {
    if (authLoading) {
      const timer = setTimeout(() => {
        if (authLoading && !user) {
          setAuthStuck(true);
          toast({
            title: "Authentication taking too long",
            description: "Having trouble authenticating? Try refreshing your session.",
            variant: "warning",
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
    }
  };

  // Handle form submission
  const handleSubmit = async (email: string, password: string) => {
    setIsSubmitting(true);
    setLoginAttemptFailed(false);
    
    try {
      const success = await logIn(email, password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        });
        navigate('/dashboard');
      } else {
        setLoginAttemptFailed(true);
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login failed", error);
      setLoginAttemptFailed(true);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
    handleSubmit
  };
};
