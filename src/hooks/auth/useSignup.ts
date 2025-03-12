
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { User } from '@/types/auth.types';

export const useSignup = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const signup = async (name: string, email: string, password: string, agencyName?: string): Promise<boolean> => {
    try {
      console.log('Creating user with:', { name, email, agencyName });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            agencyName
          }
        }
      });
      
      if (error) throw error;
      
      console.log('Signup response:', data);
      
      if (data.user) {
        // Create initial user data but don't set it in state yet
        // The auth listener will handle that after confirming with the database
        console.log('User created successfully, ID:', data.user.id);
        
        toast({
          title: "Account created",
          description: "Welcome to Tripscape!",
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Check if error message indicates user already exists
      if (error.message?.toLowerCase().includes('already exists')) {
        toast({
          title: "User already exists",
          description: "This email is already registered. Please login instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signup failed",
          description: error?.message || "An unknown error occurred",
          variant: "destructive",
        });
      }
      
      return false;
    } finally {
      // Don't reset isLoading here - let the parent component handle it
      // based on the return value
    }
  };

  return signup;
};
