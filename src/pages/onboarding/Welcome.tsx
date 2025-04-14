import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import OnboardingLoading from '@/components/onboarding/OnboardingLoading';
import LoadingErrorState from '@/components/onboarding/LoadingErrorState';
import { useOnboardingSession } from '@/hooks/onboarding/useOnboardingSession';

const steps = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'products', title: 'Products' },
  { id: 'gds', title: 'GDS' },
  { id: 'trips', title: 'Mobile Settings' },
  { id: 'risk-alerts', title: 'Risk Alerts' },
  { id: 'branding', title: 'Branding' },
  { id: 'complete', title: 'Complete' }
];

const Welcome = () => {
  const navigate = useNavigate();
  const [initialAuthCheck, setInitialAuthCheck] = useState(false);
  const [loadingTimeoutReached, setLoadingTimeoutReached] = useState(false);
  
  const { user, isLoading: authLoading, refreshSession } = useAuth();
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
    error: onboardingError,
    updateFormData,
    handleNext,
    handleBack,
    handleComplete
  } = useOnboarding();

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

  useEffect(() => {
    if (onboardingError) {
      setError(onboardingError);
    }
  }, [onboardingError, setError]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading || authLoading) {
        console.log('Welcome: Loading timeout reached after 5 seconds', { 
          isLoading, authLoading, retryCount 
        });
        setLoadingTimeoutReached(true);
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [isLoading, authLoading, retryCount]);

  const handleSessionRefresh = async () => {
    setLoadingTimeoutReached(false);
    const result = await handleRefreshSession();
    if (!result) {
      setLoadingTimeoutReached(true);
    }
  };

  const onComplete = async (): Promise<boolean> => {
    try {
      console.log('Welcome: Completing setup');
      const success = await handleComplete();
      
      if (success) {
        console.log('Welcome: Setup completed successfully, redirecting to dashboard');
        navigate('/dashboard');
        return true;
      }
      
      console.error('Welcome: Setup completion returned false');
      setError('Failed to complete setup. Please try again.');
      toast({
        title: "Setup Error",
        description: "There was a problem completing your setup. Please try again.",
        variant: "destructive"
      });
      return false;
    } catch (err) {
      console.error('Welcome: Error completing setup:', err);
      setError(err instanceof Error ? err.message : 'Unknown error during completion');
      toast({
        title: "Setup Error",
        description: "There was a problem completing your setup. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  if ((isLoading || authLoading) && !loadingTimeoutReached) {
    return <OnboardingLoading retryCount={retryCount} />;
  }

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

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
