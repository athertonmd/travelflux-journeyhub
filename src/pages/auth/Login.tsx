
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoginErrorHandler from '@/components/auth/LoginErrorHandler';
import LoginInitialLoading from '@/components/auth/LoginInitialLoading';
import LoginFormHandler from '@/components/auth/LoginFormHandler';
import { clearAuthData } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading, sessionChecked } = useAuth();
  const [sessionCheckTimeout, setSessionCheckTimeout] = useState(false);
  
  console.log('Login page: Current state', { 
    user, 
    isLoading, 
    sessionChecked
  });
  
  // Handle URL search params for special actions
  useEffect(() => {
    const url = new URL(window.location.href);
    const clearedParam = url.searchParams.get('cleared');
    
    // If this is a load after a manual clear, clean the URL
    if (clearedParam === 'true') {
      console.log('Cleared parameter detected, this is a fresh load after clearing storage');
      // Remove the cleared parameter from URL after a brief delay
      setTimeout(() => {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('cleared');
        cleanUrl.searchParams.delete('t');
        window.history.replaceState({}, document.title, cleanUrl.toString());
      }, 100);
    } else {
      // Only do initial cleanup if not a post-cleared load
      console.log('Login page mounted, doing initial auth cleanup');
      if (sessionStorage.getItem('manual-clear-in-progress') !== 'true') {
        clearAuthData();
      }
    }
  }, []);
  
  // Timeout for session check to prevent infinite loading
  useEffect(() => {
    // If still loading after 8 seconds and session hasn't been checked, 
    // force the form to display anyway
    const timer = setTimeout(() => {
      if (isLoading && !sessionChecked) {
        console.log('Session check timed out, forcing display of login form');
        setSessionCheckTimeout(true);
      }
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [isLoading, sessionChecked]);
  
  // Redirect if already logged in - but only when we have a user
  useEffect(() => {
    if (user) {
      console.log('User logged in, redirecting to dashboard');
      const destination = user.setupCompleted ? '/dashboard' : '/welcome';
      
      // Add a small delay to ensure state is stable before navigation
      setTimeout(() => {
        navigate(destination);
      }, 200);
    }
  }, [user, navigate]);

  // Handle successful login
  const handleLoginSuccess = () => {
    // Navigation happens automatically via the user effect above
  };

  // Show loading spinner only during initial auth check,
  // unless we've timed out waiting for the session check
  if (isLoading && !sessionChecked && !sessionCheckTimeout) {
    return <LoginInitialLoading />;
  }

  return (
    <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center">Something went wrong. Please try reloading the page.</div>}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoginErrorHandler>
          <LoginFormHandler onLoginSuccess={handleLoginSuccess} />
        </LoginErrorHandler>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Login;
