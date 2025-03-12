
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { OnboardingFormData, useOnboardingForm } from './useOnboardingForm';
import { useOnboardingSave } from './useOnboardingSave';
import { OnboardingStep, useOnboardingNavigation } from './useOnboardingNavigation';

export type { OnboardingFormData };

export const useOnboarding = () => {
  const { user, isLoading: authLoading, updateSetupStatus } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formLoadAttempted, setFormLoadAttempted] = useState(false);
  
  // Don't try to load form data if we don't have a user yet
  const userId = user?.id;
  
  const {
    formData,
    updateFormData,
    setIsLoading: setFormLoading,
    isLoading: formIsLoading
  } = useOnboardingForm(userId);

  // Set form load attempted after first data load attempt with valid userId
  useEffect(() => {
    if (userId && !formLoadAttempted) {
      setFormLoadAttempted(true);
    }
  }, [userId, formLoadAttempted]);

  // Pre-fill username from email if available
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
  } = useOnboardingSave(userId, (loading) => {
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

  // Combine loading states - ensure we wait for auth and initial form load
  const combinedIsLoading = isLoading || authLoading || (formIsLoading && !formLoadAttempted);

  const handleComplete = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await completeSetup(formData);
      if (success) {
        await updateSetupStatus(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error completing setup:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    currentStep,
    formData,
    isLoading: combinedIsLoading,
    updateFormData,
    handleNext,
    handleBack,
    handleComplete
  };
};
