
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Check if user is already logged in and redirect
  useEffect(() => {
    if (user && !isRedirecting && !isLoading) {
      console.log('User is already authenticated, redirecting:', user);
      setIsRedirecting(true);
      
      toast({
        title: "Already signed in",
        description: "You're already logged in, redirecting...",
      });
      
      const redirectTimer = setTimeout(() => {
        if (user.setupCompleted) {
          navigate('/dashboard');
        } else {
          navigate('/welcome');
        }
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, navigate, isRedirecting, isLoading]);
  
  const handleLogin = async (email: string, password: string, remember: boolean) => {
    // Don't attempt login if already loading or redirecting
    if (isLoading || authLoading || isRedirecting) {
      console.log('Skipping login attempt: already processing');
      return false;
    }
    
    setIsLoading(true);
    console.log('Login attempt starting');
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        // Login failed, reset loading state (this is already handled in useLogin)
        setIsLoading(false);
      }
      
      return success;
    } catch (error) {
      console.error('Login handler error:', error);
      toast({
        title: "Login error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };
  
  // If we're already redirecting, show loading spinner
  if (isRedirecting) {
    return <LoadingSpinner />;
  }
  
  // Show loading spinner during initial auth check
  if (authLoading && !isLoading) {
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
              isLoading={isLoading}
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
