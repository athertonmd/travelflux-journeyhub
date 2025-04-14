
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useUpdateUserState = () => {
  const updateUserState = useCallback(async (
    supabaseUser: any,
    setUser?: (user: User | null) => void
  ): Promise<User | null> => {
    if (!supabaseUser) {
      console.log('No user data available for state update');
      return null;
    }

    try {
      console.log('Updating user state for:', supabaseUser.email);
      
      // Create a more resilient fetch with better error handling and caching
      const fetchUserConfiguration = async (retry = 0): Promise<any> => {
        try {
          // Check if we have a cached result - add caching for better performance
          const cachedConfig = sessionStorage.getItem(`user_config_${supabaseUser.id}`);
          if (cachedConfig) {
            try {
              const parsedConfig = JSON.parse(cachedConfig);
              const cacheTime = parsedConfig._cacheTime || 0;
              // Use cache if it's less than 5 minutes old
              if (Date.now() - cacheTime < 5 * 60 * 1000) {
                console.log('Using cached user configuration');
                return parsedConfig;
              }
            } catch (e) {
              console.error('Error parsing cached config:', e);
              // Continue to fetch if cache parsing fails
            }
          }
          
          console.log('Fetching user configuration from database');
          const { data, error } = await supabase
            .from('agency_configurations')
            .select('setup_completed')
            .eq('user_id', supabaseUser.id)
            .maybeSingle();
          
          if (error) {
            console.error(`Error fetching user configuration (attempt ${retry})`, error.message);
            // Retry up to 2 times with exponential backoff
            if (retry < 2) {
              const backoffTime = Math.pow(2, retry) * 300; // 300ms, 600ms
              console.log(`Retrying after ${backoffTime}ms`);
              await new Promise(resolve => setTimeout(resolve, backoffTime));
              return fetchUserConfiguration(retry + 1);
            }
            throw error;
          }
          
          // Cache the result for future use
          if (data) {
            try {
              const cacheData = { ...data, _cacheTime: Date.now() };
              sessionStorage.setItem(`user_config_${supabaseUser.id}`, JSON.stringify(cacheData));
            } catch (e) {
              console.error('Error caching user configuration:', e);
            }
          }
          
          return data;
        } catch (innerError) {
          console.error(`Inner error in fetchUserConfiguration (attempt ${retry}):`, innerError);
          // If we've tried enough times, return a default value to prevent hanging
          return { setup_completed: false };
        }
      };
      
      // Use the resilient fetch function with a reasonable timeout
      const timeoutPromise = new Promise<{ setup_completed: boolean }>((_, reject) => {
        setTimeout(() => {
          reject(new Error('User configuration fetch timed out'));
        }, 8000); // Increased from 6s to 8s for more reliability
      });
      
      // Race between the actual operation and the timeout
      let userConfig;
      try {
        userConfig = await Promise.race([fetchUserConfiguration(), timeoutPromise]);
      } catch (fetchError) {
        console.error('Error or timeout fetching user configuration:', fetchError);
        // Use default value on error to avoid hanging
        userConfig = { setup_completed: false };
      }
      
      // Build the user object with defensive checks
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        agencyName: supabaseUser.user_metadata?.agencyName,
        setupCompleted: userConfig && 'setup_completed' in userConfig ? userConfig.setup_completed : false
      };
      
      // Update state if setter is provided
      if (userData && setUser) {
        // Use timeout to defer state update to next event loop
        setTimeout(() => {
          setUser(userData);
        }, 0);
      }
      
      return userData;
    } catch (error: any) {
      console.error('Error updating user state:', error.message);
      
      // If setUser is provided, create a fallback user to prevent app from hanging
      if (setUser) {
        const fallbackUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
          agencyName: supabaseUser.user_metadata?.agencyName,
          setupCompleted: false
        };
        
        // Use timeout to defer state update to next event loop
        setTimeout(() => {
          setUser(fallbackUser);
        }, 0);
        
        return fallbackUser;
      }
      
      return null;
    }
  }, []);

  return { updateUserState };
};
