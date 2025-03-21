
import React from 'react';
import { cn } from '@/lib/utils';

// Export the Step interface so it can be imported by other components
export interface Step {
  id: string;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  steps, 
  currentStep,
  className
}) => {
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className={cn("flex w-full items-center justify-between", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <div key={step.id} className="flex flex-col items-center">
            <div 
              className={cn(
                "rounded-full h-10 w-10 flex items-center justify-center mb-2",
                isCompleted ? "bg-primary text-white" : 
                isCurrent ? "bg-primary-foreground border-2 border-primary text-primary" : 
                "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <span className="text-sm">✓</span>
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </div>
            <span 
              className={cn(
                "text-xs text-center",
                isCurrent ? "font-semibold text-primary" : "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
