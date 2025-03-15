
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, clearAuthData, isTokenExpired } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  
  // Add refs to track state between renders and cleanup
  const isMounted = useRef(true);
  const refreshAttempts = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRefreshedAt = useRef<number>(0);

  // Update user state with Supabase user data
  const updateUserState = useCallback(async (supabaseUser: any) => {
    if (!isMounted.current) return null;
    
    if (!supabaseUser) {
      console.log('No user data available, clearing user state');
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      console.log('Updating user state for:', supabaseUser.email);
      
      // Check setup status
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('setup_completed')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user configuration:', error.message);
        
        // Check if this is a token error
        if (error.message.includes('JWT') || error.message.includes('token')) {
          console.warn('Token error detected, attempting refresh');
          await refreshSession();
          return null;
        }
        
        setAuthError(error.message);
        setIsLoading(false);
        return null;
      }
      
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        agencyName: supabaseUser.user_metadata?.agencyName,
        setupCompleted: data?.setup_completed || false
      };
      
      setUser(userData);
      setIsLoading(false);
      return userData;
    } catch (error: any) {
      if (!isMounted.current) return null;
      console.error('Error updating user state:', error.message);
      setAuthError(error.message);
      setIsLoading(false);
      return null;
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    isMounted.current = true;
    refreshAttempts.current = 0;
    
    // Initial clear state
    setIsLoading(true);
    setAuthError(null);
    setSessionChecked(false);
    
    // Create new abort controller for this session check
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    // Initial session check with timeout
    const checkSession = async () => {
      try {
        console.log('Checking initial session');
        
        // Check if token is about to expire
        const expired = await isTokenExpired();
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
        
        if (!isMounted.current || signal.aborted) return;
        
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
          await updateUserState(data.session.user);
        } else {
          console.log('No session found');
          setUser(null);
          setIsLoading(false);
        }
        
        setSessionChecked(true);
      } catch (error: any) {
        if (!isMounted.current || signal.aborted) return;
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
            await updateUserState(session.user);
          }
          setSessionChecked(true);
          return;
        }
        
        if (session?.user) {
          console.log('User authenticated:', session.user.email);
          await updateUserState(session.user);
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
    const tokenCheckInterval = setInterval(async () => {
      if (!isMounted.current) return;
      
      // Only perform check if we're not already loading
      if (!isLoading && user) {
        const expired = await isTokenExpired();
        if (expired) {
          console.log('Token is about to expire, refreshing session');
          await refreshSession();
        }
      }
    }, 60000); // Check every minute
    
    // Clean up
    return () => {
      console.log('Cleaning up auth state listener');
      isMounted.current = false;
      clearInterval(tokenCheckInterval);
      
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [updateUserState]);

  const refreshSession = async () => {
    try {
      // Prevent too frequent refreshes
      const now = Date.now();
      if (now - lastRefreshedAt.current < 5000) {
        console.log('Skipping refresh - too soon since last refresh');
        return user;
      }
      lastRefreshedAt.current = now;
      
      if (refreshAttempts.current >= 3) {
        console.log('Too many refresh attempts, suggesting clearing storage');
        setAuthError('Session refresh failed after multiple attempts. Please try clearing storage.');
        setIsLoading(false);
        return null;
      }
      
      refreshAttempts.current += 1;
      setIsLoading(true);
      setAuthError(null);
      
      console.log(`Manually refreshing session (attempt ${refreshAttempts.current})`);
      
      // Cancel any existing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create a new abort controller
      abortControllerRef.current = new AbortController();
      
      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise<{error: Error}>((_, reject) => {
        setTimeout(() => reject({error: new Error('Session refresh timeout')}), 5000);
      });
      
      // Try to force-refresh the session
      const refreshPromise = supabase.auth.refreshSession();
      
      // Race between the actual operation and the timeout
      let result;
      try {
        result = await Promise.race([refreshPromise, timeoutPromise]);
      } catch (error: any) {
        console.error('Session refresh timed out:', error.message);
        setAuthError('Session refresh timed out. Please try again or clear storage.');
        setIsLoading(false);
        return null;
      }
      
      if (result.error) {
        console.error('Error refreshing session:', result.error.message);
        
        // If we have a token error or refresh error, it's likely the token is invalid
        // or the refresh token has expired
        if (
          result.error.message.includes('JWT') || 
          result.error.message.includes('token') ||
          result.error.message.includes('refresh')
        ) {
          console.log('Token error detected, clearing auth data for fresh login');
          clearAuthData();
        }
        
        setAuthError(result.error.message);
        setIsLoading(false);
        return null;
      }
      
      if (result.data?.session?.user) {
        console.log('Session refreshed successfully');
        return await updateUserState(result.data.session.user);
      }
      
      console.log('No session found after refresh');
      setUser(null);
      setIsLoading(false);
      return null;
    } catch (error: any) {
      console.error('Session refresh error:', error.message);
      setAuthError(error.message);
      setIsLoading(false);
      return null;
    }
  };

  return {
    user,
    isLoading,
    authError,
    sessionChecked,
    setIsLoading,
    setAuthError,
    refreshSession
  };
};
