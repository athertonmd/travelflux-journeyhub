
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionManager } from './useSessionManager';
import { User } from '@/types/auth.types';

export const useInitialSession = (
  user: User | null, 
  setRedirecting: (value: boolean) => void,
  setIsSubmitting: (value: boolean) => void
) => {
  const { checkCurrentSession } = useSessionManager();
  const navigate = useNavigate();

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
  }, [user, navigate, setRedirecting, setIsSubmitting]);
};
