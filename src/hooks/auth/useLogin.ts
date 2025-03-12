
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

export const useLogin = () => {
  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again",
          variant: "destructive",
        });
        return false;
      }
      
      if (!data?.user) {
        console.error('Login succeeded but no user returned');
        toast({
          title: "Login error", 
          description: "Login succeeded but no user data was returned",
          variant: "destructive",
        });
        return false;
      }

      console.log('Login successful for user:', data.user.id);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return login;
};
