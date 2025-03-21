
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingFormData, ContactMethod } from '@/types/onboarding.types';
import { initialFormData } from './initialFormData';
import { Json } from '@/integrations/supabase/types';

export const useFormDataFetcher = (userId: string | undefined) => {
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const fetchConfig = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        setError(null);
        console.log(`FormDataFetcher: Fetching config for user ${userId} (attempt ${fetchAttempts + 1})`);
        
        const { data, error } = await supabase
          .from('agency_configurations')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (!isMounted) return;
        
        if (error) {
          console.error('FormDataFetcher: Error fetching configuration:', error);
          
          // If the error is a network error or timeout, we can retry
          if (fetchAttempts < 2 && (error.message.includes('network') || error.message.includes('timeout'))) {
            setFetchAttempts(prev => prev + 1);
            setIsLoading(false);
            return;
          }
          
          setError(`Error loading configuration: ${error.message}`);
          setIsLoading(false);
          return;
        }

        if (!data) {
          console.error('FormDataFetcher: No configuration found for user');
          setError('No configuration found for your account. Please contact support.');
          setIsLoading(false);
          return;
        }

        console.log('FormDataFetcher: Configuration loaded successfully');
        const newFormData = { ...formData };
        
        // Map database fields to form data
        try {
          mapDatabaseToFormData(data, newFormData);
          setFormData(newFormData);
        } catch (mapError) {
          console.error('FormDataFetcher: Error mapping data:', mapError);
          setError('Error processing configuration data. Please try refreshing the page.');
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error('FormDataFetcher: Exception fetching configuration:', err);
        setError(err instanceof Error ? err.message : 'Unknown error loading configuration');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchConfig();
    
    return () => {
      isMounted = false;
    };
  }, [userId, fetchAttempts]);
  
  const mapDatabaseToFormData = (data: any, newFormData: OnboardingFormData) => {
    // Process products
    if (data.products) {
      newFormData.products = data.products as OnboardingFormData['products'];
    }
    
    // Process GDS provider
    if (data.gds_provider) {
      newFormData.gdsProvider = data.gds_provider;
    }
    
    // Process GDS config with failsafe
    if (data.gds_config) {
      try {
        newFormData.gdsConfig = {
          ...initialFormData.gdsConfig,
          ...(data.gds_config as Partial<OnboardingFormData['gdsConfig']>)
        };
      } catch (e) {
        console.error('Error processing GDS config:', e);
        // Fallback to initial data if parsing fails
        newFormData.gdsConfig = initialFormData.gdsConfig;
      }
    }
    
    // Process trip tiles
    if (data.selected_trip_tiles) {
      newFormData.selectedTripTiles = data.selected_trip_tiles;
    }
    
    // Process alert countries
    if (data.alert_countries) {
      newFormData.alertCountries = data.alert_countries;
    }
    
    // Process trip briefs flag
    if (data.trip_briefs_enabled !== null && data.trip_briefs_enabled !== undefined) {
      newFormData.tripBriefsEnabled = data.trip_briefs_enabled;
    }
    
    // Process alert email
    if (data.alert_email) {
      newFormData.alertEmail = data.alert_email;
    }
  };

  const processFormBranding = async (data: any, newFormData: OnboardingFormData) => {
    if (data.branding && typeof data.branding === 'object') {
      const brandingData = data.branding as Record<string, unknown>;
      newFormData.branding = {
        ...newFormData.branding,
        primaryColor: typeof brandingData.primaryColor === 'string' ? brandingData.primaryColor : '#1EAEDB',
        secondaryColor: typeof brandingData.secondaryColor === 'string' ? brandingData.secondaryColor : '#0FA0CE',
        logoUrl: typeof brandingData.logoUrl === 'string' ? brandingData.logoUrl : undefined
      };
      
      // If logo URL exists, fetch the logo preview
      if (newFormData.branding.logoUrl) {
        try {
          const { data: logoData, error: logoError } = await supabase.storage
            .from('agency_logos')
            .createSignedUrl(newFormData.branding.logoUrl, 60 * 60 * 24); // 24 hours expiry
          
          if (logoError) {
            console.error('Error getting logo signed URL:', logoError);
            return;
          }
          
          if (logoData && logoData.signedUrl) {
            newFormData.branding.logoUrl = logoData.signedUrl;
          }
        } catch (logoError) {
          console.error('Exception fetching logo:', logoError);
        }
      }
    }
  };

  const processContactInfo = (data: any, newFormData: OnboardingFormData) => {
    if (data.contact_info && typeof data.contact_info === 'object') {
      if (Array.isArray(data.contact_info)) {
        newFormData.contactInfo = initialFormData.contactInfo;
      } else {
        const contactInfoObj = data.contact_info as Record<string, unknown>;
        
        newFormData.contactInfo = {
          blurb: typeof contactInfoObj.blurb === 'string' 
            ? contactInfoObj.blurb 
            : initialFormData.contactInfo.blurb,
          contacts: Array.isArray(contactInfoObj.contacts) 
            ? contactInfoObj.contacts.map((contact: any) => ({
                id: typeof contact.id === 'string' ? contact.id : '',
                title: typeof contact.title === 'string' ? contact.title : '',
                details: typeof contact.details === 'string' ? contact.details : '',
                methods: Array.isArray(contact.methods) 
                  ? contact.methods.map((method: any) => ({
                      type: typeof method.type === 'string' && 
                            ['telephone', 'email', 'sms', 'web'].includes(method.type) 
                        ? method.type as ContactMethod['type'] 
                        : 'telephone',
                      value: typeof method.value === 'string' ? method.value : '',
                      linkUrl: typeof method.linkUrl === 'string' ? method.linkUrl : undefined
                    }))
                  : []
              }))
            : []
        };
      }
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    error
  };
};
