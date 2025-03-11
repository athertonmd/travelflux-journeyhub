
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
import { supabase } from '@/integrations/supabase/client';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('User already authenticated:', user);
      if (!user.setupCompleted) {
        navigate('/welcome');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const verifyUserConfiguration = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error checking user configuration:', error);
        
        if (error.code === 'PGRST116') {
          console.log('No configuration found, creating one manually...');
          const { error: insertError } = await supabase
            .from('agency_configurations')
            .insert([{ user_id: userId, setup_completed: false }]);
            
          if (insertError) {
            console.error('Error creating user configuration:', insertError);
            throw insertError;
          }
          console.log('Manual configuration created successfully');
        } else {
          throw error;
        }
      } else {
        console.log('User configuration verified:', data);
      }
    } catch (error) {
      console.error('Failed to verify user configuration:', error);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string, agencyName: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting signup with:', name, email, agencyName);
      const { data: signupData, error: signupError } = await signup(
        name,
        email,
        password,
        agencyName
      );

      if (signupError) {
        throw signupError;
      }

      if (signupData?.user?.id) {
        console.log('Signup successful, verifying user configuration...');
        await verifyUserConfiguration(signupData.user.id);
      }

      console.log('Signup process completed, redirecting soon...');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
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
