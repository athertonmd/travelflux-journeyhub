
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { toast } from '@/hooks/use-toast';
import ResetSessionButton from '@/components/auth/ResetSessionButton';

const Dashboard = () => {
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
      if (isMounted && isAuthLoading && timeSinceMount > 10) {
        console.log('Dashboard: Force redirect to login after timeout');
        navigate('/login?error=timeout');
      }
    }, 12000);
    
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
  const handleRefreshConnection = async () => {
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
      navigate('/login?error=refresh_failed');
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
  };

  // Clear all storage data and reload
  const handleClearAndReload = () => {
    try {
      console.log('Dashboard: Clearing storage and reloading');
      // Flag to prevent auth state change loops during manual clear
      sessionStorage.setItem('manual-clear-in-progress', 'true');
      
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login with cleared=true parameter to indicate storage was cleared
      window.location.href = '/login?cleared=true';
    } catch (error) {
      console.error('Dashboard: Clear storage error:', error);
      toast({
        title: "Error",
        description: "Failed to clear storage. Please try again.",
        variant: "destructive",
      });
    }
  };

  // If auth is still loading after timeout, show a retry button
  if ((isAuthLoading && loadingTimeoutReached) || (sessionChecked === false && loadingTimeoutReached)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-lg font-semibold mb-2">Loading is taking longer than expected</p>
        <p className="mb-4 text-muted-foreground">
          {sessionChecked ? 'Your session is verified but we\'re having trouble loading your data.' 
                          : 'We\'re having trouble verifying your session.'}
        </p>
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button 
            onClick={handleRefreshConnection} 
            variant="default"
            className="flex items-center gap-2"
            disabled={isRecovering}
          >
            <RefreshCw className={`h-4 w-4 ${isRecovering ? 'animate-spin' : ''}`} />
            {isRecovering ? "Refreshing..." : "Refresh Session"}
          </Button>
          
          <ResetSessionButton 
            isLoading={isRecovering}
            onReset={handleClearAndReload}
            variant="destructive"
            label="Clear Storage & Reload"
            className="w-full"
          />
          
          <div className="mt-4 text-xs text-muted-foreground text-center">
            <p>If you continue to experience issues, please contact support.</p>
            <p className="mt-1">Session checked: {sessionChecked ? 'Yes' : 'No'} | Load attempts: {sessionCheckAttempts}</p>
            <p className="mt-1">Time since page load: {timeSinceMount} seconds</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle initial loading state better - show loading for less time
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner size={16} />
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {timeSinceMount > 5 ? 
            "This is taking longer than expected. Please wait..." : 
            "(This may take a moment)"}
        </p>
        {sessionCheckAttempts > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">Session check attempts: {sessionCheckAttempts}</p>
        )}
        {timeSinceMount > 8 && (
          <Button
            onClick={handleClearAndReload}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            Restart Login Process
          </Button>
        )}
      </div>
    );
  }

  // If user is properly loaded, render the dashboard
  if (user) {
    console.log('Dashboard: Rendering dashboard for user', user.email);
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader pageTitle="Dashboard" />

        <main className="container mx-auto py-8 px-4">
          <DashboardMetrics />
          <DashboardContent />
        </main>
      </div>
    );
  }

  // If no user and not loading, show redirecting message
  console.log('Dashboard: No user found, showing redirect message');
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to login...</p>
    </div>
  );
};

export default Dashboard;
