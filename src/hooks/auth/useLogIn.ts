
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
        
        console.log('Session check result:', data?.session ? 'Session exists' : 'No session');
        
        if (error) {
          console.error('Session check error:', error);
          toast({
            title: 'Session check failed',
            description: error.message,
            variant: 'destructive'
          });
          setIsLoading(false);
          return false;
        }
        
        setIsLoading(false);
        return !!data?.session;
      }
      
      // Regular login with email and password
      if (!email || !password) {
        console.error('Login error: Email and password required');
        toast({
          title: 'Login failed',
          description: 'Email and password are required',
          variant: 'destructive'
        });
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
      
      console.log('Login response:', data?.user ? 'User exists' : 'No user in response');
      
      if (data?.user) {
        console.log('Login successful, user ID:', data.user.id);
        toast({
          title: 'Login successful',
          description: 'Welcome back!'
        });
        setIsLoading(false);
        return true;
      }
      
      // If we reach here, something unexpected happened
      console.error('Login completed but no user or error was returned');
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred during login',
        variant: 'destructive'
      });
      
      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Login exception:', error);
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
