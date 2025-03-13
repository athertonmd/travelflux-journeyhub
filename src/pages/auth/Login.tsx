
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import LoginErrorState from '@/components/auth/LoginErrorState';
import LoginPageContent from '@/components/auth/LoginPageContent';
import { useLoginPage } from '@/hooks/auth/useLoginPage';

const Login = () => {
  const {
    isSubmitting,
    redirecting,
    authLoading,
    authStuck,
    refreshingSession,
    refreshAttemptCount,
    handleLogin,
    handleRefreshSession
  } = useLoginPage();
  
  console.log('Login page rendering with state:', { 
    isSubmitting, 
    redirecting, 
    authLoading, 
    authStuck,
    refreshingSession 
  });
  
  // Show loading spinner when actively submitting a login or when redirecting
  if (isSubmitting || redirecting) {
    return <LoadingSpinner />;
  }
  
  // If auth is taking too long, show the error state
  if ((authLoading && authStuck) || refreshingSession) {
    return (
      <LoginErrorState 
        isRefreshing={refreshingSession}
        refreshAttemptCount={refreshAttemptCount}
        authStuck={authStuck}
        onRefreshSession={handleRefreshSession}
      />
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <LoginPageContent 
        isLoading={isSubmitting || authLoading}
        onLogin={handleLogin}
      />
      <Footer />
    </div>
  );
};

export default Login;
