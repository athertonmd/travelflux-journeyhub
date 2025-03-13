
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardFooter } from '@/components/ui/card';
import StepIndicator, { Step } from '@/components/onboarding/StepIndicator';
import StepController from '@/components/onboarding/StepController';
import FooterButtons from '@/components/onboarding/FooterButtons';
import { useOnboarding } from '@/hooks/useOnboarding';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const steps: Step[] = [
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
  
  // Initialize the onboarding hook
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

  // If no user and not loading, redirect to login
  useEffect(() => {
    // Only redirect after initial auth check is complete
    if (!authLoading && !initialAuthCheck) {
      setInitialAuthCheck(true);
      
      if (!user) {
        navigate('/login');
      } else if (user.setupCompleted) {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, navigate, initialAuthCheck]);

  // Shorter timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading || authLoading) {
        setLoadingTimeoutReached(true);
      }
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timeout);
  }, [isLoading, authLoading]);

  // If loading after timeout, show a retry button
  if ((isLoading || authLoading) && loadingTimeoutReached) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="mb-4 text-muted-foreground">Loading is taking longer than expected...</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="default"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Page
        </Button>
      </div>
    );
  }

  // If loading and not timed out, show loading spinner
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Loading your setup wizard...</p>
      </div>
    );
  }

  // If no user, redirect will happen via the useEffect
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const onComplete = async () => {
    const success = await handleComplete();
    if (success) {
      navigate('/dashboard');
    }
  };

  // Only render the main content if we have a user and setup is not completed
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-semibold">Tripscape Setup</h1>
        </div>
      </header>
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <StepIndicator steps={steps} currentStep={currentStep} />

          <Card className="max-w-4xl mx-auto">
            <StepController 
              currentStep={currentStep}
              formData={formData}
              updateFormData={updateFormData}
            />

            <CardFooter>
              <FooterButtons 
                currentStep={currentStep}
                isLoading={isLoading}
                steps={steps}
                handleBack={handleBack}
                handleNext={handleNext}
                handleComplete={onComplete}
              />
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
