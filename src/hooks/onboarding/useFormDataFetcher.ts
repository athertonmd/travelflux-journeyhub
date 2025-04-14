import { useState, useEffect } from 'react';
import { OnboardingFormData } from '@/types/onboarding.types';
import { initialFormData } from './initialFormData';
import { fetchUserConfiguration } from './configurationService';

export const useFormDataFetcher = (userId: string | undefined) => {
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const loadConfiguration = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        setError(null);
        console.log(`FormDataFetcher: Fetching config (attempt ${fetchAttempts + 1})`);
        
        const result = await fetchUserConfiguration(userId);

        if (!isMounted) return;
        
        if (result.error) {
          if (fetchAttempts < 2) {
            console.log(`FormDataFetcher: Retry attempt ${fetchAttempts + 1}`);
            setFetchAttempts(prev => prev + 1);
          } else {
            setError(result.error);
          }
        } else {
          setFormData(result.formData);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadConfiguration();
    
    return () => {
      isMounted = false;
    };
  }, [userId, fetchAttempts]);

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    error
  };
};
