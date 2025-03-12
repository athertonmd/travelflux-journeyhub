
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useAuthState: Initializing auth state");
    let mounted = true;

    const fetchUserConfig = async (userId: string, userData: Partial<User>) => {
      try {
        console.log("useAuthState: Fetching user configuration for:", userId);
        const { data: configData, error: configError } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', userId)
          .single();
        
        if (configError) {
          console.error('Error fetching config:', configError);
          if (mounted) {
            const userWithConfig = {
              ...userData as User,
              setupCompleted: false
            };
            console.log("useAuthState: Setting user with default config:", userWithConfig);
            setUser(userWithConfig);
            setIsLoading(false);
          }
          return;
        }
        
        if (mounted) {
          const userWithConfig = {
            ...userData as User,
            setupCompleted: configData?.setup_completed ?? false
          };
          console.log("useAuthState: Setting user with config:", userWithConfig);
          setUser(userWithConfig);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in fetchUserConfig:', error);
        if (mounted) {
          const userWithConfig = {
            ...userData as User,
            setupCompleted: false
          };
          console.log("useAuthState: Setting user with error config:", userWithConfig);
          setUser(userWithConfig);
          setIsLoading(false);
        }
      }
    };

    const checkAuth = async () => {
      try {
        console.log("useAuthState: Checking current session");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }
        
        if (!session?.user) {
          console.log("useAuthState: No session found");
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        console.log("useAuthState: Session found for user:", session.user.id);
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          agencyName: session.user.user_metadata?.agencyName
        };
        
        await fetchUserConfig(userData.id, userData);
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("useAuthState: Sign in detected, updating user data");
        
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
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("useAuthState: Token refreshed");
        // No need to update state here
      } else if (event === 'USER_UPDATED') {
        console.log("useAuthState: User updated, refreshing session");
        // Refresh user data when user is updated
        checkAuth();
      } else {
        // For any other events, ensure loading state is eventually reset
        console.log("useAuthState: Handling event:", event);
        if (mounted && isLoading) {
          console.log("useAuthState: Resetting loading state for event:", event);
          // Add a small delay to allow other operations to complete
          setTimeout(() => {
            if (mounted && isLoading) {
              setIsLoading(false);
            }
          }, 1000);
        }
      }
    });

    // Safety timeout to ensure loading state is reset after a maximum time
    const safetyTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.log("useAuthState: Safety timeout triggered - resetting loading state");
        setIsLoading(false);
      }
    }, 8000);

    return () => {
      console.log("useAuthState: Cleaning up auth state");
      mounted = false;
      clearTimeout(safetyTimeout);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, setIsLoading };
};
