
import { supabase } from '@/integrations/supabase/client';

type AuthStateChangeProps = {
  isMounted: React.MutableRefObject<boolean>;
  setUser: (user: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSessionChecked: (checked: boolean) => void;
  updateUserState: (supabaseUser: any) => Promise<any>;
  authStateChangeCount: React.MutableRefObject<number>;
};

export const useAuthStateChange = () => {
  const setupAuthChangeListener = ({
    isMounted,
    setUser,
    setIsLoading,
    setSessionChecked,
    updateUserState,
    authStateChangeCount
  }: AuthStateChangeProps) => {
    console.log('Setting up auth state change listener');
    
    // Skip processing events while manual clear is in progress
    const isManualClearInProgress = () => sessionStorage.getItem('manual-clear-in-progress') === 'true';
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!isMounted.current) return;
        
        // Very important: Check if a clear operation is in progress
        if (isManualClearInProgress()) {
          console.log('Ignoring auth state change during manual clear operation');
          return;
        }
        
        // Increment the change count
        authStateChangeCount.current += 1;
        
        // If we get too many changes in a short period, there might be a loop
        if (authStateChangeCount.current > 10) {
          console.warn('Too many auth state changes detected, possible refresh loop');
          // If extremely high number of events, stop processing altogether
          if (authStateChangeCount.current > 20) {
            console.error('Excessive auth state changes detected, stopping processing');
            return;
          }
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          setUser(null);
          setIsLoading(false);
          setSessionChecked(true);
          return;
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed, updating state');
          if (session?.user) {
            const userData = await updateUserState(session.user);
            setUser(userData);
          }
          setSessionChecked(true);
          return;
        }
        
        if (session?.user) {
          console.log('User authenticated:', session.user.email);
          const userData = await updateUserState(session.user);
          setUser(userData);
          setSessionChecked(true);
        } else if (event === 'INITIAL_SESSION') {
          console.log('Initial session with no user, marking as checked');
          setUser(null);
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    );
    
    return authListener;
  };

  return { setupAuthChangeListener };
};
