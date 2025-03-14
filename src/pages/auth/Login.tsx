
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
  const { user, isLoading: authLoading, logIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [refreshAttemptCount, setRefreshAttemptCount] = useState(0);
  
  // Combined loading state
  const isLoading = authLoading && !isSubmitting;
  
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
      console.log('User logged in, redirecting to dashboard');
      const destination = user.setupCompleted ? '/dashboard' : '/welcome';
      navigate(destination);
    }
  }, [user, navigate]);

  // Handle refresh attempt
  const handleRefreshSession = async () => {
    setIsSubmitting(true);
    setRefreshAttemptCount(prev => prev + 1);
    
    try {
      console.log('Attempting to refresh session');
      // Call logIn with just the refreshOnly flag
      const success = await logIn('', '', true);
      console.log('Session refresh result:', success);
      setLoadingTimeout(false);
      
      if (!success) {
        setIsSubmitting(false);
      }
      
      return success;
    } catch (error) {
      console.error('Error refreshing session:', error);
      setIsSubmitting(false);
      return false;
    }
  };

  // Handle page reload
  const handleReloadPage = () => {
    window.location.reload();
  };

  // Show error state if loading takes too long
  if ((isLoading && loadingTimeout) || (refreshAttemptCount > 0 && authLoading)) {
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
        <LoadingSpinner size={16} />
        <p className="mt-4 text-muted-foreground">Loading your account...</p>
      </div>
    );
  }

  const handleSubmit = async (email: string, password: string, remember: boolean) => {
    try {
      console.log('Login form submitted for:', email);
      setIsSubmitting(true);
      // Note: We're ignoring the remember parameter since it's not used in the current implementation
      const result = await logIn(email, password);
      
      if (!result) {
        console.log('Login failed, resetting submit state');
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
