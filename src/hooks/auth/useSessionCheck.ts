
import { supabase, clearAuthData } from '@/integrations/supabase/client';

type SessionCheckProps = {
  isMounted: React.MutableRefObject<boolean>;
  setUser: (user: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  setAuthError: (error: string | null) => void;
  setSessionChecked: (checked: boolean) => void;
  updateUserState: (supabaseUser: any) => Promise<any>;
  initialCheckTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
};

export const useSessionCheck = () => {
  const checkSession = async ({
    isMounted,
    setUser,
    setIsLoading,
    setAuthError,
    setSessionChecked,
    updateUserState,
    initialCheckTimeoutRef
  }: SessionCheckProps) => {
    try {
      console.log('Checking initial session');
      
      // Set a hard timeout to prevent hanging in the initial session check
      initialCheckTimeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
          console.log('Initial session check timed out after 3 seconds, forcing completion');
          setUser(null);
          setIsLoading(false);
          setSessionChecked(true);
        }
      }, 3000); // Reduced from 5s to 3s
      
      // Use Promise.race to add a timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Session check timeout')), 2500); // Reduced from 4s to 2.5s
      });
      
      const sessionPromise = supabase.auth.getSession();
      
      const result = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as { data: any, error: any } | Error;
      
      // Clear the timeout since we got a result (either success or error)
      if (initialCheckTimeoutRef.current) {
        clearTimeout(initialCheckTimeoutRef.current);
        initialCheckTimeoutRef.current = null;
      }
      
      if (!isMounted.current) return;
      
      if (result instanceof Error) {
        console.error('Session check timed out');
        setAuthError('Session check timed out. Please try again.');
        setIsLoading(false);
        setSessionChecked(true);
        return;
      }
      
      const { data, error } = result;
      
      if (error) {
        console.error('Error checking session:', error.message);
        setAuthError(error.message);
        setIsLoading(false);
        setSessionChecked(true);
        return;
      }
      
      if (data.session?.user) {
        console.log('Session exists, updating user state');
        try {
          // Add another timeout for user state update
          const userUpdatePromise = updateUserState(data.session.user);
          const userUpdateTimeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('User update timeout')), 2000);
          });
          
          const userData = await Promise.race([userUpdatePromise, userUpdateTimeout]);
          setUser(userData);
        } catch (error) {
          console.error('User state update error or timeout:', error);
          setUser(null);
        }
      } else {
        console.log('No session found');
        setUser(null);
      }
      
      setIsLoading(false);
      setSessionChecked(true);
    } catch (error: any) {
      // Clear the timeout if we catch an error
      if (initialCheckTimeoutRef.current) {
        clearTimeout(initialCheckTimeoutRef.current);
        initialCheckTimeoutRef.current = null;
      }
      
      if (!isMounted.current) return;
      console.error('Session check error:', error.message);
      setAuthError(error.message);
      setIsLoading(false);
      setSessionChecked(true);
    }
  };

  return { checkSession };
};
