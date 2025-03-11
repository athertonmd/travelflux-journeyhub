
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { User } from '@/types/auth.types';

export const useLogin = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', email);
      
      // First check if we already have an active session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        console.log('Active session found, using existing session instead of login');
        
        // Get user data from the session
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          // Get configuration data
          const { data: configData } = await supabase
            .from('agency_configurations')
            .select('setup_completed')
            .eq('user_id', userData.user.id)
            .maybeSingle();
            
          // Set user with session data
          const user = {
            id: userData.user.id,
            email: userData.user.email || '',
            name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || '',
            agencyName: userData.user.user_metadata?.agencyName,
            setupCompleted: configData?.setup_completed || false
          };
          
          setUser(user);
          
          toast({
            title: "Already logged in",
            description: "You're already logged in with an active session",
          });
          
          return true;
        }
      } else {
        // No session, attempt login
        console.log('No active session, attempting login with credentials');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error('Login error from Supabase:', error);
          throw error;
        }
        
        if (!data.user) {
          console.error('Login succeeded but no user returned');
          throw new Error('Login succeeded but no user data was returned');
        }
        
        console.log('Login successful, user data:', data.user);
        
        // Setup user data
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
          agencyName: data.user.user_metadata?.agencyName
        };
        
        // Get configuration data
        const { data: configData, error: configError } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', userData.id)
          .maybeSingle();
        
        if (configError) {
          console.error('Error fetching config:', configError);
        }
        
        setUser({
          ...userData,
          setupCompleted: configData?.setup_completed || false
        });
        
        toast({
          title: "Login successful",
          description: "Welcome back to Tripscape!",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      
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
