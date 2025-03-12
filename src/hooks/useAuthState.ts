
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useAuthState: Initializing auth state");
    let mounted = true;
    let authTimeout: NodeJS.Timeout;

    const fetchUserConfig = async (userId: string, userData: Partial<User>) => {
      try {
        // Fetch user configuration data
        console.log("useAuthState: Fetching user configuration for:", userId);
        const { data: configData, error: configError } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (configError) {
          console.error('Error fetching config:', configError);
        }
        
        if (!configData) {
          console.log("useAuthState: No config found, creating new one");
          // Create configuration if it doesn't exist
          const { error: insertError } = await supabase
            .from('agency_configurations')
            .insert({
              user_id: userId,
              setup_completed: false
            });
          
          if (insertError) {
            console.error('Error creating configuration:', insertError);
          }
          
          if (mounted) {
            console.log("useAuthState: Setting user with setupCompleted=false");
            setUser({
              ...userData as User,
              setupCompleted: false
            });
            setIsLoading(false);
          }
        } else {
          console.log("useAuthState: Config found, setup completed:", configData.setup_completed);
          if (mounted) {
            console.log("useAuthState: Setting user with config data");
            setUser({
              ...userData as User,
              setupCompleted: configData?.setup_completed || false
            });
            setIsLoading(false);
          }
        }
      } catch (configError) {
        console.error('Error processing configuration:', configError);
        // Even with config error, set the user to prevent blocking the UI
        if (mounted) {
          console.log("useAuthState: Setting user despite config error");
          setUser({
            ...userData as User,
            setupCompleted: false
          });
          setIsLoading(false);
        }
      }
    };

    const checkAuth = async () => {
      try {
        console.log("useAuthState: Checking current session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          if (mounted) setIsLoading(false);
          return;
        }
        
        if (data.session?.user) {
          console.log("useAuthState: Session found for user:", data.session.user.id);
          const userData = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || '',
            agencyName: data.session.user.user_metadata?.agencyName
          };
          
          await fetchUserConfig(userData.id, userData);
        } else {
          console.log("useAuthState: No session found");
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) setIsLoading(false);
      }
    };

    // Initial auth check
    checkAuth();

    // Safety timeout to prevent infinite loading
    authTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.log("useAuthState: Safety timeout triggered - forcing loading state to false");
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout for safety

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("useAuthState: Sign in detected, updating user data");
        if (mounted) setIsLoading(true); // Set loading to true when auth state changes
        
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          agencyName: session.user.user_metadata?.agencyName
        };
        
        await fetchUserConfig(userData.id, userData);
      } else if (event === 'SIGNED_OUT') {
        console.log("useAuthState: User signed out");
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(authTimeout);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, setIsLoading };
};
