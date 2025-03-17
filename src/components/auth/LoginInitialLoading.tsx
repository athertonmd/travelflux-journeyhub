
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import { Button } from '@/components/ui/button';

const LoginInitialLoading: React.FC = () => {
  const [showRetry, setShowRetry] = useState(false);
  
  // Show retry button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRetry(true);
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size={16} />
      <p className="mt-4 text-muted-foreground">Checking login status...</p>
      
      {showRetry && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-sm text-amber-600 mb-2">This is taking longer than expected.</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRetry}
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoginInitialLoading;
