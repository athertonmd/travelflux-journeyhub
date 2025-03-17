
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
    const isManualClearInProgress = () => {
      const status = sessionStorage.getItem('manual-clear-in-progress') === 'true';
      if (status) {
        console.log('Manual clear is in progress, ignoring auth events');
      }
      return status;
    };
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'Session exists:', !!session);
        
        if (!isMounted.current) {
          console.log('Component not mounted, ignoring auth event:', event);
          return;
        }
        
        // Check if a clear operation is in progress
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
        
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          console.log('User signed in or updated, updating state with user data');
          setIsLoading(true); // Set loading while we update user state
          
          if (session?.user) {
            try {
              const userData = await updateUserState(session.user);
              console.log('User state updated after sign in:', userData);
              setUser(userData);
            } catch (error) {
              console.error('Error updating user state after sign in:', error);
              setUser(null); // Important: Clear user state if update fails
            } finally {
              setIsLoading(false);
              setSessionChecked(true);
            }
          } else {
            console.warn(event + ' event but no user in session');
            setUser(null);
            setIsLoading(false);
            setSessionChecked(true);
          }
          return;
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed, updating state');
          if (session?.user) {
            try {
              const userData = await updateUserState(session.user);
              setUser(userData);
            } catch (error) {
              console.error('Error updating user state after token refresh:', error);
              setUser(null); // Important: Clear user state if update fails
            }
          }
          setIsLoading(false);
          setSessionChecked(true);
          return;
        }
        
        // Fallback for INITIAL_SESSION or other events
        try {
          if (session?.user) {
            console.log('User authenticated:', session.user.email);
            const userData = await updateUserState(session.user);
            setUser(userData);
          } else {
            console.log(event + ' with no user, clearing state');
            setUser(null);
          }
        } catch (error) {
          console.error('Error handling auth event:', event, error);
          setUser(null); // Clear user state on error
        } finally {
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    );
    
    return authListener;
  };

  return { setupAuthChangeListener };
};
