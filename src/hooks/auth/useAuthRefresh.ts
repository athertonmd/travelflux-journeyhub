
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';

export const useAuthRefresh = (
  updateUserState?: (user: any) => Promise<User | null>,
  setIsLoading?: (loading: boolean) => void,
  setAuthError?: (error: string | null) => void
) => {
  const refreshUserSession = useCallback(async (): Promise<User | null> => {
    try {
      if (setIsLoading) setIsLoading(true);
      if (setAuthError) setAuthError(null);
      
      console.log('Manually refreshing session');
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error.message);
        if (setAuthError) setAuthError(error.message);
        if (setIsLoading) setIsLoading(false);
        return null;
      }
      
      if (data.session?.user && updateUserState) {
        console.log('Session refreshed successfully');
        const userData = await updateUserState(data.session.user);
        if (setIsLoading) setIsLoading(false);
        return userData;
      }
      
      console.log('No session found after refresh');
      if (setIsLoading) setIsLoading(false);
      return null;
    } catch (error: any) {
      console.error('Session refresh error:', error.message);
      if (setAuthError) setAuthError(error.message);
      if (setIsLoading) setIsLoading(false);
      
      toast({
        title: 'Session refresh failed',
        description: error.message || 'Failed to refresh your session',
        variant: 'destructive'
      });
      
      return null;
    }
  }, [updateUserState, setIsLoading, setAuthError]);

  return { refreshUserSession };
};
