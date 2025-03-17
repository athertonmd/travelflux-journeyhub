
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { clearAuthData } from '@/integrations/supabase/client';
import LoginPageContent from '@/components/auth/LoginPageContent';

interface LoginFormHandlerProps {
  onLoginSuccess: () => void;
}

const LoginFormHandler: React.FC<LoginFormHandlerProps> = ({ onLoginSuccess }) => {
  const { logIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (email: string, password: string, remember: boolean) => {
    try {
      console.log('Login form submitted - ensuring clean auth state');
      setIsSubmitting(true);
      
      // Clear auth data before login attempt
      clearAuthData();
      
      const success = await logIn(email, password);
      console.log('Login result:', success ? 'success' : 'failed');
      
      if (success) {
        onLoginSuccess();
      } else {
        setIsSubmitting(false);
      }
      return success;
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
