
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
    // Common fields
    endpoint?: string;
    apiKey?: string;
    pcc?: string;
    email?: string;
    // Sabre fields
    pccList: string;
    queueNumber: string;
    sabreQueueAssignment: string;
    fnbtsEntry: string;
    // Travelport fields
    tmcPccList: string;
    tripscapeGwsQueue: string;
    manticPointPcc: string;
    manticPointQueue: string;
  };
  selectedTripTiles: string[];
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: File | null;
    logoUrl?: string;
  };
  contactInfo: {
    blurb: string;
    contacts: Contact[];
  };
  alertCountries: string[];
  tripBriefsEnabled?: boolean;
  alertEmail?: string;
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
    fnbtsEntry: '',
    tmcPccList: '',
    tripscapeGwsQueue: '',
    manticPointPcc: 'RI7', // Default value for Travelport
    manticPointQueue: ''
  },
  selectedTripTiles: [],
  branding: {
    primaryColor: '#1EAEDB',
    secondaryColor: '#0FA0CE',
    logo: null,
    logoUrl: undefined
  },
  contactInfo: {
    blurb: 'We are here to help. Please use any of the contact details below.',
    contacts: []
  },
  alertCountries: [],
  tripBriefsEnabled: false,
  alertEmail: ''
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
          if (data.trip_briefs_enabled !== null && data.trip_briefs_enabled !== undefined) {
            newFormData.tripBriefsEnabled = data.trip_briefs_enabled;
          }
          if (data.alert_email) newFormData.alertEmail = data.alert_email;
          
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
                const { data: logoData } = await supabase.storage
                  .from('agency_logos')
                  .createSignedUrl(newFormData.branding.logoUrl, 60 * 60 * 24); // 24 hours expiry
                
                if (logoData && logoData.signedUrl) {
                  newFormData.branding.logoUrl = logoData.signedUrl;
                }
              } catch (logoError) {
                console.error('Error fetching logo:', logoError);
              }
            }
          }
          
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
