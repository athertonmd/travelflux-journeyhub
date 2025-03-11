
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
import { toast } from '@/hooks/use-toast';
import LoginForm from '@/components/auth/LoginForm';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { login, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('User is authenticated, checking setup status:', user);
      if (!user.setupCompleted) {
        navigate('/welcome');
      } else {
        navigate('/');
      }
    } else if (loginAttempted && !isLoading && !authLoading) {
      // Reset login attempted state if login fails
      setLoginAttempted(false);
    }
  }, [user, navigate, loginAttempted, isLoading, authLoading]);
  
  const handleLogin = async (email: string, password: string, remember: boolean) => {
    setIsLoading(true);
    setLoginAttempted(true);
    
    try {
      console.log('Attempting login with:', email);
      const success = await login(email, password);
      
      // If login was not successful but didn't throw an error, reset state
      if (success === false) {
        setIsLoading(false);
        setLoginAttempted(false);
      }
      // If successful, navigation will be handled by the useEffect
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginAttempted(false);
      toast({
        title: "Login Failed",
        description: error?.message || "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Prevent infinite loading by adding a failsafe timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading || authLoading) {
      timeoutId = setTimeout(() => {
        if (isLoading) {
          console.log('Login timeout reached, resetting loading state');
          setIsLoading(false);
          setLoginAttempted(false);
        }
      }, 8000); // 8 seconds timeout
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, authLoading]);
  
  if (authLoading && !loginAttempted) {
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
