
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/auth.types';

export const useSetupStatusUpdate = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsLoading: (loading: boolean) => void
) => {
  const updateSetupStatus = useCallback(async (completed: boolean): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('agency_configurations')
        .update({
          setup_completed: completed
        } as any)
        .eq('user_id', user.id as any);
      
      if (error) {
        toast({
          title: 'Update failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }
      
      // Create a new user object with the updated setup status
      // instead of using a function that returns a new object
      if (user) {
        const updatedUser: User = {
          ...user,
          setupCompleted: completed
        };
        setUser(updatedUser);
      }
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Update error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser, setIsLoading]);

  return { updateSetupStatus };
};
