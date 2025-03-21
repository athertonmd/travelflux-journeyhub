
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
      <p className="mt-2 text-xs text-muted-foreground">
        {retryCount > 0 ? `Retry attempt: ${retryCount}` : "This may take a moment..."}
      </p>
    </div>
  );
};

export default OnboardingLoading;
