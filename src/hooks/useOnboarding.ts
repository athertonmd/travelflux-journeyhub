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

  // Set the user's name when the component initializes
  useEffect(() => {
    if (user && user.email && !formData.userName) {
      // Extract user name from email (everything before the @)
      const userName = user.email.split('@')[0];
      // Capitalize the first letter for a nicer display
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
    navigateToDashboard
  } = useOnboardingNavigation(
    (data) => saveConfiguration(data),
    formData
  );

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
  }, [user, navigate, isLoading]);

  const handleComplete = async () => {
    const success = await completeSetup(formData, updateSetupStatus);
    if (success) {
      navigateToDashboard();
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
