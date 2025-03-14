
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useLogOut = () => {
  const logOut = useCallback(async (): Promise<void> => {
    try {
      console.log('Logging out user');
      
      // First, clear any local storage related to auth
      localStorage.removeItem('tripscape-auth-token');
      
      // Then sign out from Supabase
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
        
        // Force clear auth data even if there was an error
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.expires_at');
        sessionStorage.removeItem('supabase.auth.token');
        return;
      }
      
      console.log('Logout successful');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.'
      });
      
      // Short timeout to allow state to update
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
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.expires_at');
      sessionStorage.removeItem('supabase.auth.token');
    }
  }, []);

  return logOut;
};
