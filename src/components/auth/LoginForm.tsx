import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import SubmitButton from '@/components/auth/SubmitButton';
import { clearAuthData } from '@/integrations/supabase/client';

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
  
  // Clear any stale auth data when form is initially mounted
  useEffect(() => {
    console.log('Login form mounted, performing complete cleanup of auth data');
    
    // Perform enhanced cleanup immediately on mount
    clearAuthData();
    
    // Check if there was a previous auth error from URL
    if (window.location.href.includes('error=') || window.location.href.includes('cleared=')) {
      console.log('Error or cleared parameter detected in URL, ensuring session state is clean');
      
      toast({
        title: "Session reset",
        description: "Previous login session was cleared for a fresh start.",
        variant: "default"
      });
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) {
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
      console.log('Submitting login form - performing fresh auth cleanup first');
      // Clear auth data again just before login attempt for a clean state
      clearAuthData();
      
      // Slight delay to ensure cleanup completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await onLogin(formData.email, formData.password, formData.remember);
    } catch (error: any) {
      console.error('Error during login:', error.message);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };
  
  const handleClearStorage = () => {
    // Prevent the button from being clicked during loading
    if (isLoading) return;
    
    // Show toast to inform user
    toast({
      title: "Storage cleared",
      description: "Auth data has been reset. The page will now reload.",
    });
    
    // Add a flag to prevent multiple calls to clearAuthData during redirect
    sessionStorage.setItem('manual-clear-in-progress', 'true');
    
    // Clear auth data
    clearAuthData();
    
    // IMPORTANT: Use a more direct page reload approach instead of changing location
    // This prevents the auth state loop issues
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-sm">Remember me</Label>
          </div>
          
          <SubmitButton 
            isLoading={isLoading}
            text="Sign in"
            loadingText="Signing in..."
          />
          
          <div className="text-center mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleClearStorage}
              disabled={isLoading}
            >
              Reset session data
            </Button>
          </div>
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
