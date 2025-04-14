
import React from 'react';
import { Button } from '@/components/ui/button';
import { Step } from './StepIndicator';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';

interface FooterButtonsProps {
  currentStep: string;
  isLoading: boolean;
  steps: Step[];
  handleBack: (steps: Step[]) => void;
  handleNext: (steps: Step[]) => Promise<void>;
  handleComplete: () => Promise<boolean>;
}

const FooterButtons: React.FC<FooterButtonsProps> = ({
  currentStep,
  isLoading,
  steps,
  handleBack,
  handleNext,
  handleComplete
}) => {
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;
  
  return (
    <div className="w-full flex justify-between">
      <Button
        variant="outline"
        onClick={() => handleBack(steps)}
        disabled={isFirstStep || isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      {isLastStep ? (
        <Button 
          onClick={handleComplete} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Complete Setup
            </>
          )}
        </Button>
      ) : (
        <Button 
          onClick={() => handleNext(steps)} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default FooterButtons;
