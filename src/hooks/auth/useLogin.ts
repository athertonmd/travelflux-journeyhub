
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { User } from '@/types/auth.types';

export const useLogin = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const login = async (email: string, password: string) => {
    console.log('Login function called with email:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error from Supabase:', error);
        
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again",
          variant: "destructive",
        });
        
        setIsLoading(false);
        return false;
      }
      
      if (!data?.user) {
        console.error('Login succeeded but no user returned');
        
        toast({
          title: "Login error",
          description: "Login succeeded but no user data was returned",
          variant: "destructive",
        });
        
        setIsLoading(false);
        return false;
      }
      
      console.log('Login successful, user ID:', data.user.id);
      
      // The auth state listener in useAuthState will handle setting up the user
      // Don't set isLoading to false here as we'll do it after redirection
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      setIsLoading(false);
      return false;
    }
  };

  return login;
};
