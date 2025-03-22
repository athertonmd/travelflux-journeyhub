
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { clearAuthData } from '@/integrations/supabase/client';

export const useDashboardState = () => {
  const { user, isLoading: isAuthLoading, refreshSession, sessionChecked } = useAuth();
  const navigate = useNavigate();
  const [loadingTimeoutReached, setLoadingTimeoutReached] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [sessionCheckAttempts, setSessionCheckAttempts] = useState(0);
  const [timeSinceMount, setTimeSinceMount] = useState(0);

  // Set isMounted state for cleanup
  useEffect(() => {
    const mountTime = Date.now();
    setIsMounted(true);
    
    console.log('Dashboard mounted, auth state:', { 
      userExists: !!user, 
      isAuthLoading, 
      sessionChecked
    });
    
    // Track time since mount for debugging
    const timer = setInterval(() => {
      setTimeSinceMount(Math.floor((Date.now() - mountTime) / 1000));
    }, 1000);
    
    return () => {
      setIsMounted(false);
      clearInterval(timer);
    };
  }, []);

  // Force redirection after a reasonable timeout if still loading
  useEffect(() => {
    if (!isMounted) return;
    
    const forceRedirectTimeout = window.setTimeout(() => {
      if (isMounted && isAuthLoading && timeSinceMount > 8) {
        console.log('Dashboard: Force redirect to login after timeout');
        // Set a flag before redirecting
        sessionStorage.setItem('manual-clear-in-progress', 'true');
        // Clear auth data to prevent loops
        clearAuthData();
        // Navigate to login with a timeout indicator
        navigate('/login?error=timeout&t=' + Date.now());
      }
    }, 10000); // Reduced from 12s to 10s
    
    return () => {
      window.clearTimeout(forceRedirectTimeout);
    };
  }, [isAuthLoading, isMounted, navigate, timeSinceMount]);

  // Handle redirects based on auth state
  useEffect(() => {
    console.log('Dashboard auth state updated:', { 
      userExists: !!user, 
      isAuthLoading, 
      sessionChecked,
      timeSinceMount
    });
    
    // Don't redirect if we're still loading
    if (isAuthLoading) {
      return;
    }
    
    const redirectTimeout = window.setTimeout(() => {
      if (!isMounted) return;
      
      if (!user) {
        console.log('Dashboard: No user found, redirecting to login');
        navigate('/login');
      } else if (user && !user.setupCompleted) {
        console.log('Dashboard: User setup not completed, redirecting to welcome');
        navigate('/welcome');
      }
    }, 300);
    
    return () => {
      window.clearTimeout(redirectTimeout);
    };
  }, [user, isAuthLoading, sessionChecked, navigate, isMounted]);

  // Force timeout to prevent infinite loading
  useEffect(() => {
    if (!isMounted) return;
    
    // If we're not checked, the loading state might be frozen
    if (sessionChecked === false && sessionCheckAttempts === 0) {
      console.log('Dashboard: Session not checked yet, will retry if it takes too long');
      
      const timeout = window.setTimeout(() => {
        if (isMounted && isAuthLoading) {
          console.log('Dashboard: Loading timeout reached, session still not checked');
          setLoadingTimeoutReached(true);
          setSessionCheckAttempts(prev => prev + 1);
        }
      }, 3000);
      
      return () => {
        window.clearTimeout(timeout);
      };
    }
    
    // If we're still loading after session check, set another timeout
    if (sessionChecked && isAuthLoading) {
      const loadingTimeout = window.setTimeout(() => {
        if (isMounted && isAuthLoading) {
          console.log('Dashboard: Still loading after session check timeout reached');
          setLoadingTimeoutReached(true);
        }
      }, 2000);
      
      return () => {
        window.clearTimeout(loadingTimeout);
      };
    }
  }, [isAuthLoading, isMounted, sessionChecked, sessionCheckAttempts]);

  // Handle manual refresh 
  const handleRefreshConnection = useCallback(async () => {
    if (!isMounted) return;
    
    setIsRecovering(true);
    setLoadingTimeoutReached(false); // Reset timeout flag
    
    try {
      console.log('Dashboard: Attempting to refresh session');
      const refreshedUser = await refreshSession();
      
      if (refreshedUser) {
        console.log('Dashboard: Session refreshed successfully');
        setIsRecovering(false);
        setSessionCheckAttempts(0);
        toast({
          title: "Connection restored",
          description: "Your session has been refreshed.",
        });
        return;
      }
      
      // If refresh fails, take user to login page
      console.log('Dashboard: Session refresh failed, redirecting to login');
      sessionStorage.setItem('manual-clear-in-progress', 'true');
      // Perform a full clear to ensure no stale data
      clearAuthData();
      // Add timestamp to prevent caching
      navigate('/login?error=refresh_failed&t=' + Date.now());
    } catch (error) {
      console.error('Dashboard: Refresh error:', error);
      if (isMounted) {
        toast({
          title: "Connection error",
          description: "An error occurred while trying to refresh the session.",
          variant: "destructive",
        });
        setIsRecovering(false);
      }
    }
  }, [isMounted, refreshSession, navigate]);

  // Clear all storage data and reload
  const handleClearAndReload = useCallback(() => {
    try {
      console.log('Dashboard: Clearing storage and reloading');
      // Flag to prevent auth state change loops during manual clear
      sessionStorage.setItem('manual-clear-in-progress', 'true');
      
      // Use the enhanced clear function
      clearAuthData();
      
      // Redirect to login with cleared=true parameter to indicate storage was cleared
      // Add timestamp to prevent caching issues
      window.location.href = '/login?cleared=true&t=' + Date.now();
    } catch (error) {
      console.error('Dashboard: Clear storage error:', error);
      toast({
        title: "Error",
        description: "Failed to clear storage. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  return {
    user,
    isAuthLoading,
    sessionChecked,
    loadingTimeoutReached,
    isRecovering,
    isMounted,
    sessionCheckAttempts,
    timeSinceMount,
    handleRefreshConnection,
    handleClearAndReload,
  };
};
