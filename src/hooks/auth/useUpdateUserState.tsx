
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useUpdateUserState = () => {
  const updateUserState = useCallback(async (
    supabaseUser: any,
    setUser?: (user: User | null) => void
  ): Promise<User | null> => {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('User state update timed out')), 3000);
      });
      
      // Create the actual fetch promise
      const fetchPromise = (async () => {
        const { data, error } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', supabaseUser.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching user configuration:', error.message);
          throw error;
        }
        
        const userData: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
          agencyName: supabaseUser.user_metadata?.agencyName,
          setupCompleted: data && 'setup_completed' in data ? data.setup_completed : false
        };
        
        return userData;
      })();
      
      // Race between the actual operation and the timeout
      const userData = await Promise.race([fetchPromise, timeoutPromise]) as User | null;
      
      if (userData && setUser) {
        setUser(userData);
      }
      
      return userData;
    } catch (error: any) {
      console.error('Error updating user state:', error.message);
      // If setUser is provided, we need to update the state even on error
      if (setUser) {
        // Create a basic user object with just the essential information
        // This prevents hanging on error but still allows navigation
        const fallbackUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
          agencyName: supabaseUser.user_metadata?.agencyName,
          setupCompleted: false // Default to false on error
        };
        setUser(fallbackUser);
        return fallbackUser;
      }
      return null;
    }
  }, []);

  return { updateUserState };
};
