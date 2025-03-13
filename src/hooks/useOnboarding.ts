
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { OnboardingFormData, useOnboardingForm } from './useOnboardingForm';
import { useOnboardingSave } from './useOnboardingSave';
import { OnboardingStep, useOnboardingNavigation } from './useOnboardingNavigation';
import { toast } from '@/hooks/use-toast';

export type { OnboardingFormData };

export const useOnboarding = () => {
  const { user, isLoading: authLoading, updateSetupStatus, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [authTimeoutExceeded, setAuthTimeoutExceeded] = useState(false);
  
  // Don't try to load form data if we don't have a user yet
  const userId = user?.id;
  
  const {
    formData,
    updateFormData,
    setIsLoading: setFormLoading,
    isLoading: formIsLoading
  } = useOnboardingForm(userId);

  // Mark auth check as complete once authLoading is done
  useEffect(() => {
    if (!authLoading && !authCheckComplete) {
      setAuthCheckComplete(true);
      console.log('Auth check completed. User:', user ? 'authenticated' : 'unauthenticated');
    }
  }, [authLoading, authCheckComplete, user]);

  // Force refresh session if auth seems stuck or takes too long
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Set a shorter timeout to handle potential hangs
    timeout = setTimeout(async () => {
      if (authLoading || (!authCheckComplete && !authTimeoutExceeded)) {
        console.log('Auth timeout reached, attempting to refresh session');
        setAuthTimeoutExceeded(true);
        try {
          await refreshSession();
          // Regardless of result, mark auth check as complete to prevent hanging
          setAuthCheckComplete(true);
        } catch (error) {
          console.error('Failed to refresh session:', error);
          setAuthCheckComplete(true);
        }
      }
    }, 3000); // Reduce timeout to 3 seconds
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [authLoading, refreshSession, authCheckComplete, authTimeoutExceeded]);

  // Pre-fill username from email if available
  useEffect(() => {
    if (user && user.email && !formData.userName) {
      const userName = user.email.split('@')[0];
      const formattedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);
      updateFormData('userName', formattedUserName);
    }
  }, [user, formData.userName, updateFormData]);

  // Define saveConfiguration callback before using it in useOnboardingNavigation
  const saveConfigCallback = useCallback(async (data: OnboardingFormData) => {
    setIsLoading(true);
    setFormLoading(true);
    try {
      const success = await saveConfiguration(data);
      return success;
    } finally {
      setIsLoading(false);
      setFormLoading(false);
    }
  }, []);

  const {
    saveConfiguration,
    completeSetup
  } = useOnboardingSave(userId, (loading) => {
    setIsLoading(loading);
    setFormLoading(loading);
  });

  // Initialize navigation hook with proper dependencies
  const {
    currentStep,
    handleNext,
    handleBack,
  } = useOnboardingNavigation(
    saveConfigCallback,
    formData
  );

  // Combine loading states but prevent infinite loading
  const combinedIsLoading = isLoading || (authLoading && !authTimeoutExceeded) || formIsLoading;

  const handleComplete = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await completeSetup(formData);
      if (success) {
        await updateSetupStatus(true);
        toast({
          title: "Setup completed",
          description: "Your agency has been successfully configured."
        });
        return true;
      }
      toast({
        title: "Setup failed",
        description: "There was an error completing the setup process.",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error('Error completing setup:', error);
      toast({
        title: "Setup error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
    authCheckComplete: authCheckComplete || authTimeoutExceeded, // Consider auth check complete if timeout exceeded
    updateFormData,
    handleNext,
    handleBack,
    handleComplete
  };
};
