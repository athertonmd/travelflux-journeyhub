
import { useCallback } from 'react';
import { supabase, clearAuthData } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAuthOperations = (setIsLoading: (loading: boolean) => void) => {
  // Sign up operation
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
      
      toast({
        title: 'Signup error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
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
  }, [setIsLoading]);
  
  // Sign in operation
  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
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
        toast({
          title: 'Login successful',
          description: 'Welcome back!'
        });
        return true;
      }
      
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
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
  }, [setIsLoading]);
  
  // Sign out operation
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      clearAuthData();
    } catch (error: any) {
      toast({
        title: 'Logout error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  return {
    signUp,
    signIn,
    signOut
  };
};
