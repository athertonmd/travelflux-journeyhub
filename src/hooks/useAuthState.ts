
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const userData = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || '',
            agencyName: data.session.user.user_metadata?.agencyName
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
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          agencyName: session.user.user_metadata?.agencyName
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
          console.log('Creating new configuration for user:', userData.id);
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
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, setIsLoading };
};
