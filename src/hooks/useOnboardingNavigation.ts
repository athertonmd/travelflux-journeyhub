
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingFormData } from './useOnboardingForm';

export interface OnboardingStep {
  id: string;
  title: string;
}

export const useOnboardingNavigation = (
  saveConfiguration: (data: OnboardingFormData) => Promise<boolean>,
  formData: OnboardingFormData
) => {
  const navigate = useNavigate();
  // Initialize state with a proper type annotation to avoid React queue issues
  const [currentStep, setCurrentStep] = useState<string>('welcome');

  // Convert to useCallback to maintain reference stability
  const handleNext = useCallback(async (steps: OnboardingStep[]) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    // Save data at specific steps
    if (['products', 'gds', 'config', 'trips', 'branding'].includes(currentStep)) {
      try {
        await saveConfiguration(formData);
      } catch (error) {
        console.error('Error saving during navigation:', error);
      }
    }
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  }, [currentStep, saveConfiguration, formData]);

  const handleBack = useCallback((steps: OnboardingStep[]) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  }, [currentStep]);

  const navigateToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  return {
    currentStep,
    handleNext,
    handleBack,
    navigateToDashboard
  };
};
