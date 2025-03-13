
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

/**
 * Utility to fetch user configuration from the database
 */
export const fetchUserConfig = async (authUser: any): Promise<User | null> => {
  if (!authUser || !authUser.id) return null;
  
  try {
    console.log("Fetching config for user:", authUser.id);
    
    // Set a timeout to prevent hanging
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        console.warn(`Config fetch timed out for user: ${authUser.id}`);
        resolve(null);
      }, 3000);
    });
    
    // Create the config fetch promise
    const fetchConfigPromise = new Promise<User | null>(async (resolve) => {
      try {
        const { data: configData, error: configError } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', authUser.id)
          .maybeSingle();
        
        if (configError) {
          console.error('Error fetching user config:', configError);
          resolve(null);
          return;
        }
        
        console.log("User config data:", configData);
        
        const user: User = {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
          agencyName: authUser.user_metadata?.agencyName,
          setupCompleted: configData?.setup_completed ?? false
        };
        
        resolve(user);
      } catch (error) {
        console.error('Error in config fetch promise:', error);
        resolve(null);
      }
    });
    
    // Race the promises
    return await Promise.race([fetchConfigPromise, timeoutPromise]);
  } catch (error) {
    console.error('Error processing user config:', error);
    return null;
  }
};
