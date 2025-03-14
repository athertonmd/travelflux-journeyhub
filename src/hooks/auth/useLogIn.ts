
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
      console.log('Login function called', { refreshOnly, email: email ? 'provided' : 'empty' });
      
      if (refreshOnly) {
        // Just check the session
        console.log('Refresh only mode, checking session');
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          setIsLoading(false);
          return false;
        }
        console.log('Session check successful, session:', data.session ? 'exists' : 'none');
        setIsLoading(false);
        return !!data.session;
      }
      
      // Regular login with email and password
      if (!email || !password) {
        console.error('Login error: Email and password required');
        setIsLoading(false);
        return false;
      }
      
      console.log('Attempting login for:', email);
      
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
        setIsLoading(false);
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
