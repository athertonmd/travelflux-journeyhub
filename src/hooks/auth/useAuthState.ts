
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
      setUser(null);
      return null;
    }

    try {
      // Check setup status
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('setup_completed')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user configuration:', error);
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
    } catch (error) {
      console.error('Error updating user state:', error);
      setUser(null);
      return null;
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    setIsLoading(true);
    
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setIsLoading(false);
          return;
        }
        
        if (data.session?.user) {
          await updateUserState(data.session.user);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Exception checking session:', error);
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          await updateUserState(session.user);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Clean up listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [updateUserState]);

  // Refresh session manually
  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return null;
      }
      
      if (data.session?.user) {
        return await updateUserState(data.session.user);
      }
      
      return null;
    } catch (error) {
      console.error('Exception refreshing session:', error);
      return null;
    } finally {
      setIsLoading(false);
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
