
import { useFormDataFetcher } from './useFormDataFetcher';
import { OnboardingFormData } from '@/types/onboarding.types';
import { initialFormData } from './initialFormData';

export type { OnboardingFormData };
export { initialFormData };

export const useOnboardingForm = (userId: string | undefined) => {
  const {
    formData,
    setFormData,
    isLoading,
    setIsLoading
  } = useFormDataFetcher(userId);

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
