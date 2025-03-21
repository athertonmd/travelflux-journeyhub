
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useUpdateUserState = () => {
  const updateUserState = useCallback(async (
    supabaseUser: any,
    setUser?: (user: User | null) => void
  ): Promise<User | null> => {
    if (!supabaseUser) {
      console.log('No user data available for state update');
      return null;
    }

    try {
      console.log('Updating user state for:', supabaseUser.email);
      
      // Create a timeout promise with a more generous timeout
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('User state update timed out')), 5000); // Increased from 3s to 5s
      });
      
      // Create the actual fetch promise
      const fetchPromise = (async () => {
        try {
          const { data, error } = await supabase
            .from('agency_configurations')
            .select('setup_completed')
            .eq('user_id', supabaseUser.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching user configuration:', error.message);
            throw error;
          }
          
          // Add defensive check to ensure data contains the expected property
          const setupCompleted = data && 'setup_completed' in data ? data.setup_completed : false;
          
          const userData: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
            agencyName: supabaseUser.user_metadata?.agencyName,
            setupCompleted: setupCompleted
          };
          
          return userData;
        } catch (innerError) {
          console.error('Inner error fetching user configuration:', innerError);
          // Return a fallback user object instead of throwing
          return {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
            agencyName: supabaseUser.user_metadata?.agencyName,
            setupCompleted: false
          };
        }
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
