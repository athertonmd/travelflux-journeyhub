
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
  
  // Check if user is already logged in and redirect
  useEffect(() => {
    console.log('Login page rendered, auth state:', { user, authLoading });
    
    if (user && !authLoading) {
      console.log('User is already authenticated, redirecting:', user);
      
      toast({
        title: "Already signed in",
        description: "You're already logged in, redirecting...",
      });
      
      // Use a short timeout to allow the UI to update before redirect
      setTimeout(() => {
        if (user.setupCompleted) {
          navigate('/dashboard');
        } else {
          navigate('/welcome');
        }
      }, 100);
    }
  }, [user, navigate, authLoading]);
  
  const handleLogin = async (email: string, password: string, remember: boolean) => {
    console.log('Login handler called with:', email);
    
    // Prevent login attempt if already processing
    if (isLoading || authLoading) {
      console.log('Skipping login attempt: already processing');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Call the login function from AuthContext
      const success = await login(email, password);
      console.log('Login result:', success ? 'Success' : 'Failed');
      
      if (!success) {
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
  
  // If initial auth check is in progress (and we're not already trying to log in),
  // show a loading spinner
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
