
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

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('User authenticated, redirecting to:', 
        user.setupCompleted ? '/dashboard' : '/welcome');
      navigate(user.setupCompleted ? '/dashboard' : '/welcome');
    }
  }, [user, navigate]);
  
  const handleSignUp = async (name: string, email: string, password: string, agencyName: string) => {
    if (isSubmitting) {
      console.log('Already processing signup, skipping');
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Attempting signup with:', { name, email, agencyName });
      
      await signup(name, email, password, agencyName);
      // Auth state change will handle redirection
    } catch (error) {
      console.error('Signup handler error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show spinner only when actively submitting
  if (isSubmitting) {
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
              isLoading={isSubmitting} 
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
