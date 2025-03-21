
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import OnboardingLoading from '@/components/onboarding/OnboardingLoading';
import LoadingErrorState from '@/components/onboarding/LoadingErrorState';
import { useOnboardingSession } from '@/hooks/onboarding/useOnboardingSession';

// Define steps for the onboarding process
const steps = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'products', title: 'Products' },
  { id: 'gds', title: 'GDS' },
  { id: 'config', title: 'Configuration' },
  { id: 'trips', title: 'Trip Tiles' },
  { id: 'branding', title: 'Branding' },
  { id: 'complete', title: 'Complete' }
];

const Welcome = () => {
  const navigate = useNavigate();
  const [initialAuthCheck, setInitialAuthCheck] = useState(false);
  const [loadingTimeoutReached, setLoadingTimeoutReached] = useState(false);
  
  const { user, isLoading: authLoading } = useAuth();
  const { 
    retryCount, 
    error, 
    setError, 
    handleRefreshSession, 
    handleClearAndReload 
  } = useOnboardingSession();
  
  const {
    user: onboardingUser,
    currentStep,
    formData,
    isLoading,
    authCheckComplete,
    updateFormData,
    handleNext,
    handleBack,
    handleComplete
  } = useOnboarding();

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!authLoading && !initialAuthCheck) {
      setInitialAuthCheck(true);
      console.log('Welcome: Initial auth check completed', { 
        userExists: !!user,
        setupCompleted: user?.setupCompleted,
        authLoading
      });
      
      if (!user) {
        console.log('Welcome: No user found, redirecting to login');
        navigate('/login');
      } else if (user.setupCompleted) {
        console.log('Welcome: Setup already completed, redirecting to dashboard');
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, navigate, initialAuthCheck]);

  // Handle loading timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading || authLoading) {
        console.log('Welcome: Loading timeout reached after 6 seconds', { 
          isLoading, authLoading, retryCount 
        });
        setLoadingTimeoutReached(true);
      }
    }, 6000); // Show error state after 6 seconds of loading
    
    return () => clearTimeout(timeout);
  }, [isLoading, authLoading, retryCount]);

  // Handle session refresh with error handling
  const handleSessionRefresh = async () => {
    setLoadingTimeoutReached(false);
    const result = await handleRefreshSession();
    if (!result) {
      setLoadingTimeoutReached(true);
    }
  };

  // Handle completion of onboarding
  const onComplete = async () => {
    try {
      const success = await handleComplete();
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Welcome: Error completing setup:', err);
      toast({
        title: "Setup Error",
        description: "There was a problem completing your setup. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show loading spinner during initial load
  if ((isLoading || authLoading) && !loadingTimeoutReached) {
    return <OnboardingLoading retryCount={retryCount} />;
  }

  // Show timeout error with retry option
  if (loadingTimeoutReached || error) {
    return (
      <LoadingErrorState 
        error={error}
        retryCount={retryCount}
        onRefreshSession={handleSessionRefresh}
        onClearAndReload={handleClearAndReload}
      />
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // Main onboarding interface
  return (
    <OnboardingLayout
      steps={steps}
      currentStep={currentStep}
      formData={formData}
      isLoading={isLoading}
      updateFormData={updateFormData}
      handleBack={handleBack}
      handleNext={handleNext}
      handleComplete={onComplete}
    />
  );
};

export default Welcome;
