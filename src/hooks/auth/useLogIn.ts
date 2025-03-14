
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useLogIn = (setIsLoading: (loading: boolean) => void) => {
  const logIn = useCallback(async (
    email: string, 
    password: string, 
    refreshOnly = false
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (refreshOnly) {
        // Just check the session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          setIsLoading(false);
          return false;
        }
        setIsLoading(false);
        return !!data.session;
      }
      
      // Proceed with normal login
      console.log('Attempting login for:', email);
      
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
        setIsLoading(false);
        return false;
      }
      
      if (data.user) {
        console.log('Login successful, user:', data.user.id);
        toast({
          title: 'Login successful',
          description: 'Welcome back!'
        });
        // Don't set isLoading to false here as the auth listener will handle that
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      setIsLoading(false);
      return false;
    }
  }, [setIsLoading]);

  return logIn;
};
