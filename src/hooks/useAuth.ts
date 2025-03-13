
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
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
        console.error('Signup error:', error);
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
      console.error('Signup error:', error);
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
      
      // Clear any existing sessions to prevent conflicts
      await supabase.auth.signOut({ scope: 'local' });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }
      
      if (data.user) {
        // Session will be handled by the auth listener
        toast({
          title: 'Login successful',
          description: 'Welcome back!'
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.'
      });
    } catch (error: any) {
      console.error('Logout error:', error);
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
      console.error('Error updating setup status:', error);
      return false;
    }
  }, [user]);

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
