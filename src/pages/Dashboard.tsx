
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, isLoading: isAuthLoading, logOut } = useAuth();
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
    let redirectTimeout: number | undefined;
    
    if (!isAuthLoading && !user && isMounted) {
      // Add small delay to prevent immediate redirect during auth state changes
      redirectTimeout = window.setTimeout(() => {
        if (isMounted) {
          navigate('/login');
        }
      }, 500);
    } else if (user && !user.setupCompleted && isMounted) {
      redirectTimeout = window.setTimeout(() => {
        if (isMounted) {
          navigate('/welcome');
        }
      }, 500);
    }
    
    return () => {
      if (redirectTimeout) {
        window.clearTimeout(redirectTimeout);
      }
    };
  }, [user, isAuthLoading, navigate, isMounted]);

  // Force timeout to prevent infinite loading
  useEffect(() => {
    let timeout: number | undefined;
    
    if (isAuthLoading && !loadingTimeoutReached && isMounted) {
      timeout = window.setTimeout(() => {
        if (isMounted) {
          setLoadingTimeoutReached(true);
        }
      }, 5000); // 5 seconds timeout
    }
    
    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [isAuthLoading, loadingTimeoutReached, isMounted]);

  // Handle manual refresh 
  const handleRefreshConnection = async () => {
    if (!isMounted) return;
    
    setIsRecovering(true);
    
    try {
      // Just reload the page as a simple solution
      window.location.reload();
    } catch (error) {
      console.error("Error during page refresh:", error);
      if (isMounted) {
        toast({
          title: "Connection error",
          description: "An error occurred while trying to refresh the page.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted) {
        setIsRecovering(false);
      }
    }
  };

  // If auth is still loading after timeout, show a retry button
  if (isAuthLoading && loadingTimeoutReached) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="mb-4 text-muted-foreground">Loading is taking longer than expected...</p>
        <Button 
          onClick={handleRefreshConnection} 
          variant="default"
          className="flex items-center gap-2 mb-4"
          disabled={isRecovering}
        >
          <RefreshCw className={`h-4 w-4 ${isRecovering ? 'animate-spin' : ''}`} />
          {isRecovering ? "Refreshing..." : "Refresh Page"}
        </Button>
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
