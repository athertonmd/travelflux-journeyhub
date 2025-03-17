
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
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  // Reset the form if too many attempts
  useEffect(() => {
    if (loginAttempts > 2) {
      const timer = setTimeout(() => {
        setIsSubmitting(false);
        setLoginAttempts(0);
        
        toast({
          title: "Login process reset",
          description: "We've reset the login process due to multiple attempts. Please try again.",
          variant: "default"
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  // Clear auth data when component mounts to avoid stale state
  useEffect(() => {
    console.log('Login form mounted, clearing auth data');
    clearAuthData();
  }, []);

  const handleSubmit = async (email: string, password: string, remember: boolean) => {
    try {
      console.log('Login form submitted - ensuring clean auth state');
      setIsSubmitting(true);
      setLoginAttempts(prev => prev + 1);
      
      // Clear auth data before login attempt
      clearAuthData();
      
      // Add a slight delay to ensure cleanup completes
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const success = await logIn(email, password);
      console.log('Login result:', success ? 'success' : 'failed');
      
      if (success) {
        // Add a short delay before success callback
        // This helps prevent timing issues with auth state updates
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
        return true;
      } else {
        setIsSubmitting(false);
        return false;
      }
    } catch (error: any) {
      console.error('Login error in handleSubmit:', error.message);
      
      // Force cleanup on error
      clearAuthData();
      
      // Reset submission state after a short delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
      
      return false;
    }
  };

  return (
    <LoginPageContent 
      isLoading={isSubmitting}
      onLogin={handleSubmit}
    />
  );
};

export default LoginFormHandler;
