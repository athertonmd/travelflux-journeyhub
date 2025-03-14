
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginPageContent from '@/components/auth/LoginPageContent';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoginErrorState from '@/components/auth/LoginErrorState';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { user, logIn, isLoading, refreshSession, authError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [showingErrorPage, setShowingErrorPage] = useState(false);
  
  console.log('Login page: Current state', { 
    user, 
    isLoading, 
    hasError, 
    authError,
    showingErrorPage
  });
  
  // Reset error state when component mounts
  useEffect(() => {
    setHasError(false);
    setShowingErrorPage(false);
  }, []);
  
  // Set timeout for stuck loading state
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (isLoading && !hasError && !showingErrorPage && !isSubmitting) {
      console.log('Setting timeout for loading state');
      timeoutId = window.setTimeout(() => {
        console.log('Loading timeout triggered, showing error state');
        setHasError(true);
      }, 10000); // 10 seconds timeout
    }
    
    return () => {
      if (timeoutId) {
        console.log('Clearing timeout');
        window.clearTimeout(timeoutId);
      }
    };
  }, [isLoading, hasError, showingErrorPage, isSubmitting]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user && !hasError && !showingErrorPage) {
      console.log('User logged in, redirecting to dashboard');
      const destination = user.setupCompleted ? '/dashboard' : '/welcome';
      navigate(destination);
    }
  }, [user, navigate, hasError, showingErrorPage]);

  // Handle page reload
  const handleReloadPage = () => {
    window.location.reload();
  };

  // Handle session refresh
  const handleRefreshSession = async () => {
    setRefreshAttempts(prev => prev + 1);
    setHasError(false);
    setShowingErrorPage(true);
    
    try {
      const refreshedUser = await refreshSession();
      if (refreshedUser) {
        toast({
          title: "Session restored",
          description: "Your session has been successfully restored.",
        });
        setShowingErrorPage(false);
        return true;
      } else {
        setHasError(true);
        return false;
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      setHasError(true);
      return false;
    } finally {
      setShowingErrorPage(false);
    }
  };

  // Show error state if loading takes too long or there's an auth error
  if ((hasError || authError) && !isSubmitting) {
    return (
      <LoginErrorState
        isRefreshing={isLoading}
        refreshAttemptCount={refreshAttempts}
        authStuck={hasError}
        onRefreshSession={handleRefreshSession}
        onReloadPage={handleReloadPage}
      />
    );
  }

  // Show loading spinner only during initial auth check
  if (isLoading && !isSubmitting && !showingErrorPage) {
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
      setHasError(false);
      
      const success = await logIn(email, password);
      console.log('Login result:', success ? 'success' : 'failed');
      
      if (!success) {
        setIsSubmitting(false);
      }
      return success;
    } catch (error: any) {
      console.error('Login error in handleSubmit:', error.message);
      setIsSubmitting(false);
      return false;
    }
  };

  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoginPageContent 
          isLoading={isSubmitting || isLoading}
          onLogin={handleSubmit}
        />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Login;
