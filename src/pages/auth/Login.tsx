
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginPageContent from '@/components/auth/LoginPageContent';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoginErrorState from '@/components/auth/LoginErrorState';
import { toast } from '@/hooks/use-toast';
import { clearAuthData } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const { user, logIn, isLoading, refreshSession, authError, sessionChecked } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [showingErrorPage, setShowingErrorPage] = useState(false);
  
  // Add a timeout ref to track and clear timeouts
  const loadingTimeoutRef = useRef<number | null>(null);
  
  console.log('Login page: Current state', { 
    user, 
    isLoading, 
    hasError, 
    authError,
    showingErrorPage,
    sessionChecked
  });
  
  // Reset error state when component mounts and perform cleanup
  useEffect(() => {
    setHasError(false);
    setShowingErrorPage(false);
    
    // Clean auth data on page load to ensure fresh state
    clearAuthData();
    
    // Check if URL contains cleared=true parameter
    if (window.location.href.includes('cleared=true')) {
      console.log('Session was cleared, starting fresh');
      toast({
        title: "Storage cleared",
        description: "Your session data has been reset. Please try logging in again.",
      });
    }
    
    // Clear any stuck sessions on page load
    const clearStuckSessions = async () => {
      if (window.location.href.includes('error=')) {
        console.log('Error detected in URL, clearing session state');
        clearAuthData();
        setHasError(true);
        
        toast({
          title: "Authentication error",
          description: "We detected an error in your session. Your data has been reset.",
          variant: "destructive"
        });
      }
    };
    
    clearStuckSessions();
    
    return () => {
      // Clear timeout on unmount
      if (loadingTimeoutRef.current) {
        window.clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Set timeout for stuck loading state - reduced timeout for better UX
  useEffect(() => {
    if (loadingTimeoutRef.current) {
      window.clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    if (isLoading && !hasError && !showingErrorPage && !isSubmitting) {
      console.log('Setting timeout for loading state');
      loadingTimeoutRef.current = window.setTimeout(() => {
        console.log('Loading timeout triggered, showing error state');
        setHasError(true);
      }, 4000); // 4 seconds timeout (reduced from 5)
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        console.log('Clearing timeout');
        window.clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
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
        toast({
          title: "Session refresh failed",
          description: "We couldn't restore your session. Please try clearing storage.",
          variant: "destructive"
        });
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
  if ((isLoading && !sessionChecked) && !isSubmitting && !showingErrorPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size={16} />
        <p className="mt-4 text-muted-foreground">Checking login status...</p>
      </div>
    );
  }

  const handleSubmit = async (email: string, password: string, remember: boolean) => {
    try {
      console.log('Login form submitted - ensuring clean auth state');
      setIsSubmitting(true);
      setHasError(false);
      
      // Clear auth data before login attempt
      clearAuthData();
      
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
    <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center">Something went wrong. Please try reloading the page.</div>}>
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
