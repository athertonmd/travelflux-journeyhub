
import React from 'react';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

const LoginInitialLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size={16} />
      <p className="mt-4 text-muted-foreground">Checking login status...</p>
    </div>
  );
};

export default LoginInitialLoading;
