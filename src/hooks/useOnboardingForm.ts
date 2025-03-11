
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface OnboardingFormData {
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
  };
  selectedTripTiles: string[];
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: File | null;
  };
}

export const initialFormData: OnboardingFormData = {
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
    email: ''
  },
  selectedTripTiles: [],
  branding: {
    primaryColor: '#1EAEDB',
    secondaryColor: '#0FA0CE',
    logo: null
  }
};

export const useOnboardingForm = (userId: string | undefined) => {
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing configuration if available
  useEffect(() => {
    const fetchConfig = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('agency_configurations')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;

        if (data) {
          // Only update fields that exist in the database
          const newFormData = { ...formData };
          
          if (data.products) newFormData.products = data.products as OnboardingFormData['products'];
          if (data.gds_provider) newFormData.gdsProvider = data.gds_provider;
          if (data.gds_config) newFormData.gdsConfig = data.gds_config as OnboardingFormData['gdsConfig'];
          if (data.selected_trip_tiles) newFormData.selectedTripTiles = data.selected_trip_tiles;
          if (data.branding && typeof data.branding === 'object') {
            const brandingData = data.branding as Record<string, unknown>;
            newFormData.branding = {
              ...newFormData.branding,
              primaryColor: typeof brandingData.primaryColor === 'string' ? brandingData.primaryColor : '#1EAEDB',
              secondaryColor: typeof brandingData.secondaryColor === 'string' ? brandingData.secondaryColor : '#0FA0CE'
            };
          }
          
          setFormData(newFormData);
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
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
