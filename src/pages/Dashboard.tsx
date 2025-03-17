
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardErrorState from '@/components/dashboard/DashboardErrorState';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import { useDashboardState } from '@/hooks/dashboard/useDashboardState';

const Dashboard = () => {
  const {
    user,
    isAuthLoading,
    sessionChecked,
    loadingTimeoutReached,
    isRecovering,
    sessionCheckAttempts,
    timeSinceMount,
    handleRefreshConnection,
    handleClearAndReload,
  } = useDashboardState();

  // If auth is still loading after timeout, show a retry button
  if ((isAuthLoading && loadingTimeoutReached) || (sessionChecked === false && loadingTimeoutReached)) {
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

  // Handle initial loading state better - show loading for less time
  if (isAuthLoading) {
    return (
      <DashboardLoadingState
        timeSinceMount={timeSinceMount}
        sessionCheckAttempts={sessionCheckAttempts}
        onClearAndReload={handleClearAndReload}
      />
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
