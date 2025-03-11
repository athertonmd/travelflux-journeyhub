
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
      
      // Check if user is already logged in to prevent duplicate login attempts
      const { data: currentSession } = await supabase.auth.getSession();
      if (currentSession.session) {
        console.log('User already has active session, skipping login attempt');
        
        // Get user data from the current session
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          // Get user configuration
          const { data: configData } = await supabase
            .from('agency_configurations')
            .select('setup_completed')
            .eq('user_id', userData.user.id)
            .maybeSingle();
            
          const user = {
            id: userData.user.id,
            email: userData.user.email || '',
            name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || '',
            agencyName: userData.user.user_metadata?.agencyName,
            setupCompleted: configData?.setup_completed || false
          };
          
          setUser(user);
          setIsLoading(false);
          return true;
        }
      }
      
      // Proceed with login if no active session
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Login successful, user data:', data.user);
      
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
          
          setIsLoading(false);
          return true; // Indicate successful login
        } catch (configError) {
          console.error('Error processing configuration:', configError);
          // Even if there's a config error, still set the user to prevent login issues
          setUser({
            ...userData,
            setupCompleted: false
          });
          setIsLoading(false);
          return true; // Still indicate successful login
        }
      }
      setIsLoading(false);
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
