
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
      
      if (error) throw error;
      
      console.log('Login successful, user data:', data.user);
      
      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
          agencyName: data.user.user_metadata?.agencyName
        };
        
        try {
          const { data: configData, error: configError } = await supabase
            .from('agency_configurations')
            .select('setup_completed')
            .eq('user_id', userData.id)
            .maybeSingle();
          
          if (configError && configError.code !== 'PGRST116') {
            console.error('Error fetching config:', configError);
          }
          
          if (!configData) {
            console.log('No configuration found, creating one...');
            const { error: insertError } = await supabase
              .from('agency_configurations')
              .insert({
                user_id: userData.id,
                setup_completed: false
              });
            
            if (insertError) {
              console.error('Error creating configuration:', insertError);
            }
            
            setUser({
              ...userData,
              setupCompleted: false
            });
          } else {
            console.log('Configuration found:', configData);
            setUser({
              ...userData,
              setupCompleted: configData?.setup_completed || false
            });
          }
          
          toast({
            title: "Login successful",
            description: "Welcome back to Tripscape!",
          });
        } catch (configError) {
          console.error('Error processing configuration:', configError);
          // Even if there's a config error, still set the user to prevent login issues
          setUser({
            ...userData,
            setupCompleted: false
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false); // Make sure loading state is reset on error
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      // We intentionally don't set isLoading to false here
      // This will be handled after redirect in the Login component
      // to prevent flashing of the login form before navigation
    }
  };

  return login;
};
