
import { User } from '@/types/auth.types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSignUpAuth = () => {
  // Sign up function
  const signUp = async (name: string, email: string, password: string, agencyName?: string): Promise<boolean> => {
    try {
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

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Account created",
          description: "Welcome to Tripscape!",
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error?.message || "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return { signUp };
};
