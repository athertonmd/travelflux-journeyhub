
import { useEffect } from 'react';
import { supabase, clearAuthData } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

interface InitialSessionProps {
  isMounted: React.MutableRefObject<boolean>;
  updateUserState: (supabaseUser: any, setUser?: (user: User | null) => void) => Promise<User | null>;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setAuthError: (error: string | null) => void;
  setSessionChecked: (checked: boolean) => void;
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  checkAttempts: number;
  setCheckAttempts: (callback: (prev: number) => number) => void;
}

/**
 * Hook to handle the initial session check and auth state change listener
 */
export const useInitialSession = ({
  isMounted,
  updateUserState,
  setUser,
  setIsLoading,
  setAuthError,
  setSessionChecked,
  timeoutRef,
  checkAttempts,
  setCheckAttempts
}: InitialSessionProps) => {
  useEffect(() => {
    console.log('Setting up auth listener and checking session');
    
    // First set up the auth change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!isMounted.current) return;
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing user state');
          setUser(null);
          return;
        }
        
        if (session?.user) {
          console.log('Session available, updating user state');
          try {
            // Add a timeout for the user state update
            const userUpdatePromise = updateUserState(session.user, setUser);
            
            // Create a timeout promise
            const timeoutPromise = new Promise<null>((_, reject) => {
              timeoutRef.current = setTimeout(() => {
                reject(new Error('User state update timed out during auth change'));
              }, 3000);
            });
            
            // Race between the update and the timeout
            await Promise.race([userUpdatePromise, timeoutPromise]);
            
            // Clear the timeout if the operation completed
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            
            if (isMounted.current) {
              setAuthError(null);
              setSessionChecked(true);
            }
          } catch (error) {
            if (isMounted.current) {
              console.error('Error updating user state from auth change:', error);
              
              // Even on error, we need to update the session checked state
              // to prevent the app from getting stuck in a loading state
              setSessionChecked(true);
              setAuthError(error instanceof Error ? error.message : 'Error updating user state');
              
              // Create a basic user object to prevent hanging
              if (session.user) {
                const fallbackUser: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
                  setupCompleted: false
                };
                setUser(fallbackUser);
              }
            }
          }
        }
      }
    );
    
    // Then check for existing session with timeout protection
    const checkSession = async () => {
      try {
        if (!isMounted.current) return;
        
        setIsLoading(true);
        console.log(`Checking for existing session (attempt ${checkAttempts + 1})`);
        
        // Add timeout for getSession call with increased timeout
        const timeoutPromise = new Promise((_, reject) => {
          timeoutRef.current = setTimeout(() => {
            reject(new Error('Session check timed out'));
          }, 5000); // Increased from 3s to 5s for slower connections
        });
        
        const sessionPromise = supabase.auth.getSession();
        
        // Race between actual API call and timeout
        const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        // Clear the timeout if we got a result
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        if (!isMounted.current) return;
        
        const { data, error } = result;
        
        if (error) {
          console.error('Session check error:', error.message);
          setAuthError(error.message);
          
          // If we had a timeout or network error, retry up to 1 time
          if (checkAttempts < 1 && (error.message.includes('timeout') || error.message.includes('network'))) {
            setCheckAttempts(prev => prev + 1);
            setIsLoading(false);
            return;
          }
          
          setIsLoading(false);
          setSessionChecked(true);
          return;
        }
        
        if (data.session?.user) {
          console.log('Existing session found, updating user state');
          
          // Add timeout protection for the user state update
          try {
            const userUpdatePromise = updateUserState(data.session.user, setUser);
            const userUpdateTimeout = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('User state update during session check timed out')), 4000);
            });
            
            await Promise.race([userUpdatePromise, userUpdateTimeout]);
          } catch (updateError) {
            console.error('Error updating user state from session check:', updateError);
            
            // Create a fallback user object on error
            if (data.session.user) {
              const fallbackUser: User = {
                id: data.session.user.id,
                email: data.session.user.email || '',
                name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || '',
                setupCompleted: false
              };
              setUser(fallbackUser);
            }
          }
        } else {
          console.log('No existing session found');
        }
        
        setSessionChecked(true);
        setIsLoading(false);
      } catch (error: any) {
        if (!isMounted.current) return;
        
        console.error('Error checking session:', error);
        setAuthError(error.message);
        setIsLoading(false);
        setSessionChecked(true);
        
        // Ensure we don't leave user in a loading state
        setTimeout(() => {
          if (isMounted.current) {
            setIsLoading(false);
          }
        }, 500);
      }
    };
    
    checkSession();
    
    // Cleanup
    return () => {
      isMounted.current = false;
      console.log('Cleaning up auth listener');
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      authListener.subscription.unsubscribe();
    };
  }, [updateUserState, checkAttempts]);
};
