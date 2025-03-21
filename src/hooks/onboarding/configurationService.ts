
import { supabase } from '@/integrations/supabase/client';
import { OnboardingFormData } from '@/types/onboarding.types';
import { initialFormData } from './initialFormData';
import { mapDatabaseToFormData, processFormBranding, processContactInfo } from './dataMappers';

export interface FetchConfigResult {
  formData: OnboardingFormData;
  error: string | null;
}

export const fetchUserConfiguration = async (userId: string): Promise<FetchConfigResult> => {
  if (!userId) {
    return { formData: initialFormData, error: null };
  }

  try {
    console.log(`ConfigService: Fetching config for user ${userId}`);
    
    const { data, error } = await supabase
      .from('agency_configurations')
      .select('*')
      .eq('user_id', userId as any)
      .maybeSingle();

    if (error) {
      console.error('ConfigService: Error fetching configuration:', error);
      return { 
        formData: initialFormData, 
        error: `Error loading configuration: ${error.message}` 
      };
    }

    if (!data) {
      console.error('ConfigService: No configuration found for user');
      return { 
        formData: initialFormData, 
        error: 'No configuration found for your account. Please contact support.' 
      };
    }

    console.log('ConfigService: Configuration loaded successfully');
    const newFormData = { ...initialFormData };
    
    // Map database fields to form data
    try {
      mapDatabaseToFormData(data, newFormData);
      await processFormBranding(data, newFormData);
      processContactInfo(data, newFormData);
      
      return { formData: newFormData, error: null };
    } catch (mapError) {
      console.error('ConfigService: Error mapping data:', mapError);
      return { 
        formData: initialFormData, 
        error: 'Error processing configuration data. Please try refreshing the page.' 
      };
    }
  } catch (err) {
    console.error('ConfigService: Exception fetching configuration:', err);
    const errorMsg = err instanceof Error ? err.message : 'Unknown error loading configuration';
    return { formData: initialFormData, error: errorMsg };
  }
};
