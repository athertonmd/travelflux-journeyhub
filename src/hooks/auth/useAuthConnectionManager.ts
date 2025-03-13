
import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to manage connection issues with authentication
 */
export const useAuthConnectionManager = () => {
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  // Function to handle connection issues
  const handleConnectionIssue = useCallback(async (onReconnectSuccess?: (session: any) => Promise<void>) => {
    if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts.current++;
      console.log(`Attempting reconnection (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`);
      
      // Clear session and try again
      try {
        await supabase.auth.signOut({ scope: 'local' });
        console.log("Session cleared, attempting to reconnect");
        
        // Wait a moment before checking session again
        setTimeout(async () => {
          try {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
              console.log("Reconnection successful, handling auth state");
              if (onReconnectSuccess && typeof onReconnectSuccess === 'function') {
                await onReconnectSuccess(data.session);
              }
            } else {
              console.log("No session after reconnection attempt");
              return false;
            }
          } catch (error) {
            console.error("Error during reconnection attempt:", error);
            return false;
          }
        }, 1000);
      } catch (error) {
        console.error("Error clearing session during reconnection:", error);
        return false;
      }
    } else {
      console.log("Max reconnection attempts reached, giving up");
      toast({
        title: "Connection issues detected",
        description: "Please try logging in again or check your internet connection",
        variant: "destructive"
      });
      return false;
    }
  }, []);

  const resetConnectionAttempts = useCallback(() => {
    reconnectAttempts.current = 0;
  }, []);

  return {
    handleConnectionIssue,
    resetConnectionAttempts,
    reconnectAttempts
  };
};
