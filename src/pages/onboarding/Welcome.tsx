
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardFooter } from '@/components/ui/card';
import StepIndicator, { Step } from '@/components/onboarding/StepIndicator';
import StepController from '@/components/onboarding/StepController';
import FooterButtons from '@/components/onboarding/FooterButtons';
import { useOnboarding } from '@/hooks/useOnboarding';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

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
  const {
    user,
    currentStep,
    formData,
    isLoading,
    updateFormData,
    handleNext,
    handleBack,
    handleComplete
  } = useOnboarding();

  console.log('Welcome page rendering with state:', { 
    user: user ? { id: user.id, setupCompleted: user.setupCompleted } : null, 
    isLoading, 
    initialAuthCheck,
    currentStep 
  });

  // If no user and not loading, redirect to login
  useEffect(() => {
    // Only redirect after initial auth check is complete
    if (!isLoading) {
      setInitialAuthCheck(true);
      
      if (!user) {
        console.log('Welcome: No user detected after loading, redirecting to login');
        navigate('/login');
      } else if (user.setupCompleted) {
        console.log('Welcome: User setup already completed, redirecting to dashboard');
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate]);

  // If loading or no user, show loading spinner
  if (isLoading || !initialAuthCheck) {
    return <LoadingSpinner />;
  }

  // If auth check is complete and no user, redirect will happen via the useEffect
  if (!user) {
    return <LoadingSpinner />;
  }

  const onComplete = async () => {
    const success = await handleComplete();
    if (success) {
      navigate('/dashboard');
    }
  };

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
