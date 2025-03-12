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
  
  useEffect(() => {
    if (user && !authLoading) {
      console.log('User already authenticated, redirecting to appropriate page');
      navigate(user.setupCompleted ? '/dashboard' : '/welcome');
    }
  }, [user, navigate, authLoading]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Signup safety timeout triggered - resetting loading state');
        setIsLoading(false);
        toast({
          title: "Account creation taking too long",
          description: "Please try again or check your email for confirmation",
          variant: "destructive"
        });
      }
    }, 8000); // 8 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);
  
  const handleSignUp = async (name: string, email: string, password: string, agencyName: string) => {
    if (isLoading || authLoading) {
      console.log('Skipping signup attempt: already processing');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Attempting signup with:', { name, email, agencyName });
      const success = await signup(name, email, password, agencyName);
      
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
