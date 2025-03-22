
import { useCallback } from 'react';
import { supabase, clearAuthData } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

interface SessionRefreshProps {
  updateUserState: (supabaseUser: any, setUser?: (user: User | null) => void) => Promise<User | null>;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setAuthError: (error: string | null) => void;
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  isMounted: React.MutableRefObject<boolean>;
}

/**
 * Hook to handle session refresh logic
 */
export const useSessionRefreshLogic = ({
  updateUserState,
  setUser,
  setIsLoading,
  setAuthError,
  timeoutRef,
  isMounted
}: SessionRefreshProps) => {
  // Refresh session functionality - streamlined to prevent hanging
  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      console.log('Attempting to refresh session');
      setIsLoading(true);
      setAuthError(null);
      
      // Clear any existing timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // First check if we're already signed out
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError.message);
        setAuthError(sessionError.message);
        setIsLoading(false);
        return null;
      }
      
      if (!sessionData.session) {
        console.log('No active session to refresh');
        setIsLoading(false);
        return null;
      }
      
      // Create a timeout promise with longer timeout (5 seconds instead of 3)
      const timeoutPromise = new Promise<{data: null, error: any}>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject({
            data: null, 
            error: { message: 'Session refresh timed out, please try again' }
          });
        }, 5000); // Increased from 3s to 5s
      });
      
      // Create the refresh promise
      const refreshPromise = supabase.auth.refreshSession();
      
      // Race between actual operation and timeout
      const result = await Promise.race([refreshPromise, timeoutPromise]);
      
      // Clear the timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      const { data, error } = result;
      
      if (error) {
        console.error('Session refresh error:', error.message);
        setAuthError(error.message);
        
        // If token is invalid or expired, clear auth data
        if (error.message.includes('token') || error.message.includes('expired')) {
          console.log('Invalid token, clearing auth data');
          clearAuthData();
        }
        
        setIsLoading(false);
        return null;
      }
      
      if (data?.session?.user) {
        console.log('Session refreshed successfully');
        
        try {
          // Wrap user state update in another timeout to prevent hanging
          const userUpdatePromise = updateUserState(data.session.user, setUser);
          const userUpdateTimeout = new Promise<null>((_, reject) => {
            setTimeout(() => reject(new Error('User state update after refresh timed out')), 5000);
          });
          
          await Promise.race([userUpdatePromise, userUpdateTimeout]);
          
          // If we got here without rejection, we're good
          const userData = await updateUserState(data.session.user, setUser);
          setIsLoading(false);
          return userData;
        } catch (error) {
          console.error('Error updating user state after refresh:', error);
          
          // Create a basic user object on error
          const fallbackUser: User = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || '',
            setupCompleted: false
          };
          
          setUser(fallbackUser);
          setIsLoading(false);
          return fallbackUser;
        }
      }
      
      console.log('No session available after refresh');
      setIsLoading(false);
      return null;
    } catch (error: any) {
      console.error('Error refreshing session:', error);
      setAuthError(error.message || 'Unknown error during session refresh');
      setIsLoading(false);
      return null;
    } finally {
      // Always make sure loading is false when we're done
      setIsLoading(false);
    }
  }, [updateUserState, setUser, setIsLoading, setAuthError, timeoutRef, isMounted]);

  return { refreshSession };
};
