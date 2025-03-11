
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { User } from '@/types/auth.types';

export const useSignup = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const signup = async (name: string, email: string, password: string, agencyName?: string) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('auth.users')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (existingUser) {
        toast({
          title: "User already exists",
          description: "This email is already registered. Please login instead.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

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
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          agencyName: data.user.user_metadata?.agencyName,
          setupCompleted: false
        };
        
        try {
          // Create configuration record for the new user
          const { error: configError } = await supabase
            .from('agency_configurations')
            .insert({
              user_id: userData.id,
              setup_completed: false
            });
          
          if (configError) {
            console.error('Error creating configuration:', configError);
            if (configError.code !== '23505') { // not a duplicate key error
              throw configError;
            }
          }
          
          // Create initial credits for the new user
          const { error: creditsError } = await supabase
            .from('credits')
            .insert({
              user_id: userData.id,
              total_credits: 30,
              used_credits: 0,
              is_free_tier: true
            });
            
          if (creditsError) {
            console.error('Error creating credits:', creditsError);
          }
          
          setUser(userData);
          
          toast({
            title: "Account created",
            description: "Welcome to Tripscape!",
          });
        } catch (configError) {
          console.error('Configuration error:', configError);
          // If we couldn't create config, we still want to set the user
          setUser(userData);
          toast({
            title: "Account created",
            description: "Welcome to Tripscape! (Some configuration may be incomplete)",
          });
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return signup;
};
