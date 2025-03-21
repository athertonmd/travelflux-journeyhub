
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useOnboardingForm } from './onboarding/useOnboardingForm';
import { OnboardingFormData } from '@/types/onboarding.types';
import { useOnboardingSave } from './useOnboardingSave';
import { OnboardingStep, useOnboardingNavigation } from './useOnboardingNavigation';
import { toast } from '@/hooks/use-toast';

export type { OnboardingFormData };

export const useOnboarding = () => {
  const { user, isLoading: authLoading, updateSetupStatus } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Don't try to load form data if we don't have a user yet
  const userId = user?.id;
  
  const {
    formData,
    updateFormData,
    setIsLoading: setFormLoading,
    isLoading: formIsLoading,
    error: formError
  } = useOnboardingForm(userId);

  // Mark auth check as complete once authLoading is done
  useEffect(() => {
    if (!authLoading && !authCheckComplete) {
      console.log('Onboarding: Auth check complete, user:', !!user);
      setAuthCheckComplete(true);
    }
  }, [authLoading, authCheckComplete]);

  // Pre-fill username from email if available
  useEffect(() => {
    if (user && user.email && !formData.userName) {
      console.log('Onboarding: Pre-filling username from email');
      const userName = user.email.split('@')[0];
      const formattedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);
      updateFormData('userName', formattedUserName);
    }
  }, [user, formData.userName, updateFormData]);

  // Handle form error
  useEffect(() => {
    if (formError) {
      console.error('Onboarding: Form data error:', formError);
      setError(formError);
      toast({
        title: "Data Loading Error",
        description: formError,
        variant: "destructive"
      });
    }
  }, [formError]);

  const {
    saveConfiguration,
    completeSetup
  } = useOnboardingSave(userId, (loading) => {
    setIsLoading(loading);
    setFormLoading(loading);
  });

  // Define saveConfiguration callback before using it in useOnboardingNavigation
  const saveConfigCallback = useCallback(async (data: OnboardingFormData) => {
    setIsLoading(true);
    setFormLoading(true);
    setError(null);
    
    try {
      console.log('Onboarding: Saving configuration');
      const success = await saveConfiguration(data);
      
      if (!success) {
        console.error('Onboarding: Save configuration failed');
        setError('Failed to save configuration. Please try again.');
      }
      
      return success;
    } catch (err) {
      console.error('Onboarding: Error saving configuration:', err);
      setError(err instanceof Error ? err.message : 'Unknown error saving configuration');
      return false;
    } finally {
      setIsLoading(false);
      setFormLoading(false);
    }
  }, [saveConfiguration, setFormLoading]);

  // Initialize navigation hook with proper dependencies
  const {
    currentStep,
    handleNext,
    handleBack,
  } = useOnboardingNavigation(
    saveConfigCallback,
    formData
  );

  // Combine loading states
  const combinedIsLoading = isLoading || authLoading || formIsLoading;

  const handleComplete = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Onboarding: Completing setup');
      const success = await completeSetup(formData);
      
      if (success) {
        console.log('Onboarding: Setup completed successfully');
        await updateSetupStatus(true);
        toast({
          title: "Setup completed",
          description: "Your agency has been successfully configured."
        });
        return true;
      }
      
      console.error('Onboarding: Setup completion failed');
      setError('Failed to complete setup. Please try again.');
      toast({
        title: "Setup failed",
        description: "There was an error completing the setup process.",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error('Onboarding: Error completing setup:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Setup error",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [formData, completeSetup, updateSetupStatus]);

  return {
    user,
    currentStep,
    formData,
    isLoading: combinedIsLoading,
    error,
    authCheckComplete,
    updateFormData,
    handleNext,
    handleBack,
    handleComplete
  };
};
