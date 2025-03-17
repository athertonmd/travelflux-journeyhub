
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
  const { user, isLoading: isAuthLoading, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [loadingTimeoutReached, setLoadingTimeoutReached] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Set isMounted state for cleanup
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Handle redirects based on auth state
  useEffect(() => {
    const redirectTimeout = window.setTimeout(() => {
      if (!isMounted) return;
      
      if (!isAuthLoading && !user) {
        console.log('Dashboard: No user found, redirecting to login');
        navigate('/login');
      } else if (user && !user.setupCompleted) {
        console.log('Dashboard: User setup not completed, redirecting to welcome');
        navigate('/welcome');
      }
    }, 500);
    
    return () => {
      window.clearTimeout(redirectTimeout);
    };
  }, [user, isAuthLoading, navigate, isMounted]);

  // Force timeout to prevent infinite loading
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (isMounted && isAuthLoading) {
        console.log('Dashboard: Loading timeout reached');
        setLoadingTimeoutReached(true);
      }
    }, 5000); // Reduced from 8 seconds to 5 seconds for better UX
    
    return () => {
      window.clearTimeout(timeout);
    };
  }, [isAuthLoading, isMounted]);

  // Handle manual refresh 
  const handleRefreshConnection = async () => {
    if (!isMounted) return;
    
    setIsRecovering(true);
    
    try {
      // First try to refresh the session
      console.log('Dashboard: Attempting to refresh session');
      const refreshedUser = await refreshSession();
      
      if (refreshedUser) {
        console.log('Dashboard: Session refreshed successfully');
        setIsRecovering(false);
        setLoadingTimeoutReached(false);
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
  if (isAuthLoading && loadingTimeoutReached) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="mb-4 text-muted-foreground">Loading is taking longer than expected...</p>
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
          </div>
        </div>
      </div>
    );
  }

  // If we're still loading auth, show loading spinner with additional context
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner size={16} />
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        <p className="mt-2 text-xs text-muted-foreground">(This may take a moment)</p>
      </div>
    );
  }

  // If no user and not loading, redirect (the useEffect will handle this)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // Now we know we have a user and auth is not loading
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader pageTitle="Dashboard" />

      <main className="container mx-auto py-8 px-4">
        <DashboardMetrics />
        <DashboardContent />
      </main>
    </div>
  );
};

export default Dashboard;
