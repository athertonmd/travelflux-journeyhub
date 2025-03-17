
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useUpdateUserState = () => {
  const updateUserState = useCallback(async (
    supabaseUser: any,
    setUser?: (user: User | null) => void
  ): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('setup_completed')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user configuration:', error.message);
      }
      
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        agencyName: supabaseUser.user_metadata?.agencyName,
        setupCompleted: data?.setup_completed || false
      };
      
      if (setUser) {
        setUser(userData);
      }
      return userData;
    } catch (error) {
      console.error('Error updating user state:', error);
      return null;
    }
  }, []);

  return { updateUserState };
};
