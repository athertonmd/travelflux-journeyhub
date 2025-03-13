
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import AuthFormHeader from './auth/AuthFormHeader';
import AuthFormFooter from './auth/AuthFormFooter';
import AuthFormInputs from './auth/AuthFormInputs';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    agencyName: '',
    remember: false,
    acceptTerms: false,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      toast({
        title: mode === 'login' ? 'Welcome back!' : 'Account created!',
        description: mode === 'login' 
          ? 'You have successfully logged in.' 
          : 'Your account has been created successfully.',
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card className="glass-card animate-fade-in">
          <AuthFormHeader mode={mode} />
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AuthFormInputs 
                mode={mode}
                formData={formData}
                isLoading={isLoading}
                handleChange={handleChange}
                setFormData={setFormData}
              />
              
              <Button 
                type="submit" 
                className="w-full animated-border-button mt-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
                )}
              </Button>
            </form>
          </CardContent>
          
          <AuthFormFooter mode={mode} />
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
