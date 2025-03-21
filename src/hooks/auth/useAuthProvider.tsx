import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, clearAuthData, isTokenExpired } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, AuthContextType } from '@/types/auth.types';
import { useUpdateUserState } from '@/hooks/auth/useUpdateUserState';
import { useAuthOperations } from '@/hooks/auth/useAuthOperations';
import { useSetupStatusUpdate } from '@/hooks/auth/useSetupStatusUpdate';

export const useAuthProvider = (): AuthContextType => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [checkAttempts, setCheckAttempts] = useState(0);
  
  // Add reference to track if component is still mounted
  const isMounted = useRef(true);
  
  // Add reference to track active timeouts
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Custom hooks
  const { updateUserState } = useUpdateUserState();
  const { signUp, signIn, signOut } = useAuthOperations(setIsLoading);
  const { updateSetupStatus } = useSetupStatusUpdate(user, setUser, setIsLoading);

  // Initial session check and auth state change listener
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
    
    // Set up session expiry check interval
    const checkSessionExpiry = setInterval(async () => {
      if (!isMounted.current || !user) return;
      
      try {
        const expired = await isTokenExpired();
        if (expired) {
          console.log('Auth token has expired, refreshing session');
          refreshSession();
        }
      } catch (error) {
        console.error('Error checking token expiry:', error);
      }
    }, 60000); // Check every minute
    
    // Cleanup
    return () => {
      isMounted.current = false;
      console.log('Cleaning up auth listener');
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      authListener.subscription.unsubscribe();
      clearInterval(checkSessionExpiry);
    };
  }, [updateUserState, checkAttempts]);
  
  // Refresh session functionality - streamlined to prevent hanging
  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      console.log('Attempting to refresh session');
      setIsLoading(true);
      setAuthError(null);
      
      // First check if we're already signed out
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.log('No active session to refresh');
        setIsLoading(false);
        return null;
      }
      
      // Create a timeout promise
      const timeoutPromise = new Promise<{data: null, error: any}>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject({
            data: null, 
            error: { message: 'Session refresh timed out, please try again' }
          });
        }, 3000);
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
      setAuthError(error.message);
      setIsLoading(false);
      return null;
    }
  }, [updateUserState]);
  
  // Alias logIn and logOut for backward compatibility
  const logIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    console.log('Login wrapper called');
    setIsLoading(true);
    try {
      const result = await signIn(email, password);
      return result;
    } finally {
      // Ensure loading state is always reset
      setTimeout(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }, 500);
    }
  }, [signIn]);
  
  const logOut = useCallback(async (): Promise<void> => {
    console.log('Logout wrapper called');
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [signOut]);

  return {
    user,
    isLoading,
    authError,
    signUp,
    signIn,
    signOut,
    logIn,
    logOut,
    updateSetupStatus,
    refreshSession,
    sessionChecked
  };
};
