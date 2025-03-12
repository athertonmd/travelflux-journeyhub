
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

export const useSignup = () => {
  const signup = async (name: string, email: string, password: string, agencyName?: string): Promise<boolean> => {
    try {
      console.log('Creating user with:', { name, email, agencyName });
      
      // Clear any existing sessions first
      await supabase.auth.signOut();
      
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
    }
  };

  return signup;
};
