
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { User } from '@/types/auth.types';

export const useLogin = () => {
  const login = async (email: string, password: string): Promise<User | null> => {
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
        return null;
      }
      
      if (!data?.user) {
        console.error('Login succeeded but no user returned');
        toast({
          title: "Login error", 
          description: "Login succeeded but no user data was returned",
          variant: "destructive",
        });
        return null;
      }

      console.log('Login successful for user:', data.user.id);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Return user object
      return {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
        agencyName: data.user.user_metadata?.agencyName,
        setupCompleted: false // This will be updated by useAuthState
      };
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  return login;
};
