
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import SignUpForm from './SignUpForm';

const SignUpFormContainer = ({ isLoading }: { isLoading: boolean }) => {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (
    name: string,
    email: string,
    password: string,
    agencyName?: string
  ) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const success = await signUp(
        name,
        email,
        password,
        agencyName || undefined
      );
      
      if (success) {
        console.log('Signup successful');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error?.message || "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SignUpForm 
      isLoading={isLoading || isSubmitting} 
      onSignUp={handleSignUp}
    />
  );
};

export default SignUpFormContainer;
