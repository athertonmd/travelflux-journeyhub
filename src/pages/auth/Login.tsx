
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

const Login = () => {
  const navigate = useNavigate();
  const { login, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is already logged in and redirect
  useEffect(() => {
    if (user) {
      console.log('User is already authenticated, redirecting:', user);
      setTimeout(() => {
        if (!user.setupCompleted) {
          navigate('/welcome');
        } else {
          navigate('/');
        }
      }, 500); // Short delay to ensure smooth transition
    }
  }, [user, navigate]);
  
  const handleLogin = async (email: string, password: string, remember: boolean) => {
    // Don't attempt login if already loading or already authenticated
    if (isLoading || authLoading || user) {
      console.log('Skipping login attempt: already loading or authenticated');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Login attempt starting');
      
      // Perform login
      await login(email, password);
      
      // No need to manually navigate - the useEffect will handle it when user state updates
    } catch (error) {
      console.error('Login handler error:', error);
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };
  
  // Show loading spinner during initial auth check
  if (authLoading) {
    return <LoadingSpinner />;
  }
  
  // If user is authenticated, show loading until redirect happens
  if (user) {
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
