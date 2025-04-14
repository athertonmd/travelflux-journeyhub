
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import { Button } from '@/components/ui/button';

const LoginInitialLoading: React.FC = () => {
  const [showRetry, setShowRetry] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  
  // Show retry button after a delay and track loading time
  useEffect(() => {
    const startTime = Date.now();
    
    const showRetryTimer = setTimeout(() => {
      setShowRetry(true);
    }, 5000); // 5 seconds timeout
    
    // Update loading time every second
    const loadingTimer = setInterval(() => {
      setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => {
      clearTimeout(showRetryTimer);
      clearInterval(loadingTimer);
    };
  }, []);
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size={16} />
      <p className="mt-4 text-muted-foreground">Checking login status...</p>
      <p className="mt-2 text-xs text-muted-foreground">Time elapsed: {loadingTime}s</p>
      
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
