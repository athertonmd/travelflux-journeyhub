
import { useCallback } from 'react';
import { supabase, clearAuthData } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useLogOut = () => {
  const logOut = useCallback(async (): Promise<void> => {
    try {
      console.log('Logging out user');
      
      // First attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only sign out from this device
      });
      
      if (error) {
        console.error('Logout error:', error.message);
        toast({
          title: 'Logout error',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        console.log('Logout successful');
        toast({
          title: 'Logged out',
          description: 'You have been successfully logged out.'
        });
      }
      
      // Always clear auth data regardless of Supabase response
      clearAuthData();
      
      // Short timeout to allow state to update before redirect
      setTimeout(() => {
        window.location.href = '/login';
      }, 300);
    } catch (error: any) {
      console.error('Logout exception:', error.message);
      toast({
        title: 'Logout error',
        description: error.message || 'An error occurred during logout',
        variant: 'destructive'
      });
      
      // Force clear auth data even if there was an exception
      clearAuthData();
      
      // Redirect to login page
      window.location.href = '/login';
    }
  }, []);

  return logOut;
};
