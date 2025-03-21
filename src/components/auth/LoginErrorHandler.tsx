
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { clearAuthData } from '@/integrations/supabase/client';
import LoginErrorState from '@/components/auth/LoginErrorState';

interface LoginErrorHandlerProps {
  children: React.ReactNode;
}

const LoginErrorHandler: React.FC<LoginErrorHandlerProps> = ({ children }) => {
  const { authError, refreshSession, isLoading, sessionChecked } = useAuth();
  const [hasError, setHasError] = useState(false);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [showingErrorPage, setShowingErrorPage] = useState(false);
  const hasCleanedStorage = useRef(false);
  
  // Add a timeout ref to track and clear timeouts
  const loadingTimeoutRef = useRef<number | null>(null);

  // Debug log
  console.log('LoginErrorHandler: Current state', { 
    isLoading, 
    hasError, 
    authError,
    showingErrorPage,
    sessionChecked
  });
  
  // Reset error state when component mounts and perform cleanup
  useEffect(() => {
    setHasError(false);
    setShowingErrorPage(false);
    
    // Only clean auth data on page load once to prevent loops
    if (!hasCleanedStorage.current && !sessionStorage.getItem('manual-clear-in-progress')) {
      console.log('Performing initial auth cleanup');
      clearAuthData();
      hasCleanedStorage.current = true;
    }
    
    // Check if URL contains cleared=true parameter
    if (window.location.href.includes('cleared=true')) {
      console.log('Session was cleared, starting fresh');
      toast({
        title: "Storage cleared",
        description: "Your session data has been reset. Please try logging in again.",
      });
    }
    
    // Clear any stuck sessions on page load
    const clearStuckSessions = async () => {
      if (window.location.href.includes('error=')) {
        console.log('Error detected in URL, clearing session state');
        if (!hasCleanedStorage.current) {
          clearAuthData();
          hasCleanedStorage.current = true;
        }
        setHasError(true);
        
        toast({
          title: "Authentication error",
          description: "We detected an error in your session. Your data has been reset.",
          variant: "destructive"
        });
      }
    };
    
    clearStuckSessions();
    
    return () => {
      // Clear timeout on unmount
      if (loadingTimeoutRef.current) {
        window.clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Set timeout for stuck loading state - reduced timeout for better UX
  useEffect(() => {
    if (loadingTimeoutRef.current) {
      window.clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    if (isLoading && !hasError && !showingErrorPage) {
      console.log('Setting timeout for loading state');
      // Use window.setTimeout to avoid type issues
      loadingTimeoutRef.current = window.setTimeout(() => {
        console.log('Loading timeout triggered, showing error state');
        setHasError(true);
      }, 12000); // Increased timeout to give more time for auth operations
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        console.log('Clearing timeout');
        window.clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [isLoading, hasError, showingErrorPage]);
  
  // Handle page reload
  const handleReloadPage = () => {
    // Set the flag to prevent loops during reload
    sessionStorage.setItem('manual-clear-in-progress', 'true');
    window.location.reload();
  };

  // Handle session refresh
  const handleRefreshSession = async () => {
    setRefreshAttempts(prev => prev + 1);
    setHasError(false);
    setShowingErrorPage(true);
    
    try {
      const refreshedUser = await refreshSession();
      if (refreshedUser) {
        toast({
          title: "Session restored",
          description: "Your session has been successfully restored.",
        });
        setShowingErrorPage(false);
        return true;
      } else {
        setHasError(true);
        toast({
          title: "Session refresh failed",
          description: "We couldn't restore your session. Please try clearing storage.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      setHasError(true);
      return false;
    } finally {
      setShowingErrorPage(false);
    }
  };

  // Show error state if loading takes too long or there's an auth error
  if ((hasError || authError) && !showingErrorPage) {
    return (
      <LoginErrorState
        isRefreshing={isLoading}
        refreshAttemptCount={refreshAttempts}
        authStuck={hasError}
        onRefreshSession={handleRefreshSession}
        onReloadPage={handleReloadPage}
      />
    );
  }

  // Show children (login form) when no errors
  return <>{children}</>;
};

export default LoginErrorHandler;
