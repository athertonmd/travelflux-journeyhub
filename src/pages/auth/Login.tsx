
import React, { useEffect } from 'react';
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
  
  console.log('Login page: Current state', { 
    user, 
    isLoading, 
    sessionChecked
  });
  
  // Clear auth data on initial load
  useEffect(() => {
    clearAuthData();
  }, []);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('User logged in, redirecting to dashboard');
      const destination = user.setupCompleted ? '/dashboard' : '/welcome';
      navigate(destination);
    }
  }, [user, navigate]);

  // Handle successful login
  const handleLoginSuccess = () => {
    // Navigation happens automatically via the user effect above
  };

  // Show loading spinner only during initial auth check
  if (isLoading && !sessionChecked) {
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
