
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useLoginPage = () => {
  const { user, isLoading: authLoading, logIn } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttemptFailed, setLoginAttemptFailed] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  // Handle redirect if user is already logged in
  useEffect(() => {
    if (user && !redirecting) {
      setRedirecting(true);
      const destination = user.setupCompleted ? '/dashboard' : '/welcome';
      navigate(destination);
    }
  }, [user, navigate, redirecting]);

  // Handle login form submission
  const handleSubmit = async (email: string, password: string): Promise<boolean> => {
    if (isSubmitting) return false;
    
    try {
      setIsSubmitting(true);
      setLoginAttemptFailed(false);
      
      const success = await logIn(email, password);
      
      if (!success) {
        setLoginAttemptFailed(true);
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error: any) {
      setLoginAttemptFailed(true);
      toast({
        title: "Login error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
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
    handleSubmit
  };
};
