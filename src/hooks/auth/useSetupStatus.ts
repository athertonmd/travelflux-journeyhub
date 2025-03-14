
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSetupStatus = () => {
  const updateSetupStatus = useCallback(async (completed: boolean): Promise<boolean> => {
    try {
      console.log('Updating setup status to:', completed);
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        console.error('No authenticated user found');
        return false;
      }
      
      const userId = sessionData.session.user.id;
      
      const { error } = await supabase
        .from('agency_configurations')
        .update({ setup_completed: completed })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error updating setup status:', error.message);
        return false;
      }
      
      console.log('Setup status updated successfully');
      return true;
    } catch (error: any) {
      console.error('Setup status update exception:', error.message);
      return false;
    }
  }, []);

  return updateSetupStatus;
};
