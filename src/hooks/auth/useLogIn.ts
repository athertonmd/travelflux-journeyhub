
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useLogIn = () => {
  const logIn = useCallback(async (
    email: string, 
    password: string
  ): Promise<boolean> => {
    try {
      console.log('Login attempt for:', email);
      
      if (!email || !password) {
        toast({
          title: 'Login failed',
          description: 'Email and password are required',
          variant: 'destructive'
        });
        return false;
      }
      
      // Clear any existing session before login
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }
      
      if (data?.user) {
        console.log('Login successful for user:', data.user.id);
        return true;
      }
      
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } catch (error: any) {
      console.error('Login exception:', error.message);
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  }, []);

  return logIn;
};
