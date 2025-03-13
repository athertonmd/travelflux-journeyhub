
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simple function to check the setup status
  const checkSetupStatus = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('setup_completed')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking setup status:', error);
        return false;
      }
      
      return data?.setup_completed || false;
    } catch (error) {
      console.error('Exception checking setup status:', error);
      return false;
    }
  }, []);

  // Function to update user state with Supabase user
  const updateUserState = useCallback(async (supabaseUser: any) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    try {
      const setupCompleted = await checkSetupStatus(supabaseUser.id);
      
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        agencyName: supabaseUser.user_metadata?.agencyName,
        setupCompleted
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Error updating user state:', error);
      setUser(null);
    }
  }, [checkSetupStatus]);

  // Auth state change listener
  useEffect(() => {
    // Set initial loading state
    setIsLoading(true);
    
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        if (data.session?.user) {
          await updateUserState(data.session.user);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Exception getting session:', error);
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
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

  // Sign up function
  const signUp = useCallback(async (
    name: string,
    email: string,
    password: string,
    agencyName?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            agencyName
          }
        }
      });
      
      if (error) {
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }
      
      if (data.user) {
        toast({
          title: 'Account created',
          description: 'Your account has been created successfully.'
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: 'Signup error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const logIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // First, sign out to clear any existing session
      await supabase.auth.signOut({ scope: 'local' });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }
      
      if (data.user) {
        // Force a session refresh
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          await updateUserState(sessionData.session.user);
          return true;
        }
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateUserState]);

  // Logout function
  const logOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.'
      });
    } catch (error: any) {
      toast({
        title: 'Logout error',
        description: error.message || 'An error occurred during logout',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update setup status
  const updateSetupStatus = useCallback(async (completed: boolean): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('agency_configurations')
        .update({ setup_completed: completed })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating setup status:', error);
        return false;
      }
      
      // Update local user state
      setUser(prev => prev ? { ...prev, setupCompleted: completed } : null);
      return true;
    } catch (error) {
      console.error('Exception updating setup status:', error);
      return false;
    }
  }, [user]);

  // Session refresh function
  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.log('No active session found during refresh');
        setUser(null);
        return null;
      }
      
      await updateUserState(data.session.user);
      return user;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  }, [updateUserState, user]);

  return {
    user,
    isLoading,
    signUp,
    logIn,
    logOut,
    updateSetupStatus,
    refreshSession
  };
};
