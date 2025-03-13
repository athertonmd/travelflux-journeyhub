
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useLogOut = (setIsLoading: (loading: boolean) => void) => {
  const logOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.'
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout error',
        description: error.message || 'An error occurred during logout',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  return logOut;
};
