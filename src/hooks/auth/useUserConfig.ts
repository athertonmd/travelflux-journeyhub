
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

/**
 * Utility to fetch user configuration from the database
 */
export const fetchUserConfig = async (authUser: any): Promise<User | null> => {
  if (!authUser || !authUser.id) return null;
  
  try {
    console.log("Fetching config for user:", authUser.id);
    
    const { data: configData, error: configError } = await supabase
      .from('agency_configurations')
      .select('setup_completed')
      .eq('user_id', authUser.id)
      .maybeSingle();
    
    if (configError) {
      console.error('Error fetching user config:', configError);
      return null;
    }
    
    console.log("User config data:", configData);
    
    return {
      id: authUser.id,
      email: authUser.email || '',
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
      agencyName: authUser.user_metadata?.agencyName,
      setupCompleted: configData?.setup_completed ?? false
    };
  } catch (error) {
    console.error('Error processing user config:', error);
    return null;
  }
};
