
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update user state with Supabase user data
  const updateUserState = useCallback(async (supabaseUser: any) => {
    if (!supabaseUser) {
      console.log('No Supabase user, clearing user state');
      setUser(null);
      return null;
    }

    try {
      console.log('Updating user state for user:', supabaseUser.id);
      
      // Check setup status
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('setup_completed')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user configuration:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch user configuration',
          variant: 'destructive'
        });
      }
      
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        agencyName: supabaseUser.user_metadata?.agencyName,
        setupCompleted: data?.setup_completed || false
      };
      
      console.log('User state updated successfully:', userData.id);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error updating user state:', error);
      setUser(null);
      return null;
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;
    
    console.log('Setting up auth state listener');
    setIsLoading(true);
    
    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setIsLoading(false);
          return;
        }
        
        if (data.session?.user) {
          console.log('Session exists, updating user state with ID:', data.session.user.id);
          await updateUserState(data.session.user);
        } else {
          console.log('No session found, user not logged in');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Exception checking session:', error);
        setIsLoading(false);
      }
    };
    
    // Set up auth state change listener
    const setupAuthListener = async () => {
      try {
        authSubscription = await supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event);
            
            if (session?.user) {
              console.log('Session user found in auth state change, ID:', session.user.id);
              await updateUserState(session.user);
            } else {
              console.log('No session user in auth state change');
              setUser(null);
            }
            
            setIsLoading(false);
          }
        );
        
        console.log('Auth listener set up successfully');
      } catch (error) {
        console.error('Error setting up auth listener:', error);
        setIsLoading(false);
      }
    };
    
    checkSession();
    setupAuthListener();
    
    // Clean up listener on unmount
    return () => {
      console.log('Cleaning up auth listener');
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [updateUserState]);

  // Refresh session manually
  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      console.log('Manually refreshing session');
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        setIsLoading(false);
        return null;
      }
      
      if (data.session?.user) {
        console.log('Session found during refresh, user ID:', data.session.user.id);
        const userData = await updateUserState(data.session.user);
        setIsLoading(false);
        return userData;
      }
      
      console.log('No session found during refresh');
      setIsLoading(false);
      return null;
    } catch (error) {
      console.error('Exception refreshing session:', error);
      setIsLoading(false);
      return null;
    }
  }, [updateUserState]);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    updateUserState,
    refreshSession
  };
};
