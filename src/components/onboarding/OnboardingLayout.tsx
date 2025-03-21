
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import StepIndicator, { Step } from '@/components/onboarding/StepIndicator';
import StepController from '@/components/onboarding/StepController';
import FooterButtons from '@/components/onboarding/FooterButtons';
import { OnboardingFormData } from '@/types/onboarding.types';

interface OnboardingLayoutProps {
  steps: Step[];
  currentStep: string;
  formData: OnboardingFormData;
  isLoading: boolean;
  updateFormData: (key: keyof OnboardingFormData, value: any) => void;
  handleBack: (steps: Step[]) => void;
  handleNext: (steps: Step[]) => Promise<void>;
  handleComplete: () => Promise<void>;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  steps,
  currentStep,
  formData,
  isLoading,
  updateFormData,
  handleBack,
  handleNext,
  handleComplete
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-semibold">Tripscape Setup</h1>
        </div>
      </header>
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl font-semibold mb-2">Agency Setup</CardTitle>
              <StepIndicator steps={steps} currentStep={currentStep} className="pt-4" />
            </CardHeader>

            <CardContent>
              <StepController 
                currentStep={currentStep}
                formData={formData}
                updateFormData={updateFormData}
              />
            </CardContent>

            <CardFooter>
              <FooterButtons 
                currentStep={currentStep}
                isLoading={isLoading}
                steps={steps}
                handleBack={handleBack}
                handleNext={handleNext}
                handleComplete={handleComplete}
              />
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
