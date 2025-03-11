
import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div 
              className={`flex items-center justify-center rounded-full w-10 h-10 
                ${currentStep === step.id 
                  ? 'bg-primary text-white' 
                  : steps.findIndex(s => s.id === currentStep) > index 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-gray-200 text-gray-500'}`}
            >
              {steps.findIndex(s => s.id === currentStep) > index ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`h-1 w-12 
                  ${steps.findIndex(s => s.id === currentStep) > index 
                    ? 'bg-primary/20' 
                    : 'bg-gray-200'}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center mt-2">
        <p className="text-sm font-medium">{steps.find(step => step.id === currentStep)?.title}</p>
      </div>
    </div>
  );
};

export default StepIndicator;
