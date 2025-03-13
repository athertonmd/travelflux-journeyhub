
import { User } from '@/types/auth.types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useSessionRefresh } from './useSessionRefresh';

export const useLoginAuth = () => {
  const { refreshSession } = useSessionRefresh();
  
  // Login function
  const logIn = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt for:', email);
      
      // First clear any existing sessions to prevent state conflicts
      await supabase.auth.signOut({ scope: 'local' });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (!data.user) {
        console.error('Login succeeded but no user data returned');
        toast({
          title: "Login error",
          description: "Login succeeded but no user data was returned",
          variant: "destructive",
        });
        return false;
      }
      
      // Verify the session is properly established
      const verifiedUser = await refreshSession();
      if (!verifiedUser) {
        console.error('Login succeeded but session verification failed');
        toast({
          title: "Login issue",
          description: "Your login succeeded but there was a problem setting up your session. Please try again.",
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
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error?.message || "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return { logIn };
};
