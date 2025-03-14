
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Update user state with Supabase user data
  const updateUserState = useCallback(async (supabaseUser: any) => {
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
      console.error('Error updating user state:', error.message);
      setAuthError(error.message);
      setIsLoading(false);
      return null;
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    let isMounted = true;
    
    // Initial clear state
    setIsLoading(true);
    setAuthError(null);
    
    // Initial session check
    const checkSession = async () => {
      try {
        console.log('Checking initial session');
        const { data, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
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
        if (!isMounted) return;
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
        
        if (!isMounted) return;
        
        if (session?.user) {
          console.log('User authenticated:', session.user.email);
          await updateUserState(session.user);
        } else {
          console.log('User signed out or no session');
          setUser(null);
          setIsLoading(false);
        }
        
        setSessionChecked(true);
      }
    );
    
    // Run the initial check
    checkSession();
    
    // Clean up
    return () => {
      console.log('Cleaning up auth state listener');
      isMounted = false;
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [updateUserState]);

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      console.log('Manually refreshing session');
      
      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise<{error: Error}>((_, reject) => {
        setTimeout(() => reject({error: new Error('Session refresh timeout')}), 5000);
      });
      
      const sessionPromise = supabase.auth.getSession();
      
      // Race between the actual operation and the timeout
      let result;
      try {
        result = await Promise.race([sessionPromise, timeoutPromise]);
      } catch (error: any) {
        console.error('Session refresh timed out:', error.message);
        setAuthError('Session refresh timed out. Please try again.');
        setIsLoading(false);
        return null;
      }
      
      if (result.error) {
        console.error('Error refreshing session:', result.error.message);
        setAuthError(result.error.message);
        setIsLoading(false);
        return null;
      }
      
      if (result.data?.session?.user) {
        console.log('Session refreshed successfully');
        return await updateUserState(result.data.session.user);
      }
      
      console.log('No session found after refresh');
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
