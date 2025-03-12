
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
            setUser({
              ...userData as User,
              setupCompleted: false
            });
            setIsLoading(false);
          }
          return;
        }
        
        if (mounted) {
          console.log("useAuthState: Setting user with config:", configData);
          setUser({
            ...userData as User,
            setupCompleted: configData?.setup_completed ?? false
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in fetchUserConfig:', error);
        if (mounted) {
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

    checkAuth();

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
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, setIsLoading };
};
