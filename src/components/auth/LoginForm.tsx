
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import SubmitButton from '@/components/auth/SubmitButton';

interface LoginFormProps {
  isLoading: boolean;
  onLogin: (email: string, password: string, remember: boolean) => Promise<void>;
}

const LoginForm = ({ isLoading, onLogin }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Reset form submitted state when loading state changes to false
  useEffect(() => {
    if (!isLoading && formSubmitted) {
      setFormSubmitted(false);
    }
  }, [isLoading, formSubmitted]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (formSubmitted || isLoading) {
      console.log('Form already submitted or loading, ignoring click');
      return;
    }
    
    try {
      setFormSubmitted(true);
      await onLogin(formData.email, formData.password, formData.remember);
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Login Failed",
        description: error?.message || "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      setFormSubmitted(false);
    }
  };
  
  return (
    <>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading || formSubmitted}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                to="/forgot-password" 
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading || formSubmitted}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              name="remember"
              checked={formData.remember}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, remember: checked === true }))
              }
              disabled={isLoading || formSubmitted}
            />
            <Label htmlFor="remember" className="text-sm">Remember me</Label>
          </div>
          
          <SubmitButton 
            isLoading={isLoading || formSubmitted}
            text="Sign in"
            loadingText="Signing in..."
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-sm text-gray-600 text-center mt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </>
  );
};

export default LoginForm;
