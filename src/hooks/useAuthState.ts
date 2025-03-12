
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    console.log("useAuthState: Initializing auth state");
    isMounted.current = true;
    setIsLoading(true);

    // Function to fetch user configuration from the database
    const fetchUserConfig = async (authUser: any) => {
      if (!authUser || !authUser.id) return null;
      
      try {
        console.log("Fetching config for user:", authUser.id);
        
        const { data: configData, error: configError } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', authUser.id)
          .single();
        
        if (configError && configError.code !== 'PGRST116') {
          console.error('Error fetching user config:', configError);
        }
        
        return {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
          agencyName: authUser.user_metadata?.agencyName,
          setupCompleted: configData?.setup_completed ?? false
        };
      } catch (error) {
        console.error('Error processing user config:', error);
        return null;
      }
    };

    // Function to handle auth state changes
    const handleAuthChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event);
      setIsLoading(true);
      
      if (!session || !session.user) {
        if (isMounted.current) {
          console.log('No active session, setting user to null');
          setUser(null);
          setIsLoading(false);
        }
        return;
      }
      
      try {
        const userWithConfig = await fetchUserConfig(session.user);
        
        if (isMounted.current && userWithConfig) {
          console.log("Setting authenticated user:", userWithConfig);
          setUser(userWithConfig);
        }
      } catch (error) {
        console.error('Error fetching user config during auth change:', error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    // Check for existing session on mount
    const checkCurrentSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session retrieval error:', error);
          if (isMounted.current) {
            setIsLoading(false);
          }
          return;
        }
        
        if (data.session) {
          await handleAuthChange('INITIAL', data.session);
        } else {
          console.log('No active session found');
          if (isMounted.current) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    // Check current session immediately
    checkCurrentSession();

    // Cleanup function
    return () => {
      console.log("Cleaning up auth state");
      isMounted.current = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return { user, setUser, isLoading, setIsLoading };
};
