
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

const Dashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
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
        navigate('/login');
      } else if (user && !user.setupCompleted) {
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
        setLoadingTimeoutReached(true);
      }
    }, 8000); // 8 seconds timeout
    
    return () => {
      window.clearTimeout(timeout);
    };
  }, [isAuthLoading, isMounted]);

  // Handle manual refresh 
  const handleRefreshConnection = () => {
    if (!isMounted) return;
    
    setIsRecovering(true);
    
    try {
      // Just reload the page as a simple solution
      window.location.reload();
    } catch (error) {
      if (isMounted) {
        toast({
          title: "Connection error",
          description: "An error occurred while trying to refresh the page.",
          variant: "destructive",
        });
        setIsRecovering(false);
      }
    }
  };

  // Clear all storage data and reload
  const handleClearAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
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
            {isRecovering ? "Refreshing..." : "Refresh Page"}
          </Button>
          
          <Button 
            onClick={handleClearAndReload}
            variant="destructive"
            className="flex items-center gap-2"
          >
            Clear Storage & Reload
          </Button>
        </div>
      </div>
    );
  }

  // If we're still loading auth, show loading spinner
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
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
      <DashboardHeader user={user} />

      <main className="container mx-auto py-8 px-4">
        <DashboardMetrics />
        <DashboardContent />
      </main>
    </div>
  );
};

export default Dashboard;
