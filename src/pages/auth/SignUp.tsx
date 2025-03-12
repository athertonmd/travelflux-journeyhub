
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import SignUpForm from '@/components/auth/SignUpForm';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import { toast } from '@/hooks/use-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);

  useEffect(() => {
    // If user is authenticated and we're not in the middle of signup process, redirect
    if (user && !isLoading) {
      console.log('User authenticated, redirecting:', user);
      setIsRedirecting(true);
      
      // Force a short delay to ensure loading state shows and auth state is fully processed
      const redirectTimer = setTimeout(() => {
        console.log('Redirecting user to:', user.setupCompleted ? '/dashboard' : '/welcome', 'User state:', user);
        if (!user.setupCompleted) {
          navigate('/welcome');
        } else {
          navigate('/dashboard');
        }
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, navigate, isLoading]);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    if (isRedirecting) {
      const safetyTimeout = setTimeout(() => {
        if (isRedirecting && redirectAttempts < 3) {
          console.log('Redirect safety timeout triggered, retrying...');
          setRedirectAttempts(prev => prev + 1);
          
          // Try to force navigation
          if (user) {
            navigate(user.setupCompleted ? '/dashboard' : '/welcome');
          } else {
            // If somehow user is not available, navigate to login
            setIsRedirecting(false);
            toast({
              title: "Navigation issue",
              description: "Please try logging in.",
              variant: "destructive"
            });
            navigate('/login');
          }
        } else if (redirectAttempts >= 3) {
          // After 3 attempts, stop trying and show an error
          console.error('Failed to redirect after multiple attempts');
          setIsRedirecting(false);
          toast({
            title: "Navigation failed",
            description: "Please refresh the page and try again.",
            variant: "destructive"
          });
        }
      }, 3000); // 3 seconds timeout
      
      return () => clearTimeout(safetyTimeout);
    }
  }, [isRedirecting, redirectAttempts, user, navigate]);

  const handleSignUp = async (name: string, email: string, password: string, agencyName: string) => {
    if (isLoading || authLoading || isRedirecting) {
      console.log('Skipping signup attempt: already processing');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Attempting signup with:', { name, email, agencyName });
      const success = await signup(name, email, password, agencyName);
      
      if (!success) {
        setIsLoading(false);
      } else {
        // On success, make sure we explicitly start the redirecting state
        // This helps avoid UI flickering between states
        console.log('Signup successful, preparing for redirect');
        setIsRedirecting(true);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: error?.message || "Failed to create account. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Show loading spinner when redirecting after successful signup
  if (isRedirecting) {
    console.log('Showing redirect spinner');
    return <LoadingSpinner />;
  }

  // Show loading spinner during initial auth check
  if (authLoading && !isLoading) {
    console.log('Showing auth loading spinner');
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
                Create your account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your details to sign up for Tripscape
              </CardDescription>
            </CardHeader>
            
            <SignUpForm 
              isLoading={isLoading} 
              onSignUp={handleSignUp}
            />

            <CardFooter className="flex flex-col">
              <div className="text-sm text-gray-600 text-center mt-2">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
