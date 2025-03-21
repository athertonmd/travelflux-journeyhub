
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
      
      // Clear any existing session before login to avoid state conflicts
      await supabase.auth.signOut();
      
      // Wait a moment to ensure the signout is processed
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        
        // Provide more user-friendly error messages
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Incorrect email or password. Please try again.';
        }
        
        toast({
          title: 'Login failed',
          description: errorMessage,
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
        description: 'An unexpected error occurred during login',
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
