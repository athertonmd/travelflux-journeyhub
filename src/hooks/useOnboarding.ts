
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
  const [formLoadAttempted, setFormLoadAttempted] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
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

  // Force refresh session if auth seems stuck
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // If auth is still loading after 5 seconds, try to refresh the session
    if (authLoading) {
      timeout = setTimeout(async () => {
        console.log('Auth loading timeout reached, attempting to refresh session');
        try {
          await refreshSession();
        } catch (error) {
          console.error('Failed to refresh session:', error);
        }
      }, 5000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [authLoading, refreshSession]);

  // Set form load attempted after first data load attempt with valid userId
  useEffect(() => {
    if (userId && !formLoadAttempted) {
      console.log('Setting form load attempted flag for user:', userId);
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
  const combinedIsLoading = isLoading || 
    (authLoading && !authCheckComplete) || 
    (formIsLoading && !formLoadAttempted);

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
    authCheckComplete,
    updateFormData,
    handleNext,
    handleBack,
    handleComplete
  };
};
