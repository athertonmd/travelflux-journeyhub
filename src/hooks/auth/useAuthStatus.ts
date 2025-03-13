
import { useState, useEffect, useRef } from 'react';
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
  const stuckTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastShownRef = useRef(false);

  // Handle auth stuck situation
  useEffect(() => {
    // Clear any existing timer when dependencies change
    if (stuckTimerRef.current) {
      clearTimeout(stuckTimerRef.current);
      stuckTimerRef.current = null;
    }
    
    // Reset toast shown flag when auth state changes
    if (!authLoading && !isSubmitting) {
      toastShownRef.current = false;
    }
    
    // Only start the timer if we're in a loading state and not already stuck
    if ((authLoading || isSubmitting) && !authStuck && !refreshingSession) {
      console.log("Starting auth stuck detection timer");
      
      stuckTimerRef.current = setTimeout(() => {
        if ((authLoading || isSubmitting) && !user && !refreshingSession) {
          console.log("Authentication appears to be stuck");
          setAuthStuck(true);
          
          // Only show toast once per stuck state
          if (!toastShownRef.current) {
            toastShownRef.current = true;
            toast({
              title: "Authentication taking too long",
              description: "Having trouble connecting to the authentication service. You can try refreshing your session.",
              variant: "default",
            });
          }
        }
      }, 12000); // Increased from 8000ms to 12000ms to give more time for slow connections
    } else if (!authLoading && !isSubmitting) {
      // If we're not loading anymore, make sure we're not in "stuck" state
      if (authStuck) {
        console.log("Resetting auth stuck state as loading has completed");
        setAuthStuck(false);
      }
    }
    
    return () => {
      if (stuckTimerRef.current) {
        console.log("Clearing auth stuck detection timer");
        clearTimeout(stuckTimerRef.current);
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
