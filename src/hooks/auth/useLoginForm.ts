
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useLoginForm = () => {
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttemptFailed, setLoginAttemptFailed] = useState(false);

  // Handle form submission
  const handleSubmit = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Login form submitted");
      setIsSubmitting(true);
      setLoginAttemptFailed(false);
      
      const success = await logIn(email, password);
      
      if (success) {
        console.log("Login successful");
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
          variant: "default",
        });
        
        // Force navigation to dashboard on success
        navigate('/dashboard');
        return true;
      } else {
        console.log("Login returned unsuccessful");
        setLoginAttemptFailed(true);
        setIsSubmitting(false); // Reset loading state on failure
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login threw an exception:", error);
      setLoginAttemptFailed(true);
      setIsSubmitting(false); // Reset loading state on error
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isSubmitting,
    loginAttemptFailed,
    handleSubmit,
    setIsSubmitting
  };
};
