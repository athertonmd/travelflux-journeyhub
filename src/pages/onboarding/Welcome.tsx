
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ProductSelection from '@/components/onboarding/ProductSelection';
import GdsSelection from '@/components/onboarding/GdsSelection';
import GdsConfigForm from '@/components/onboarding/GdsConfigForm';
import TripTileSelection from '@/components/onboarding/TripTileSelection';
import BrandingConfig from '@/components/onboarding/BrandingConfig';
import StepIndicator, { Step } from '@/components/onboarding/StepIndicator';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import CompleteStep from '@/components/onboarding/CompleteStep';
import { useOnboarding } from '@/hooks/useOnboarding';

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

  // If loading or no user, show loading spinner
  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            {currentStep === 'welcome' && (
              <WelcomeStep userName={user.name || user.email} />
            )}

            {currentStep === 'products' && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">Select Your Products</CardTitle>
                  <CardDescription>
                    Choose which Tripscape products you want to activate for your agency.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductSelection 
                    selected={formData.products} 
                    onUpdate={(products) => updateFormData('products', products)} 
                  />
                </CardContent>
              </>
            )}

            {currentStep === 'gds' && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">Connect Your GDS</CardTitle>
                  <CardDescription>
                    Select the Global Distribution System (GDS) your agency uses.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GdsSelection 
                    selected={formData.gdsProvider} 
                    onSelect={(gds) => updateFormData('gdsProvider', gds)} 
                  />
                </CardContent>
              </>
            )}

            {currentStep === 'config' && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">GDS Configuration</CardTitle>
                  <CardDescription>
                    Please provide the necessary details to connect to your {formData.gdsProvider} account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GdsConfigForm 
                    gdsType={formData.gdsProvider}
                    config={formData.gdsConfig}
                    onUpdate={(config) => updateFormData('gdsConfig', config)}
                  />
                </CardContent>
              </>
            )}

            {currentStep === 'trips' && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">Trip Tiles</CardTitle>
                  <CardDescription>
                    Select up to 4 trip tiles that will appear on your mobile app home screen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TripTileSelection 
                    selected={formData.selectedTripTiles}
                    onUpdate={(tiles) => updateFormData('selectedTripTiles', tiles)}
                  />
                </CardContent>
              </>
            )}

            {currentStep === 'branding' && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">Branding</CardTitle>
                  <CardDescription>
                    Customize the look of your Tripscape experience with your brand colors and logo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BrandingConfig
                    branding={formData.branding}
                    onUpdate={(branding) => updateFormData('branding', branding)}
                  />
                </CardContent>
              </>
            )}

            {currentStep === 'complete' && (
              <CompleteStep 
                products={formData.products}
                gdsProvider={formData.gdsProvider}
                selectedTripTiles={formData.selectedTripTiles}
                branding={formData.branding}
              />
            )}

            <CardFooter className="flex justify-between pt-6">
              {currentStep !== 'welcome' && (
                <Button variant="outline" onClick={() => handleBack(steps)} disabled={isLoading}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              {currentStep === 'welcome' && <div></div>}
              
              {currentStep !== 'complete' ? (
                <Button onClick={() => handleNext(steps)} disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Completing...
                    </span>
                  ) : (
                    <>
                      Go to Dashboard
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
