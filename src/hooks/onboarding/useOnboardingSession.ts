
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { clearAuthData } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useOnboardingSession = () => {
  const { refreshSession } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Handle session refresh with better error handling
  const handleRefreshSession = useCallback(async (): Promise<boolean> => {
    setRetryCount(prev => prev + 1);
    setError(null);
    
    try {
      console.log('Onboarding: Refreshing session');
      const user = await refreshSession();
      
      if (user) {
        console.log('Onboarding: Session refreshed successfully');
        return true;
      }
      
      console.log('Onboarding: Session refresh failed');
      setError('Unable to refresh your session. Please try clearing storage.');
      return false;
    } catch (err) {
      console.error('Onboarding: Error refreshing session:', err);
      setError(err instanceof Error ? err.message : 'Unknown error during session refresh');
      return false;
    }
  }, [refreshSession]);

  // Handle clearing storage and reloading
  const handleClearAndReload = useCallback(() => {
    console.log('Onboarding: Clearing auth data and reloading');
    
    // Show toast to inform user
    toast({
      title: "Storage cleared",
      description: "Auth data has been reset. The page will now reload.",
    });
    
    // Set a flag to prevent loops during reload
    sessionStorage.setItem('manual-clear-in-progress', 'true');
    
    // Clear auth data and reload
    clearAuthData();
    
    // Add a short delay before reload
    setTimeout(() => {
      window.location.href = '/login?cleared=true';
    }, 500);
  }, []);

  return {
    retryCount,
    error,
    setError,
    handleRefreshSession,
    handleClearAndReload
  };
};
