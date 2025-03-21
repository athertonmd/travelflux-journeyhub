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
  const [hasError, setHasError] = useState(false);
  
  // Clear auth data when component mounts to ensure a clean state
  useEffect(() => {
    console.log('Login form mounted, ensuring clean auth state');
    clearAuthData();
    
    // Reset error state
    setHasError(false);
    
    // Set a timeout to show error state if login takes too long
    const errorTimeout = setTimeout(() => {
      if (isSubmitting) {
        setHasError(true);
        setIsSubmitting(false);
        toast({
          title: 'Login taking too long',
          description: 'Please try again or use the reset session button',
          variant: 'destructive'
        });
      }
    }, 10000);
    
    return () => {
      clearTimeout(errorTimeout);
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
      setHasError(false);
      
      // Do a final auth data clear right before login to ensure clean state
      clearAuthData();
      
      // Perform the login operation with a short delay to ensure auth state is reset
      const success = await logIn(email, password);
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
        setHasError(true);
        return false;
      }
    } catch (error: any) {
      console.error('Login error in handleSubmit:', error.message);
      setIsSubmitting(false);
      setHasError(true);
      
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
      hasError={hasError}
    />
  );
};

export default LoginFormHandler;
