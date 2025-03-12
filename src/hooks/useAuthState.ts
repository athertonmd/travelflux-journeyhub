
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    console.log("useAuthState: Initializing auth state");
    mountedRef.current = true;

    const fetchUserConfig = async (userId: string, userEmail: string, userName: string, agencyName?: string) => {
      try {
        console.log("Fetching config for user:", userId);
        
        const { data: configData, error: configError } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', userId)
          .single();
        
        if (configError && configError.code !== 'PGRST116') {
          console.error('Error fetching user config:', configError);
        }
        
        if (mountedRef.current) {
          const userWithConfig: User = {
            id: userId,
            email: userEmail,
            name: userName || userEmail.split('@')[0],
            agencyName: agencyName,
            setupCompleted: configData?.setup_completed ?? false
          };
          
          console.log("Setting authenticated user:", userWithConfig);
          setUser(userWithConfig);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error processing user config:', error);
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    const handleAuthChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event);
      
      if (!session || !session.user) {
        if (mountedRef.current) {
          console.log('No active session, setting user to null');
          setUser(null);
          setIsLoading(false);
        }
        return;
      }
      
      const { user: authUser } = session;
      
      // Extract user data from session
      const userData = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
        agencyName: authUser.user_metadata?.agencyName
      };
      
      console.log('User authenticated:', userData.id);
      
      // Fetch additional configuration
      await fetchUserConfig(userData.id, userData.email, userData.name, userData.agencyName);
    };

    // Initial session check
    const checkCurrentSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session retrieval error:', error);
          if (mountedRef.current) {
            setIsLoading(false);
          }
          return;
        }
        
        if (data.session) {
          await handleAuthChange('INITIAL', data.session);
        } else {
          console.log('No active session found');
          if (mountedRef.current) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    // Check current session immediately
    checkCurrentSession();

    return () => {
      console.log("Cleaning up auth state");
      mountedRef.current = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return { user, setUser, isLoading, setIsLoading };
};
