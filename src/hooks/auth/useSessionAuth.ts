
import { useState, useCallback, useEffect } from 'react';
import { User } from '@/types/auth.types';
import { supabase } from '@/integrations/supabase/client';

export const useSessionAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh session function
  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          agencyName: session.user.user_metadata?.agencyName,
          setupCompleted: false // Will be updated after checking profile
        };
        
        // Check if setup is completed from agency_configurations
        const { data: configData } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', userData.id)
          .maybeSingle();
          
        const updatedUser = {
          ...userData,
          setupCompleted: configData?.setup_completed ?? false
        };
        
        setUser(updatedUser);
        return updatedUser;
      }
      
      setUser(null);
      return null;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state on component mount
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        await refreshSession();
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            agencyName: session.user.user_metadata?.agencyName,
            setupCompleted: false
          };
          
          // Check if setup is completed from agency_configurations
          const { data: configData } = await supabase
            .from('agency_configurations')
            .select('setup_completed')
            .eq('user_id', userData.id)
            .maybeSingle();
            
          setUser({
            ...userData,
            setupCompleted: configData?.setup_completed ?? false
          });
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [refreshSession]);

  return { user, setUser, isLoading, setIsLoading, refreshSession };
};
