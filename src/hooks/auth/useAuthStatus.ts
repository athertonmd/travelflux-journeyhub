
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/auth.types';

export const useAuthStatus = (
  authLoading: boolean, 
  isSubmitting: boolean, 
  user: User | null,
  refreshingSession: boolean
) => {
  const { toast } = useToast();
  const [authStuck, setAuthStuck] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Handle auth stuck situation
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    // Only start the timer if we're in a loading state and not already stuck
    if ((authLoading || isSubmitting) && !authStuck && !refreshingSession) {
      console.log("Starting auth stuck detection timer");
      timer = setTimeout(() => {
        if ((authLoading || isSubmitting) && !user && !refreshingSession) {
          console.log("Authentication appears to be stuck");
          setAuthStuck(true);
          toast({
            title: "Authentication taking too long",
            description: "Having trouble connecting to the authentication service. You can try refreshing your session.",
            variant: "default",
          });
        }
      }, 5000); // 5 seconds
    } else if (!authLoading && !isSubmitting) {
      // If we're not loading anymore, make sure we're not in "stuck" state
      if (authStuck) {
        console.log("Resetting auth stuck state as loading has completed");
        setAuthStuck(false);
      }
    }
    
    return () => {
      if (timer) {
        console.log("Clearing auth stuck detection timer");
        clearTimeout(timer);
      }
    };
  }, [authLoading, isSubmitting, user, refreshingSession, authStuck, toast]);

  return {
    authStuck,
    redirecting,
    setAuthStuck,
    setRedirecting
  };
};
