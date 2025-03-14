
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update user state with Supabase user data
  const updateUserState = useCallback(async (supabaseUser: any) => {
    if (!supabaseUser) {
      console.log('No user data available, clearing user state');
      setUser(null);
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
      }
      
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        agencyName: supabaseUser.user_metadata?.agencyName,
        setupCompleted: data?.setup_completed || false
      };
      
      setUser(userData);
      return userData;
    } catch (error: any) {
      console.error('Error updating user state:', error.message);
      setUser(null);
      return null;
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    setIsLoading(true);
    
    // Initial session check
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error.message);
          setIsLoading(false);
          return;
        }
        
        if (data.session?.user) {
          console.log('Session exists, updating user state');
          await updateUserState(data.session.user);
        } else {
          console.log('No session found');
        }
        
        setIsLoading(false);
      } catch (error: any) {
        console.error('Session check error:', error.message);
        setIsLoading(false);
      }
    };
    
    // Auth state change listener
    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          console.log('User authenticated:', session.user.email);
          await updateUserState(session.user);
        } else {
          console.log('User signed out or no session');
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Run the initial check
    checkSession();
    
    // Clean up
    return () => {
      data?.subscription.unsubscribe();
    };
  }, [updateUserState]);

  return {
    user,
    isLoading,
    setIsLoading,
    refreshSession: async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        await updateUserState(data.session.user);
      }
      setIsLoading(false);
      return user;
    }
  };
};
