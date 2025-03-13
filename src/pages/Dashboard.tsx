
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCredits } from '@/hooks/useCredits';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardContent from '@/components/dashboard/DashboardContent';
import PurchaseCreditsModal from '@/components/PurchaseCreditsModal';
import { useSessionReset } from '@/hooks/auth/useSessionReset';

const Dashboard = () => {
  console.log('Dashboard component rendering');
  const { user, isLoading: isAuthLoading, refreshSession } = useAuth();
  const navigate = useNavigate();
  const { creditInfo, isLoading: isCreditsLoading, error, purchaseCredits } = useCredits();
  const { resetSessionState } = useSessionReset();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [hasReportedError, setHasReportedError] = useState(false);
  const [loadingTimeoutReached, setLoadingTimeoutReached] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);

  console.log('Dashboard - Auth state:', { user, isAuthLoading });
  console.log('Dashboard - Credits state:', { creditInfo, isCreditsLoading, error });

  // Report any errors loading credits
  useEffect(() => {
    if (error && !hasReportedError) {
      console.error('Dashboard - Credit loading error:', error);
      setHasReportedError(true);
    }
  }, [error, hasReportedError]);

  // Handle redirects based on auth state
  useEffect(() => {
    console.log('Dashboard useEffect - checking auth state');
    if (!isAuthLoading && !user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
    } else if (!isAuthLoading && user && !user.setupCompleted) {
      console.log('Setup not completed, redirecting to welcome');
      navigate('/welcome');
    }
  }, [user, isAuthLoading, navigate]);

  // Force timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAuthLoading) {
        console.log('Auth loading timeout reached, setting timeout state');
        setLoadingTimeoutReached(true);
      }
    }, 8000); // 8 seconds timeout
    
    return () => clearTimeout(timeout);
  }, [isAuthLoading]);

  // Attempt to recover the session automatically
  const handleRefreshConnection = async () => {
    setIsRecovering(true);
    setConnectionRetries(prev => prev + 1);
    
    try {
      // First reset any stale session state
      await resetSessionState();
      
      // Then attempt to refresh the session
      const refreshedUser = await refreshSession();
      
      if (refreshedUser) {
        console.log("Session recovery successful");
        setLoadingTimeoutReached(false);
      } else {
        console.log("Session recovery failed, will redirect to login");
        navigate('/login');
      }
    } catch (error) {
      console.error("Error during session recovery:", error);
    } finally {
      setIsRecovering(false);
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
          <RefreshCw className="h-4 w-4" />
          {isRecovering ? "Recovering Session..." : "Refresh Connection"}
        </Button>
        
        {connectionRetries > 0 && (
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </Button>
        )}
      </div>
    );
  }

  // If we're still loading auth, show loading spinner
  if (isAuthLoading) {
    console.log('Auth is still loading, showing spinner');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  // If no user and not loading, redirect (the useEffect will handle this)
  if (!user) {
    console.log('No user found and not loading, showing placeholder');
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
        <DashboardMetrics 
          creditInfo={creditInfo} 
          isCreditsLoading={isCreditsLoading} 
        />

        <DashboardContent 
          creditInfo={creditInfo}
          isCreditsLoading={isCreditsLoading}
          onPurchaseClick={() => setIsPurchaseModalOpen(true)}
        />

        {creditInfo && (
          <PurchaseCreditsModal
            isOpen={isPurchaseModalOpen}
            onClose={() => setIsPurchaseModalOpen(false)}
            onPurchase={purchaseCredits}
            creditInfo={creditInfo}
            isLoading={isCreditsLoading}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
