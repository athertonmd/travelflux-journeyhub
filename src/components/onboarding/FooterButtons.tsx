
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
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
      <Loader2 className="animate-spin mr-2 h-4 w-4" />
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
