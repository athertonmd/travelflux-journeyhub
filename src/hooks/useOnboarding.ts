
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { OnboardingFormData, useOnboardingForm } from './useOnboardingForm';
import { useOnboardingSave } from './useOnboardingSave';
import { OnboardingStep, useOnboardingNavigation } from './useOnboardingNavigation';

export type { OnboardingFormData };

export const useOnboarding = () => {
  const { user, updateSetupStatus } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    formData,
    updateFormData,
    setIsLoading: setFormLoading
  } = useOnboardingForm(user?.id);

  useEffect(() => {
    if (user && user.email && !formData.userName) {
      const userName = user.email.split('@')[0];
      const formattedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);
      updateFormData('userName', formattedUserName);
    }
  }, [user, formData.userName, updateFormData]);

  const {
    saveConfiguration,
    completeSetup
  } = useOnboardingSave(user?.id, (loading) => {
    setIsLoading(loading);
    setFormLoading(loading);
  });

  const {
    currentStep,
    handleNext,
    handleBack,
  } = useOnboardingNavigation(
    (data) => saveConfiguration(data),
    formData
  );

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
  }, [user, navigate, isLoading]);

  const handleComplete = async (): Promise<boolean> => {
    try {
      const success = await completeSetup(formData);
      if (success) {
        await updateSetupStatus(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error completing setup:', error);
      return false;
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
