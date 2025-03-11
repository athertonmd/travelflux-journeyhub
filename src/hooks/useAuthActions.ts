
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { User } from '@/types/auth.types';

export const useAuthActions = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
          agencyName: data.user.user_metadata?.agencyName
        };
        
        const { data: configData, error: configError } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', userData.id)
          .maybeSingle();
        
        if (configError && configError.code !== 'PGRST116') {
          console.error('Error fetching config:', configError);
        }
        
        if (!configData) {
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
          setUser({
            ...userData,
            setupCompleted: configData?.setup_completed || false
          });
        }
        
        toast({
          title: "Login successful",
          description: "Welcome back to Tripscape!",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, agencyName?: string) => {
    setIsLoading(true);
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
      
      if (error) throw error;
      
      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          agencyName: data.user.user_metadata?.agencyName,
          setupCompleted: false
        };
        
        try {
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

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const checkSetupStatus = async (): Promise<boolean> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return false;
    
    try {
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('setup_completed')
        .eq('user_id', session.session.user.id)
        .single();
      
      if (error) throw error;
      
      return data?.setup_completed || false;
    } catch (error) {
      console.error('Error checking setup status:', error);
      return false;
    }
  };

  const updateSetupStatus = async (completed: boolean): Promise<void> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return;
    
    try {
      const { error } = await supabase
        .from('agency_configurations')
        .update({ setup_completed: completed })
        .eq('user_id', session.session.user.id);
      
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, setupCompleted: completed } : null);
    } catch (error) {
      console.error('Error updating setup status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update setup status.",
        variant: "destructive",
      });
    }
  };

  return {
    login,
    signup,
    logout,
    checkSetupStatus,
    updateSetupStatus
  };
};
