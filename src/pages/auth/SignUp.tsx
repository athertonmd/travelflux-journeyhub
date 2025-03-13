
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignUpFormContainer from '@/components/auth/SignUpFormContainer';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting...');
      const destination = user.setupCompleted ? '/dashboard' : '/welcome';
      navigate(destination);
    }
  }, [user, navigate]);

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
            
            <SignUpFormContainer isLoading={isLoading} />
            
            <CardFooter className="flex flex-col">
              <div className="text-sm text-gray-600 text-center mt-2">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
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
