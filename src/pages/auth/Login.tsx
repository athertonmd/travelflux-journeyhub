
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginPageContent from '@/components/auth/LoginPageContent';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoginErrorState from '@/components/auth/LoginErrorState';

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading, logIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [refreshAttemptCount, setRefreshAttemptCount] = useState(0);
  
  // Set timeout for stuck loading state
  useEffect(() => {
    if (isLoading && !loadingTimeout) {
      const timeout = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 seconds timeout
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, loadingTimeout]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const destination = user.setupCompleted ? '/dashboard' : '/welcome';
      navigate(destination);
    }
  }, [user, navigate]);

  // Handle refresh attempt
  const handleRefreshSession = async () => {
    setIsSubmitting(true);
    setRefreshAttemptCount(prev => prev + 1);
    
    try {
      await logIn('', '', false, true); // Just refresh the session
      setLoadingTimeout(false);
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle page reload
  const handleReloadPage = () => {
    window.location.reload();
  };

  // Show error state if loading takes too long
  if ((isLoading && loadingTimeout) || (refreshAttemptCount > 0 && isLoading)) {
    return (
      <LoginErrorState
        isRefreshing={isSubmitting}
        refreshAttemptCount={refreshAttemptCount}
        authStuck={loadingTimeout}
        onRefreshSession={handleRefreshSession}
        onReloadPage={handleReloadPage}
      />
    );
  }

  // Show loading spinner only during initial auth check, not during form submission
  if (isLoading && !isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const handleSubmit = async (email: string, password: string, remember: boolean) => {
    try {
      setIsSubmitting(true);
      const result = await logIn(email, password);
      if (!result) {
        setIsSubmitting(false);
      }
      return result;
    } catch (error) {
      console.error('Login error in handleSubmit:', error);
      setIsSubmitting(false);
      return false;
    }
  };

  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoginPageContent 
          isLoading={isSubmitting}
          onLogin={handleSubmit}
        />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Login;
