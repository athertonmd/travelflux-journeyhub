
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSignUp = (setIsLoading: (loading: boolean) => void) => {
  const signUp = useCallback(async (
    name: string,
    email: string,
    password: string,
    agencyName?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
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
        console.error('Signup error:', error);
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }
      
      if (data.user) {
        toast({
          title: 'Account created',
          description: 'Your account has been created successfully.'
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  return signUp;
};
