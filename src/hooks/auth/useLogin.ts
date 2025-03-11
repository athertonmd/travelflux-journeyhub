
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
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check result:', sessionData?.session ? 'Active session found' : 'No active session', sessionError);
      
      if (sessionData?.session) {
        console.log('Active session found, using existing session');
        
        // Get user data from the session
        const { data: userData, error: userError } = await supabase.auth.getUser();
        console.log('User data result:', userData?.user ? 'User found' : 'No user found', userError);
        
        if (userData?.user) {
          // Get configuration data
          const { data: configData, error: configError } = await supabase
            .from('agency_configurations')
            .select('setup_completed')
            .eq('user_id', userData.user.id)
            .maybeSingle();
            
          console.log('Config data result:', configData ? 'Config found' : 'No config found', configError);
            
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
      }
      
      // No session, attempt login
      console.log('No active session, attempting login with credentials');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Login attempt result:', error ? 'Error' : 'Success', error || 'No error');
      
      if (error) {
        console.error('Login error from Supabase:', error);
        
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
      
      console.log('Login successful, user data:', data.user);
      
      // Setup user data
      const userData = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
        agencyName: data.user.user_metadata?.agencyName
      };
      
      try {
        // Get configuration data
        const { data: configData, error: configError } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', userData.id)
          .maybeSingle();
        
        if (configError) {
          console.error('Error fetching config:', configError);
        }
        
        const setupCompleted = configData?.setup_completed || false;
        console.log('User setup status:', setupCompleted ? 'Completed' : 'Not completed');
        
        setUser({
          ...userData,
          setupCompleted
        });
        
        toast({
          title: "Login successful",
          description: "Welcome back to Tripscape!",
        });
        
        return true;
      } catch (configError) {
        console.error('Config fetch error:', configError);
        
        // Even if we couldn't get the config, still log the user in
        setUser({
          ...userData,
          setupCompleted: false
        });
        
        toast({
          title: "Login successful",
          description: "Welcome back to Tripscape!",
        });
        
        return true;
      }
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
