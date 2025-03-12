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
    if (user && !authLoading) {
      console.log('User is already authenticated, redirecting to:', 
        user.setupCompleted ? 'dashboard' : 'welcome');
      navigate(user.setupCompleted ? '/dashboard' : '/welcome');
    }
  }, [user, navigate, authLoading]);
  
  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Login safety timeout triggered - resetting loading state');
        setIsLoading(false);
        toast({
          title: "Login taking too long",
          description: "Please try again",
          variant: "destructive"
        });
      }
    }, 8000); // Reduce timeout to 8 seconds for better user experience
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);
  
  const handleLogin = async (email: string, password: string, remember: boolean) => {
    // Prevent login attempt if already processing
    if (isLoading || authLoading) {
      console.log('Skipping login attempt: already processing');
      return false;
    }
    
    try {
      setIsLoading(true);
      const success = await login(email, password);
      
      if (!success) {
        setIsLoading(false);
      }
      // If successful, keep loading state true until redirection happens
      
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
  
  // Show loading spinner when actively loading
  if ((authLoading && !isLoading) || (isLoading && user)) {
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
