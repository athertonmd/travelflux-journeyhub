
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

  // Set isMounted state for cleanup
  useEffect(() => {
    setIsMounted(true);
    console.log('Dashboard mounted, auth state:', { 
      user, 
      isAuthLoading, 
      sessionChecked, 
      loadingTimeout: loadingTimeoutReached 
    });
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Critical debug information on every render
  if (isAuthLoading) {
    console.log('Dashboard rendering in loading state:', { 
      isAuthLoading, 
      sessionChecked, 
      user: !!user, 
      loadingTimeout: loadingTimeoutReached,
      sessionCheckAttempts
    });
  }

  // Handle redirects based on auth state
  useEffect(() => {
    console.log('Dashboard auth state updated:', { 
      user, 
      isAuthLoading, 
      sessionChecked
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
      
      // If refresh fails, reload the page
      console.log('Dashboard: Session refresh failed, reloading page');
      window.location.reload();
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
        <p className="mt-2 text-xs text-muted-foreground">(This may take a moment)</p>
        {sessionCheckAttempts > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">Session check attempts: {sessionCheckAttempts}</p>
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
