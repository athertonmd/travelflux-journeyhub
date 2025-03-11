
import { useState } from 'react';
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
  const [currentStep, setCurrentStep] = useState('welcome');

  const handleNext = async (steps: OnboardingStep[]) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    // Save data at specific steps
    if (['products', 'gds', 'config', 'trips', 'branding'].includes(currentStep)) {
      await saveConfiguration(formData);
    }
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = (steps: OnboardingStep[]) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  return {
    currentStep,
    handleNext,
    handleBack,
    navigateToDashboard
  };
};
