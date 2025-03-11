
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { User } from '@/types/auth.types';

export const useLogin = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Login successful, user data:', data.user);
      
      // Don't set isLoading to false here - this will be handled after redirect
      // by the Login component to prevent flash
      
      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
          agencyName: data.user.user_metadata?.agencyName
        };
        
        // Check user's setup status
        try {
          const { data: configData, error: configError } = await supabase
            .from('agency_configurations')
            .select('setup_completed')
            .eq('user_id', userData.id)
            .maybeSingle();
          
          if (configError) {
            console.error('Error fetching config:', configError);
            // Don't throw here, still set user data
          }
          
          setUser({
            ...userData,
            setupCompleted: configData?.setup_completed || false
          });
          
          toast({
            title: "Login successful",
            description: "Welcome back to Tripscape!",
          });
          
          return true; // Indicate successful login
        } catch (configError) {
          console.error('Error processing configuration:', configError);
          // Even if there's a config error, still set the user to prevent login issues
          setUser({
            ...userData,
            setupCompleted: false
          });
          return true; // Still indicate successful login
        }
      }
      return false; // Indicate unsuccessful login
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false); // Make sure loading state is reset on error
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return false; // Indicate unsuccessful login
    }
  };

  return login;
};
