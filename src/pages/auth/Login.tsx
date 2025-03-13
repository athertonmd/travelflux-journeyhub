
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginPageContent from '@/components/auth/LoginPageContent';
import { useLoginPage } from '@/hooks/auth/useLoginPage';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';

const Login = () => {
  const {
    user,
    authLoading,
    isSubmitting,
    loginAttemptFailed,
    handleSubmit
  } = useLoginPage();
  
  // Show loading spinner while authentication is in progress
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If user is already logged in, redirect will be handled by useLoginPage

  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoginPageContent 
          isLoading={isSubmitting}
          onLogin={async (email, password, remember) => {
            return await handleSubmit(email, password);
          }}
        />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Login;
