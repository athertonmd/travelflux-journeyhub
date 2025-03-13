
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionManager } from './useSessionManager';
import { User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';

export const useInitialSession = (
  user: User | null, 
  setRedirecting: (value: boolean) => void,
  setIsSubmitting: (value: boolean) => void
) => {
  const { checkCurrentSession } = useSessionManager();
  const navigate = useNavigate();
  const sessionCheckAttempted = useRef(false);
  const redirectInProgress = useRef(false);

  // Check for existing session immediately
  useEffect(() => {
    // Only try to check session once
    if (sessionCheckAttempted.current) return;
    
    const checkExistingSession = async () => {
      try {
        sessionCheckAttempted.current = true;
        console.log("Checking initial session status");
        
        const { session, error } = await checkCurrentSession();
        
        if (error) {
          // Don't show errors to the user for timeout issues,
          // as we'll fall back gracefully
          if (error.message !== 'Timed out but continuing') {
            console.error("Error checking initial session:", error.message);
            toast({
              title: "Session Check Issue",
              description: "There was a problem checking your session. You may need to log in again.",
              variant: "destructive",
            });
          } else {
            console.log("Session check timed out, continuing without session data");
          }
        } else if (session) {
          console.log("Found existing session during initial check");
        } else {
          console.log("No active session found during initial check");
        }
      } catch (error) {
        console.error("Exception checking initial session:", error);
        // Don't block the UI for session check failures
      }
    };
    
    checkExistingSession();
  }, [checkCurrentSession]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !redirectInProgress.current) {
      console.log("User is authenticated, redirecting to dashboard", user);
      redirectInProgress.current = true;
      setRedirecting(true);
      setIsSubmitting(false); // Reset loading state when user data is available
      
      // Small delay to allow state updates before navigation
      const redirectTimer = setTimeout(() => {
        navigate('/dashboard');
      }, 300); // Increased delay for more reliable state updates
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, navigate, setRedirecting, setIsSubmitting]);
};
