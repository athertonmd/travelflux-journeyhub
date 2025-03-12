
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const initialSessionChecked = useRef(false);

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
          .maybeSingle(); // Use maybeSingle instead of single to handle no results case
        
        if (configError) {
          console.error('Error fetching user config:', configError);
          return null;
        }
        
        console.log("User config data:", configData);
        
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
      console.log('Auth state changed:', event, session ? 'with session' : 'no session');

      // Don't set loading again if we're about to clear the user
      if (event !== 'SIGNED_OUT') {
        setIsLoading(true);
      }
      
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
        
        if (isMounted.current) {
          if (userWithConfig) {
            console.log("Setting authenticated user:", userWithConfig);
            setUser(userWithConfig);
          } else {
            console.warn("Failed to fetch user config, user will remain null");
            setUser(null);
          }
          console.log("Setting isLoading to false after processing auth change");
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user config during auth change:', error);
        if (isMounted.current) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    // Check for existing session on mount
    const checkCurrentSession = async () => {
      try {
        console.log("Checking current session");
        const { data, error } = await supabase.auth.getSession();
        initialSessionChecked.current = true;
        
        if (error) {
          console.error('Session retrieval error:', error);
          if (isMounted.current) {
            setIsLoading(false);
          }
          return;
        }
        
        if (data.session) {
          console.log("Found existing session, handling auth state");
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

  // Direct check session method that can be called for forced refresh
  const refreshSession = async () => {
    try {
      console.log("Manually refreshing session");
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.log("No active session found during refresh");
        setUser(null);
        setIsLoading(false);
        return null;
      }
      
      const userWithConfig = await fetchUserConfig(data.session.user);
      if (userWithConfig) {
        console.log("Setting refreshed user data:", userWithConfig);
        setUser(userWithConfig);
      } else {
        setUser(null);
      }
      setIsLoading(false);
      return userWithConfig;
    } catch (error) {
      console.error("Error refreshing session:", error);
      setUser(null);
      setIsLoading(false);
      return null;
    }
  };

  // Helper function to fetch user config
  const fetchUserConfig = async (authUser: any) => {
    if (!authUser || !authUser.id) return null;
    
    try {
      console.log("Fetching config for user:", authUser.id);
      
      const { data: configData, error: configError } = await supabase
        .from('agency_configurations')
        .select('setup_completed')
        .eq('user_id', authUser.id)
        .maybeSingle();
      
      if (configError) {
        console.error('Error fetching user config:', configError);
        return null;
      }
      
      console.log("User config data:", configData);
      
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

  return { user, setUser, isLoading, setIsLoading, refreshSession };
};
