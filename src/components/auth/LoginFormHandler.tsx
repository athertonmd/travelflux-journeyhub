import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { clearAuthData } from '@/integrations/supabase/client';
import LoginPageContent from '@/components/auth/LoginPageContent';
import { toast } from '@/hooks/use-toast';

interface LoginFormHandlerProps {
  onLoginSuccess: () => void;
}

const LoginFormHandler: React.FC<LoginFormHandlerProps> = ({ onLoginSuccess }) => {
  const { logIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginTimeout, setLoginTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Clear auth data when component mounts to ensure a clean state
  useEffect(() => {
    console.log('Login form mounted, ensuring clean auth state');
    clearAuthData();
    
    // Reset error state
    setError(null);
    
    return () => {
      // Clear any pending timeouts when component unmounts
      if (loginTimeout) {
        clearTimeout(loginTimeout);
      }
    };
  }, []);

  const handleSubmit = async (email: string, password: string, remember: boolean) => {
    try {
      console.log('Processing login request');
      
      // Don't allow multiple submissions
      if (isSubmitting) {
        return false;
      }
      
      setIsSubmitting(true);
      setError(null);
      
      // Do a final auth data clear right before login to ensure clean state
      clearAuthData();
      
      // Set a timeout to automatically fail the login if it takes too long
      const timeout = setTimeout(() => {
        console.log('Login took too long, aborting');
        setIsSubmitting(false);
        setError('Login timed out. Please try again.');
        toast({
          title: 'Login timeout',
          description: 'The login process took too long. Please try again.',
          variant: 'destructive'
        });
      }, 8000); // 8 seconds timeout
      
      setLoginTimeout(timeout);
      
      // Perform the login operation
      const success = await logIn(email, password);
      
      // Clear the timeout since we got a response
      clearTimeout(timeout);
      setLoginTimeout(null);
      
      console.log('Login result:', success ? 'success' : 'failed');
      
      if (success) {
        // Keep a short delay to ensure auth state is properly updated before redirect
        setTimeout(() => {
          onLoginSuccess();
          setIsSubmitting(false);
        }, 500);
        return true;
      } else {
        setIsSubmitting(false);
        setError('Login failed. Please check your credentials and try again.');
        return false;
      }
    } catch (error: any) {
      console.error('Login error in handleSubmit:', error.message);
      
      // Clear any pending timeout
      if (loginTimeout) {
        clearTimeout(loginTimeout);
        setLoginTimeout(null);
      }
      
      setIsSubmitting(false);
      setError(error.message || 'An unexpected error occurred');
      
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  return (
    <LoginPageContent 
      isLoading={isSubmitting}
      onLogin={handleSubmit}
      errorMessage={error}
    />
  );
};

export default LoginFormHandler;
