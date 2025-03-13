import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh session function
  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          agencyName: session.user.user_metadata?.agencyName,
          setupCompleted: false // Will be updated after checking profile
        };
        
        // Check if setup is completed from agency_configurations
        const { data: configData } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', userData.id)
          .maybeSingle();
          
        const updatedUser = {
          ...userData,
          setupCompleted: configData?.setup_completed ?? false
        };
        
        setUser(updatedUser);
        return updatedUser;
      }
      
      setUser(null);
      return null;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state on component mount
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        await refreshSession();
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            agencyName: session.user.user_metadata?.agencyName,
            setupCompleted: false
          };
          
          // Check if setup is completed from agency_configurations
          const { data: configData } = await supabase
            .from('agency_configurations')
            .select('setup_completed')
            .eq('user_id', userData.id)
            .maybeSingle();
            
          setUser({
            ...userData,
            setupCompleted: configData?.setup_completed ?? false
          });
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [refreshSession]);

  // Sign up function
  const signUp = async (name: string, email: string, password: string, agencyName?: string): Promise<boolean> => {
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
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Account created",
          description: "Welcome to Tripscape!",
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error?.message || "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const logIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error?.message || "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error?.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update setup status function
  const updateSetupStatus = async (completed: boolean): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('agency_configurations')
        .update({ setup_completed: completed })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, setupCompleted: completed } : null);
      return true;
    } catch (error: any) {
      console.error('Error updating setup status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update setup status",
        variant: "destructive",
      });
      return false;
    }
  };

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
