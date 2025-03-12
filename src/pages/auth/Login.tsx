
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
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('User authenticated, redirecting to:', 
        user.setupCompleted ? '/dashboard' : '/welcome');
      navigate(user.setupCompleted ? '/dashboard' : '/welcome');
    }
  }, [user, navigate]);
  
  const handleLogin = async (email: string, password: string, remember: boolean) => {
    if (isSubmitting) {
      console.log('Already processing login, skipping');
      return false;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Attempting login for:', email);
      
      // Wait for the login to complete
      const success = await login(email, password);
      console.log('Login result:', success);
      
      // Reset submission state regardless of result
      setIsSubmitting(false);
      
      return success;
    } catch (error) {
      console.error('Login handler error:', error);
      setIsSubmitting(false);
      return false;
    }
  };
  
  // Only show loading spinner when actively submitting a login
  // and not authenticated yet
  if (isSubmitting && !user) {
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
              isLoading={isSubmitting}
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
