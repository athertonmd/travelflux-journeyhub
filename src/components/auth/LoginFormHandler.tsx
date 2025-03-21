
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
  
  // Clear auth data when component mounts to ensure a clean state
  useEffect(() => {
    console.log('Login form mounted, ensuring clean auth state');
    clearAuthData();
  }, []);

  const handleSubmit = async (email: string, password: string, remember: boolean) => {
    try {
      console.log('Processing login request');
      setIsSubmitting(true);
      
      // Perform the login operation with a short delay to ensure auth state is reset
      setTimeout(async () => {
        try {
          const success = await logIn(email, password);
          console.log('Login result:', success ? 'success' : 'failed');
          
          if (success) {
            // Add a short delay to ensure auth state is properly updated before redirect
            setTimeout(() => {
              onLoginSuccess();
              setIsSubmitting(false);
            }, 800);
            return true;
          } else {
            setIsSubmitting(false);
            return false;
          }
        } catch (error: any) {
          console.error('Login error:', error.message);
          setIsSubmitting(false);
          return false;
        }
      }, 100);
      
      return true; // Optimistic return to improve UI response
    } catch (error: any) {
      console.error('Login error in handleSubmit:', error.message);
      setIsSubmitting(false);
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
