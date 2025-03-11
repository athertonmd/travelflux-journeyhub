
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

  useEffect(() => {
    if (user) {
      console.log('User authenticated, redirecting:', user);
      setIsRedirecting(true);
      
      const redirectTimer = setTimeout(() => {
        if (!user.setupCompleted) {
          navigate('/welcome');
        } else {
          navigate('/');
        }
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, navigate]);

  const handleSignUp = async (name: string, email: string, password: string, agencyName: string) => {
    if (isLoading || authLoading || isRedirecting) {
      console.log('Skipping signup attempt: already processing');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Attempting signup with:', { name, email, agencyName });
      const success = await signup(name, email, password, agencyName);
      
      // No need to navigate here, the useEffect will handle it when user is set
      if (!success) {
        setIsLoading(false);
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

  if (authLoading || isRedirecting) {
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
