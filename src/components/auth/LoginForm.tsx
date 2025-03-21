
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import SubmitButton from '@/components/auth/SubmitButton';
import { clearAuthData } from '@/integrations/supabase/client';
import LoginFormControls from '@/components/auth/LoginFormControls';
import ResetSessionButton from '@/components/auth/ResetSessionButton';

interface LoginFormProps {
  isLoading: boolean;
  onLogin: (email: string, password: string, remember: boolean) => Promise<boolean>;
}

const LoginForm: React.FC<LoginFormProps> = ({ isLoading, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [loginTimeout, setLoginTimeout] = useState<NodeJS.Timeout | null>(null);
  
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
    
    return () => {
      // Clear any pending timeouts when component unmounts
      if (loginTimeout) {
        clearTimeout(loginTimeout);
      }
    };
  }, []);

  // Sync the isLoading prop with local state
  useEffect(() => {
    setLocalIsLoading(isLoading);
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
    
    if (localIsLoading) {
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
      setLocalIsLoading(true);
      
      // Clear auth data again just before login attempt for a clean state
      clearAuthData();
      
      // Set a timeout for the login process
      const timeout = setTimeout(() => {
        console.log('Login UI timeout triggered');
        setLocalIsLoading(false);
        toast({
          title: "Login is taking too long",
          description: "The process seems to be stuck. Please try again or use the Reset Session button.",
          variant: "destructive"
        });
      }, 10000); // 10 second UI timeout
      
      setLoginTimeout(timeout);
      
      // Slight delay to ensure cleanup completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const success = await onLogin(formData.email, formData.password, formData.remember);
      
      // Clear the timeout since we got a response
      clearTimeout(timeout);
      setLoginTimeout(null);
      
      if (!success) {
        // Reset loading state only on failure (success will navigate away)
        setLocalIsLoading(false);
      }
    } catch (error: any) {
      console.error('Error during login:', error.message);
      
      // Clear any pending timeout
      if (loginTimeout) {
        clearTimeout(loginTimeout);
        setLoginTimeout(null);
      }
      
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      setLocalIsLoading(false);
    }
  };
  
  const handleClearStorage = () => {
    // Prevent the button from being clicked during loading
    if (localIsLoading) return;
    
    // Show toast to inform user
    toast({
      title: "Storage cleared",
      description: "Auth data has been reset. The page will now reload with cleared parameters.",
    });
    
    // Add a flag to prevent multiple calls to clearAuthData during redirect
    sessionStorage.setItem('manual-clear-in-progress', 'true');
    
    // Clear auth data without using Supabase methods
    clearAuthData();
    
    // IMPORTANT: Use a completely different approach - hard reload to a special URL
    // This avoids auth state loops entirely
    setTimeout(() => {
      // Use replace to avoid adding to history
      window.location.href = `${window.location.origin}/login?cleared=true&t=${Date.now()}`;
    }, 1000);
  };
  
  return (
    <>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LoginFormControls
            formData={formData}
            isLoading={localIsLoading}
            handleChange={handleChange}
            setFormData={setFormData}
          />
          
          <SubmitButton 
            isLoading={localIsLoading}
            text="Sign in"
            loadingText="Signing in..."
          />
          
          <ResetSessionButton
            isLoading={localIsLoading}
            onReset={handleClearStorage}
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
