
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
      }, 3000); // Increased back to 3s for more reliability
      
      // Use Promise.race to add a timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Session check timeout')), 2500); // Increased to 2.5s
      });
      
      // Wrap supabase call in a try/catch to catch any unexpected errors
      let sessionPromise;
      try {
        sessionPromise = supabase.auth.getSession();
      } catch (error) {
        console.error('Error calling supabase.auth.getSession():', error);
        throw new Error('Failed to initialize session check');
      }
      
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
        
        // Defer user state update to next event loop
        setTimeout(async () => {
          try {
            if (!isMounted.current) return;
            
            const userData = await updateUserState(data.session.user);
            if (isMounted.current) {
              setUser(userData);
              setIsLoading(false);
              setSessionChecked(true);
            }
          } catch (error) {
            console.error('Deferred user state update error:', error);
            if (isMounted.current) {
              setUser(null);
              setIsLoading(false);
              setSessionChecked(true);
            }
          }
        }, 0);
      } else {
        console.log('No session found');
        setUser(null);
        setIsLoading(false);
        setSessionChecked(true);
      }
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
