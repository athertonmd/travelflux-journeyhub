
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

export const useOnboarding = () => {
  const { user, updateSetupStatus } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [formData, setFormData] = useState<OnboardingFormData>({
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
  });

  // Fetch existing configuration if available
  useEffect(() => {
    const fetchConfig = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('agency_configurations')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          // Only update fields that exist in the database
          const newFormData = { ...formData };
          
          if (data.products) newFormData.products = data.products as OnboardingFormData['products'];
          if (data.gds_provider) newFormData.gdsProvider = data.gds_provider;
          if (data.gds_config) newFormData.gdsConfig = data.gds_config as OnboardingFormData['gdsConfig'];
          if (data.selected_trip_tiles) newFormData.selectedTripTiles = data.selected_trip_tiles;
          if (data.branding) newFormData.branding = {
            ...newFormData.branding,
            primaryColor: data.branding.primaryColor || '#1EAEDB',
            secondaryColor: data.branding.secondaryColor || '#0FA0CE'
          };
          
          setFormData(newFormData);
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
  }, [user, navigate, isLoading]);

  const updateFormData = (section: keyof OnboardingFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof data === 'function' ? data(prev[section]) : data
    }));
  };

  const saveConfiguration = async () => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      // Prepare data for saving to Supabase
      const configData = {
        products: formData.products,
        gds_provider: formData.gdsProvider,
        gds_config: formData.gdsConfig,
        selected_trip_tiles: formData.selectedTripTiles,
        branding: {
          primaryColor: formData.branding.primaryColor,
          secondaryColor: formData.branding.secondaryColor
        }
      };
      
      // Update the configuration in the database
      const { error } = await supabase
        .from('agency_configurations')
        .update(configData)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your configuration.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (steps: { id: string }[]) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    // Save data at specific steps
    if (['products', 'gds', 'config', 'trips', 'branding'].includes(currentStep)) {
      await saveConfiguration();
    }
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = (steps: { id: string }[]) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // First save all configuration
      const saveResult = await saveConfiguration();
      if (!saveResult) return;
      
      // Then mark setup as completed
      const { error } = await supabase
        .from('agency_configurations')
        .update({ setup_completed: true })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local user state
      await updateSetupStatus(true);
      
      toast({
        title: "Setup Complete!",
        description: "Your account has been successfully configured.",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing setup:', error);
      toast({
        title: "Setup Failed",
        description: "There was an error completing your setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    currentStep,
    formData,
    isLoading,
    updateFormData,
    handleNext,
    handleBack,
    handleComplete
  };
};
