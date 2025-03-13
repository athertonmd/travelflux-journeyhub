
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
  onLogin: (email: string, password: string, remember: boolean) => Promise<boolean>;
}

const LoginForm = ({ isLoading, onLogin }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [localLoading, setLocalLoading] = useState(false);
  
  // Reset local loading when parent loading state changes
  useEffect(() => {
    if (!isLoading && localLoading) {
      setLocalLoading(false);
    }
  }, [isLoading]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading || localLoading) {
      console.log('Form submission blocked - already processing');
      return;
    }
    
    // Validate form
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLocalLoading(true);
      // Call the parent's login handler
      const success = await onLogin(formData.email, formData.password, formData.remember);
      
      // If login explicitly failed, reset loading state immediately
      if (!success) {
        setLocalLoading(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setLocalLoading(false);
    }
  };
  
  // Combine both loading states to ensure button shows loading in all cases
  const buttonLoading = isLoading || localLoading;
  
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
              disabled={buttonLoading}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
              autoComplete="email"
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
              disabled={buttonLoading}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
              autoComplete="current-password"
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
              disabled={buttonLoading}
            />
            <Label htmlFor="remember" className="text-sm">Remember me</Label>
          </div>
          
          <SubmitButton 
            isLoading={buttonLoading}
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
