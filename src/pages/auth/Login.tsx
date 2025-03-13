
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, login, refreshSession } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [loginAttemptFailed, setLoginAttemptFailed] = useState(false);
  const [authStuck, setAuthStuck] = useState(false);
  const [refreshingSession, setRefreshingSession] = useState(false);
  
  console.log('Login page rendering with auth state:', { 
    user: user ? { id: user.id, setupCompleted: user.setupCompleted } : null, 
    authLoading, 
    isSubmitting,
    redirecting,
    loginAttemptFailed,
    refreshingSession
  });
  
  // Timeout to detect if auth is stuck
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (authLoading && !authStuck && !refreshingSession) {
      timeout = setTimeout(() => {
        console.log('Auth loading timeout reached, might be stuck');
        setAuthStuck(true);
      }, 5000); // 5 seconds timeout
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [authLoading, authStuck, refreshingSession]);
  
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
      setLoginAttemptFailed(false);
      console.log('Attempting login for:', email);
      
      // Attempt login
      const success = await login(email, password);
      console.log('Login result:', success);
      
      if (!success) {
        setLoginAttemptFailed(true);
      }
      
      return success;
    } catch (error) {
      console.error('Login handler error:', error);
      setLoginAttemptFailed(true);
      return false;
    } finally {
      // Always reset submission state after a short delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 300); // Give time for auth state to update
    }
  };
  
  const handleRefreshSession = async () => {
    if (refreshingSession) {
      console.log('Already refreshing session, skipping');
      return;
    }
    
    setRefreshingSession(true);
    
    toast({
      title: "Refreshing session",
      description: "Please wait while we refresh your session...",
    });
    
    try {
      console.log('Manually triggering session refresh');
      const user = await refreshSession();
      
      if (user) {
        toast({
          title: "Session refreshed",
          description: "Your session has been refreshed successfully.",
        });
        setAuthStuck(false);
      } else {
        toast({
          title: "Session refresh failed",
          description: "Unable to refresh your session. Please try again or reload the page.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      toast({
        title: "Error",
        description: "An error occurred while refreshing your session.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setRefreshingSession(false);
        
        // If still stuck after refresh attempt, reload the page
        if (authLoading) {
          toast({
            title: "Still having issues",
            description: "Try reloading the page if problems persist.",
          });
        }
      }, 1000);
    }
  };
  
  // Show loading spinner when actively submitting a login or when redirecting
  if (isSubmitting || redirecting) {
    return <LoadingSpinner />;
  }
  
  // If auth is taking too long, show a reset button
  if ((authLoading && authStuck) || refreshingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Authentication is taking longer than expected</h2>
          <p className="mb-4">This could be due to network issues or a problem with the authentication service.</p>
          <Button 
            onClick={handleRefreshSession} 
            disabled={refreshingSession}
            className="mx-auto"
          >
            {refreshingSession ? 'Refreshing...' : 'Refresh Session'}
          </Button>
        </div>
      </div>
    );
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
