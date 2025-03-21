
import { useState, useCallback } from 'react';
import { useFormDataFetcher } from './useFormDataFetcher';
import { OnboardingFormData } from '@/types/onboarding.types';
import { initialFormData } from './initialFormData';

export const useOnboardingForm = (userId: string | undefined) => {
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const { 
    formData, 
    setFormData, 
    isLoading: isFetchLoading, 
    setIsLoading: setIsFetchLoading,
    error: fetchError
  } = useFormDataFetcher(userId);

  const updateFormData = useCallback((key: keyof OnboardingFormData, value: any) => {
    console.log(`OnboardingForm: Updating ${key} with:`, value);
    setFormData(prevState => ({
      ...prevState,
      [key]: value
    }));
  }, [setFormData]);

  const setIsLoading = useCallback((loading: boolean) => {
    setIsLocalLoading(loading);
    setIsFetchLoading(loading);
  }, [setIsFetchLoading]);

  return {
    formData,
    updateFormData,
    isLoading: isLocalLoading || isFetchLoading,
    error: fetchError,
    setIsLoading
  };
};
