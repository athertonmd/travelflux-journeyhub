
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Step } from '@/components/onboarding/StepIndicator';

interface FooterButtonsProps {
  currentStep: string;
  isLoading: boolean;
  steps: Step[];
  handleBack: (steps: Step[]) => void;
  handleNext: (steps: Step[]) => void;
  handleComplete: () => void;
}

const FooterButtons: React.FC<FooterButtonsProps> = ({
  currentStep,
  isLoading,
  steps,
  handleBack,
  handleNext,
  handleComplete
}) => {
  const LoadingSpinner = () => (
    <span className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {currentStep !== 'complete' ? 'Saving...' : 'Completing...'}
    </span>
  );

  return (
    <div className="flex justify-between pt-6">
      {currentStep !== 'welcome' ? (
        <Button variant="outline" onClick={() => handleBack(steps)} disabled={isLoading}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      ) : (
        <div></div>
      )}
      
      {currentStep !== 'complete' ? (
        <Button onClick={() => handleNext(steps)} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      ) : (
        <Button onClick={handleComplete} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : (
            <>
              Go to Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default FooterButtons;
