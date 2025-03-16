
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface ContactMethod {
  type: 'telephone' | 'email' | 'sms' | 'web';
  value: string;
  linkUrl?: string;
}

export interface Contact {
  id: string;
  title: string;
  methods: ContactMethod[];
  details: string;
}

export interface OnboardingFormData {
  userName?: string;
  products: {
    mobile: boolean;
    documentDelivery: boolean;
    riskManagement: boolean;
  };
  gdsProvider: string;
  gdsConfig: {
    endpoint: string;
    apiKey: string;
    pcc: string;
    email: string;
    pccList: string;
    queueNumber: string;
    sabreQueueAssignment: string;
    fnbtsEntry: string;
  };
  selectedTripTiles: string[];
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: File | null;
  };
  contactInfo: {
    blurb: string;
    contacts: Contact[];
  };
  alertCountries: string[];
}

export const initialFormData: OnboardingFormData = {
  userName: '',
  products: {
    mobile: false,
    documentDelivery: false,
    riskManagement: false
  },
  gdsProvider: '',
  gdsConfig: {
    endpoint: '',
    apiKey: '',
    pcc: '',
    email: '',
    pccList: '',
    queueNumber: '',
    sabreQueueAssignment: '',
    fnbtsEntry: ''
  },
  selectedTripTiles: [],
  branding: {
    primaryColor: '#1EAEDB',
    secondaryColor: '#0FA0CE',
    logo: null
  },
  contactInfo: {
    blurb: 'We are here to help. Please use any of the contact details below.',
    contacts: []
  },
  alertCountries: []
};

export const useOnboardingForm = (userId: string | undefined) => {
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('agency_configurations')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;

        if (data) {
          const newFormData = { ...formData };
          
          if (data.products) newFormData.products = data.products as OnboardingFormData['products'];
          if (data.gds_provider) newFormData.gdsProvider = data.gds_provider;
          if (data.gds_config) newFormData.gdsConfig = {
            ...initialFormData.gdsConfig,
            ...(data.gds_config as Partial<OnboardingFormData['gdsConfig']>)
          };
          if (data.selected_trip_tiles) newFormData.selectedTripTiles = data.selected_trip_tiles;
          if (data.alert_countries) newFormData.alertCountries = data.alert_countries;
          
          if (data.branding && typeof data.branding === 'object') {
            const brandingData = data.branding as Record<string, unknown>;
            newFormData.branding = {
              ...newFormData.branding,
              primaryColor: typeof brandingData.primaryColor === 'string' ? brandingData.primaryColor : '#1EAEDB',
              secondaryColor: typeof brandingData.secondaryColor === 'string' ? brandingData.secondaryColor : '#0FA0CE'
            };
          }
          
          // Handle contact_info with proper type checking
          if (data.contact_info && typeof data.contact_info === 'object') {
            // Convert from database JSON type to our app type
            if (Array.isArray(data.contact_info)) {
              // Handle unexpected array type by using default values
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
          
          setFormData(newFormData);
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [userId]);

  const updateFormData = (section: keyof OnboardingFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof data === 'function' ? data(prev[section]) : data
    }));
  };

  return {
    formData,
    isLoading,
    setIsLoading,
    updateFormData
  };
};
