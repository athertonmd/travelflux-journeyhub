
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  
  // This effect handles redirection when user auth state changes
  useEffect(() => {
    if (user && !authLoading) {
      console.log('User is authenticated, redirecting to:', 
        user.setupCompleted ? '/dashboard' : '/welcome');
      
      toast({
        title: "Login successful",
        description: "Redirecting you to dashboard...",
      });
      
      // Small delay before redirect to ensure toast is shown
      setTimeout(() => {
        navigate(user.setupCompleted ? '/dashboard' : '/welcome');
      }, 300);
    }
  }, [user, navigate, authLoading]);
  
  // Safety timeout to prevent infinite loading
  useEffect(() => {
    if (!isLoading) return;
    
    const safetyTimeout = setTimeout(() => {
      console.log('Login safety timeout triggered - resetting loading state');
      setIsLoading(false);
      toast({
        title: "Login taking too long",
        description: "Please try again",
        variant: "destructive",
      });
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(safetyTimeout);
  }, [isLoading]);
  
  const handleLogin = async (email: string, password: string, remember: boolean) => {
    if (isLoading || authLoading) {
      console.log('Skipping login attempt: already processing');
      return false;
    }
    
    try {
      setIsLoading(true);
      console.log('Form submitted, attempting login...');
      
      return await login(email, password);
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
  
  if (isLoading || authLoading) {
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
