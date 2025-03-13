
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/auth.types';

export const useSetupStatus = (setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  const updateSetupStatus = useCallback(async (completed: boolean): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session?.user) return false;
      
      const userId = data.session.user.id;
      
      const { error: updateError } = await supabase
        .from('agency_configurations')
        .update({ setup_completed: completed })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error updating setup status:', updateError);
        return false;
      }
      
      // Update local user state
      setUser(prev => prev ? { ...prev, setupCompleted: completed } : null);
      return true;
    } catch (error) {
      console.error('Error updating setup status:', error);
      return false;
    }
  }, [setUser]);

  return updateSetupStatus;
};
