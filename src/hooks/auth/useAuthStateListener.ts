
import { useEffect, useRef, useCallback } from 'react';
import { supabase, clearAuthData } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

type AuthListenerProps = {
  isMounted: React.MutableRefObject<boolean>;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setAuthError: (error: string | null) => void;
  setSessionChecked: (checked: boolean) => void;
  updateUserState: (supabaseUser: any) => Promise<User | null>;
  checkSessionExpiry: () => Promise<boolean>;
  refreshSession: () => Promise<User | null>;
};

export const useAuthStateListener = ({
  isMounted,
  setUser,
  setIsLoading,
  setAuthError,
  setSessionChecked,
  updateUserState,
  checkSessionExpiry,
  refreshSession
}: AuthListenerProps) => {
  const tokenCheckIntervalRef = useRef<number | null>(null);
  
  const setupAuthListener = useCallback(() => {
    console.log('Setting up auth state listener');
    
    // Initial session check with timeout
    const checkSession = async () => {
      try {
        console.log('Checking initial session');
        
        // Check if token is about to expire
        const expired = await checkSessionExpiry();
        if (expired) {
          console.log('Token is expired or about to expire, attempting refresh');
          
          // Clear any existing auth data if we know it's expired
          // This helps prevent using stale tokens
          if (window.location.pathname === '/login') {
            clearAuthData();
          }
        }
        
        // Use Promise.race to add a timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session check timeout')), 5000);
        });
        
        const sessionPromise = supabase.auth.getSession();
        
        const result = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as { data: any, error: any } | Error;
        
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
          const userData = await updateUserState(data.session.user);
          setUser(userData);
          setIsLoading(false);
        } else {
          console.log('No session found');
          setUser(null);
          setIsLoading(false);
        }
        
        setSessionChecked(true);
      } catch (error: any) {
        if (!isMounted.current) return;
        console.error('Session check error:', error.message);
        setAuthError(error.message);
        setIsLoading(false);
        setSessionChecked(true);
      }
    };
    
    // Auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!isMounted.current) return;
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          setUser(null);
          setIsLoading(false);
          setSessionChecked(true);
          return;
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed, updating state');
          if (session?.user) {
            const userData = await updateUserState(session.user);
            setUser(userData);
          }
          setSessionChecked(true);
          return;
        }
        
        if (session?.user) {
          console.log('User authenticated:', session.user.email);
          const userData = await updateUserState(session.user);
          setUser(userData);
          setSessionChecked(true);
        } else if (event === 'INITIAL_SESSION') {
          console.log('Initial session with no user, marking as checked');
          setUser(null);
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    );
    
    // Run the initial check
    checkSession();
    
    // Add periodic token check
    tokenCheckIntervalRef.current = window.setInterval(async () => {
      if (!isMounted.current) return;
      
      // Only perform check if we're not already loading
      if (!setIsLoading && setUser) {
        const expired = await checkSessionExpiry();
        if (expired) {
          console.log('Token is about to expire, refreshing session');
          await refreshSession();
        }
      }
    }, 60000); // Check every minute
    
    return authListener;
  }, [
    isMounted, 
    setUser, 
    setIsLoading, 
    setAuthError, 
    setSessionChecked, 
    updateUserState, 
    checkSessionExpiry, 
    refreshSession
  ]);

  // Cleanup function
  const cleanupAuthListener = useCallback((authListener: any) => {
    console.log('Cleaning up auth state listener');
    
    if (authListener) {
      authListener.subscription.unsubscribe();
    }
    
    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
      tokenCheckIntervalRef.current = null;
    }
  }, []);

  return {
    setupAuthListener,
    cleanupAuthListener
  };
};
