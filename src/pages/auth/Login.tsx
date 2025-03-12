
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  console.log('Login page rendering with auth state:', { 
    user: user ? { id: user.id, setupCompleted: user.setupCompleted } : null, 
    authLoading, 
    isSubmitting,
    redirecting
  });
  
  // Redirect if user is already logged in
  useEffect(() => {
    // Only redirect if we have a user AND auth loading has finished
    if (user && !authLoading && !redirecting) {
      const destination = user.setupCompleted ? '/dashboard' : '/welcome';
      console.log(`User authenticated (setupCompleted: ${user.setupCompleted}), redirecting to: ${destination}`);
      
      setRedirecting(true);
      
      // Small timeout to avoid race conditions
      setTimeout(() => {
        navigate(destination);
      }, 200);
    }
  }, [user, authLoading, navigate, redirecting]);
  
  const handleLogin = async (email: string, password: string, remember: boolean) => {
    if (isSubmitting) {
      console.log('Already processing login, skipping');
      return false;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Attempting login for:', email);
      
      // Attempt login
      const success = await login(email, password);
      console.log('Login result:', success);
      
      return success;
    } catch (error) {
      console.error('Login handler error:', error);
      return false;
    } finally {
      // Always reset submission state
      setTimeout(() => {
        setIsSubmitting(false);
      }, 300); // Give time for auth state to update
    }
  };
  
  // Show loading spinner when actively submitting a login or when redirecting
  if (isSubmitting || redirecting) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-display text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <LoginForm 
              isLoading={isSubmitting || authLoading}
              onLogin={handleLogin}
            />
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
