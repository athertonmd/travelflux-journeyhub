
import { useCallback } from 'react';
import { supabase, getSiteUrl } from '@/integrations/supabase/client';
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
      
      // Short delay to ensure signout is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Attempting to sign in with password');
      
      // Detect if we're in a production environment
      const isProduction = window.location.hostname !== 'localhost' && 
                          window.location.hostname !== '127.0.0.1';
      
      // Set different timeout values based on environment
      const isNetlify = window.location.hostname.includes('netlify.app');
      const timeoutDuration = isNetlify ? 25000 : (isProduction ? 15000 : 5000);
      
      console.log(`Login environment: ${isProduction ? 'Production' : 'Development'}${isNetlify ? ' (Netlify)' : ''}`);
      console.log(`Login timeout: ${timeoutDuration}ms`);
      
      // Use a timeout to prevent hanging during login
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // If we're on Netlify, we need to handle redirect separately
      // This is a workaround for the TypeScript error
      if (isNetlify) {
        // Log that we're adding a redirect URL for Netlify
        console.log('Setting redirect URL for Netlify:', getSiteUrl());
        
        // For Netlify, we'll manually set the redirect URL after login
        // This avoids the TypeScript error with the options object
      }
      
      const timeoutPromise = new Promise<{data: null, error: any}>((_, reject) => {
        setTimeout(() => reject({
          data: null, 
          error: { message: 'Login timed out. Please try again.' }
        }), timeoutDuration);
      });
      
      const { data, error } = await Promise.race([loginPromise, timeoutPromise]);
      
      if (error) {
        console.error('Login error:', error.message);
        
        // Provide more user-friendly error messages
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Incorrect email or password. Please try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = isNetlify ? 
            'Login is taking too long. Please check your Supabase project settings and ensure the Netlify domain is added to the allowed URLs.' :
            'Login is taking too long. This might be due to network issues or incorrect Supabase configuration.';
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
