
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useLogOut = () => {
  const logOut = useCallback(async (): Promise<void> => {
    try {
      console.log('Logging out user');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        toast({
          title: 'Logout error',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }
      
      console.log('Logout successful');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.'
      });
    } catch (error: any) {
      console.error('Logout exception:', error.message);
      toast({
        title: 'Logout error',
        description: error.message || 'An error occurred during logout',
        variant: 'destructive'
      });
    }
  }, []);

  return logOut;
};
