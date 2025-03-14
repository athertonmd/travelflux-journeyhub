
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
  const { user, logIn, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Set timeout for stuck loading state
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (isLoading) {
        console.log('Loading timeout triggered, showing error state');
        setHasError(true);
      }
    }, 5000); // 5 seconds timeout
    
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isLoading]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('User logged in, redirecting to dashboard');
      const destination = user.setupCompleted ? '/dashboard' : '/welcome';
      navigate(destination);
    }
  }, [user, navigate]);

  // Handle page reload
  const handleReloadPage = () => {
    window.location.reload();
  };

  // Show error state if loading takes too long
  if (hasError || (isLoading && isLoading)) {
    return (
      <LoginErrorState
        isRefreshing={false}
        refreshAttemptCount={1}
        authStuck={hasError}
        onRefreshSession={async () => false}
        onReloadPage={handleReloadPage}
      />
    );
  }

  // Show loading spinner only during initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size={16} />
        <p className="mt-4 text-muted-foreground">Checking login status...</p>
      </div>
    );
  }

  const handleSubmit = async (email: string, password: string, remember: boolean) => {
    try {
      console.log('Login form submitted');
      setIsSubmitting(true);
      
      const success = await logIn(email, password);
      console.log('Login result:', success ? 'success' : 'failed');
      
      if (!success) {
        setIsSubmitting(false);
      }
      return success;
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
