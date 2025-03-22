
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import ItineraryTimeline from '@/components/ItineraryTimeline';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import DashboardErrorState from '@/components/dashboard/DashboardErrorState';

const Itineraries = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, refreshSession, sessionChecked } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeSinceMount, setTimeSinceMount] = useState(0);
  const [sessionCheckAttempts, setSessionCheckAttempts] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    // Track time since component mount
    const mountTime = Date.now();
    const timer = setInterval(() => {
      setTimeSinceMount(Math.floor((Date.now() - mountTime) / 1000));
    }, 1000);

    // Set a timeout to stop loading after a reasonable time
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(loadingTimeout);
    };
  }, []);

  // Check authentication state
  useEffect(() => {
    if (!authLoading && user) {
      setIsLoading(false);
    }
  }, [authLoading, user]);

  // Handle manual refresh 
  const handleRefreshConnection = async () => {
    setIsRecovering(true);
    setError(null);
    
    try {
      await refreshSession();
      setSessionCheckAttempts(prev => prev + 1);
      setIsRecovering(false);
    } catch (err) {
      setError('Failed to refresh session');
      setIsRecovering(false);
    }
  };

  // Handle clear storage and reload
  const handleClearAndReload = () => {
    sessionStorage.setItem('manual-clear-in-progress', 'true');
    window.location.href = '/login?cleared=true&t=' + Date.now();
  };

  // If still loading after auth check, show loading state
  if (isLoading || authLoading) {
    return (
      <DashboardLoadingState
        timeSinceMount={timeSinceMount}
        sessionCheckAttempts={sessionCheckAttempts}
        onClearAndReload={handleClearAndReload}
      />
    );
  }

  // If there's an error or loading timeout reached, show error state
  if (error || !sessionChecked || !user) {
    return (
      <DashboardErrorState
        isRecovering={isRecovering}
        sessionChecked={sessionChecked}
        sessionCheckAttempts={sessionCheckAttempts}
        timeSinceMount={timeSinceMount}
        onRefreshConnection={handleRefreshConnection}
      />
    );
  }

  return (
    <DashboardLayout title="Itineraries">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Itineraries</h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefreshConnection}
          disabled={isRecovering}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRecovering ? 'animate-spin' : ''}`} />
          {isRecovering ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      <Card className="p-6">
        <ItineraryTimeline />
      </Card>
    </DashboardLayout>
  );
};

export default Itineraries;
