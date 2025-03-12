
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { User } from '@/types/auth.types';

export const useSignup = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const signup = async (name: string, email: string, password: string, agencyName?: string): Promise<boolean> => {
    setIsLoading(true);
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
        // Create initial user data
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          agencyName: data.user.user_metadata?.agencyName,
          setupCompleted: false
        };
        
        setUser(userData);
        
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
      setIsLoading(false);
    }
  };

  return signup;
};
