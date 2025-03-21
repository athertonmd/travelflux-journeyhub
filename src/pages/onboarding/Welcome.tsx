
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardFooter } from '@/components/ui/card';
import StepIndicator, { Step } from '@/components/onboarding/StepIndicator';
import StepController from '@/components/onboarding/StepController';
import FooterButtons from '@/components/onboarding/FooterButtons';
import { useOnboarding } from '@/hooks/useOnboarding';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { supabase, clearAuthData } from '@/integrations/supabase/client';

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
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading, refreshSession } = useAuth();
  
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
    }, 6000); // Reduced from original 5000ms to make it more responsive
    
    return () => clearTimeout(timeout);
  }, [isLoading, authLoading, retryCount]);

  // Refresh the session
  const handleRefreshSession = async () => {
    try {
      setLoadingTimeoutReached(false);
      setError(null);
      setRetryCount(prev => prev + 1);
      
      console.log('Welcome: Manually refreshing session');
      const refreshedUser = await refreshSession();
      
      if (refreshedUser) {
        toast({
          title: "Connection restored",
          description: "Your session has been refreshed successfully."
        });
      } else {
        setError("Session couldn't be refreshed. Please try logging in again.");
        setLoadingTimeoutReached(true);
      }
    } catch (err) {
      console.error('Welcome: Error refreshing session:', err);
      setError("An error occurred while refreshing your session.");
      setLoadingTimeoutReached(true);
    }
  };

  // Clear all storage data and reload
  const handleClearAndReload = () => {
    try {
      console.log('Welcome: Clearing storage and reloading');
      // Flag to prevent auth state change loops during manual clear
      sessionStorage.setItem('manual-clear-in-progress', 'true');
      
      clearAuthData();
      
      // Redirect to login with cleared=true parameter
      window.location.href = '/login?cleared=true';
    } catch (err) {
      console.error('Welcome: Error clearing storage:', err);
      toast({
        title: "Error",
        description: "Failed to clear storage. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show loading spinner during initial load
  if ((isLoading || authLoading) && !loadingTimeoutReached) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Loading your setup wizard...</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {retryCount > 0 ? `Retry attempt: ${retryCount}` : "This may take a moment..."}
        </p>
      </div>
    );
  }

  // Show timeout error with retry option
  if (loadingTimeoutReached || error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="mb-4 text-amber-500">
          <AlertTriangle size={40} />
        </div>
        <p className="mb-2 text-lg font-semibold">Loading is taking longer than expected...</p>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button 
            onClick={handleRefreshSession} 
            variant="default"
            className="flex items-center gap-2 w-full"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Session
          </Button>
          
          <Button 
            onClick={handleClearAndReload}
            variant="destructive"
            className="w-full"
          >
            Clear Storage & Restart
          </Button>
        </div>
      </div>
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

  // Main onboarding interface
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
