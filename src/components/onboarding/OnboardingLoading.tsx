
import React from 'react';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

interface OnboardingLoadingProps {
  retryCount: number;
}

const OnboardingLoading: React.FC<OnboardingLoadingProps> = ({ retryCount }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner />
      <p className="mt-4 text-muted-foreground">Loading your setup wizard...</p>
      {retryCount > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Retry attempt: {retryCount}
        </p>
      )}
      <p className="mt-4 text-xs text-muted-foreground max-w-md text-center">
        This loads your agency information and configuration settings.
      </p>
    </div>
  );
};

export default OnboardingLoading;
