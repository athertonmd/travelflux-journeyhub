
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginPageContent from '@/components/auth/LoginPageContent';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoginErrorState from '@/components/auth/LoginErrorState';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const { user, logIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [refreshAttemptCount, setRefreshAttemptCount] = useState(0);
  
  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      console.log('Login page: Checking session');
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Session check result:', data.session ? 'logged in' : 'no session');
        
        if (data.session?.user) {
          console.log('User is already logged in');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Session check error:', error);
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set timeout for stuck loading state
    const timeout = setTimeout(() => {
      setLoadingTimeout(true);
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timeout);
  }, []);
  
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
      // Force reload the page instead of just refreshing the session
      window.location.reload();
      return true;
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
      console.log('Login form submitted for:', email);
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
