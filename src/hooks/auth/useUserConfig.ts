
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

/**
 * Utility to fetch user configuration from the database
 */
export const fetchUserConfig = async (authUser: any): Promise<User | null> => {
  if (!authUser || !authUser.id) {
    console.error("fetchUserConfig: Invalid auth user provided", authUser);
    return null;
  }
  
  try {
    console.log("Fetching config for user:", authUser.id);
    
    // Set a timeout to prevent hanging
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        console.warn(`Config fetch timed out for user: ${authUser.id}`);
        resolve(null);
      }, 5000); // Reduced from 3000ms to 5000ms to give more time
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
          // Resolve with basic user info even if config fetch fails
          resolve({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
            agencyName: authUser.user_metadata?.agencyName,
            setupCompleted: false // Default to false if can't fetch
          });
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
        
        console.log("Resolved user config:", user);
        resolve(user);
      } catch (error) {
        console.error('Error in config fetch promise:', error);
        // Resolve with basic user info even if config fetch fails
        resolve({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
          agencyName: authUser.user_metadata?.agencyName,
          setupCompleted: false // Default to false if can't fetch
        });
      }
    });
    
    // Race the promises
    const user = await Promise.race([fetchConfigPromise, timeoutPromise]);
    if (!user) {
      console.warn("Config fetch timed out, falling back to basic user info");
      return {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
        agencyName: authUser.user_metadata?.agencyName,
        setupCompleted: false // Default to false if timed out
      };
    }
    return user;
  } catch (error) {
    console.error('Error processing user config:', error);
    // Return basic user info even if there's an error
    return {
      id: authUser.id,
      email: authUser.email || '',
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
      agencyName: authUser.user_metadata?.agencyName,
      setupCompleted: false // Default to false if error
    };
  }
};
