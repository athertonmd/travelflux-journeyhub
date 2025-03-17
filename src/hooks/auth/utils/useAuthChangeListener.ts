
/**
 * Custom hook for setting up auth change listener
 */
import { supabase } from '@/integrations/supabase/client';
import { useAuthDebounce } from './useAuthDebounce';
import { useManualClearCheck } from './useManualClearCheck';
import { useAuthEventHandlers } from './useAuthEventHandlers';

type SetupListenerProps = {
  isMounted: React.MutableRefObject<boolean>;
  setUser: (user: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSessionChecked: (checked: boolean) => void;
  updateUserState: (supabaseUser: any) => Promise<any>;
  authStateChangeCount: React.MutableRefObject<number>;
};

export const useAuthChangeListener = () => {
  const { createDebounceController } = useAuthDebounce();
  const { isManualClearInProgress } = useManualClearCheck();
  const { 
    handleSignOut, 
    handleSignInOrUpdate, 
    handleTokenRefresh, 
    handleOtherEvents 
  } = useAuthEventHandlers();

  const setupAuthChangeListener = ({
    isMounted,
    setUser,
    setIsLoading,
    setSessionChecked,
    updateUserState,
    authStateChangeCount
  }: SetupListenerProps) => {
    console.log('Setting up auth state change listener');
    
    // Initialize debounce controller
    const debounceController = createDebounceController();
    
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
        
        // Debounce handler to prevent multiple rapid state changes
        if (debounceController.shouldDebounce(event)) {
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
        
        // Handle different auth events
        if (event === 'SIGNED_OUT') {
          handleSignOut({ setUser, setIsLoading, setSessionChecked });
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          await handleSignInOrUpdate({ 
            session, 
            setUser, 
            setIsLoading, 
            setSessionChecked, 
            updateUserState 
          });
          return;
        }
        
        if (event === 'TOKEN_REFRESHED') {
          await handleTokenRefresh({ 
            session, 
            setUser, 
            setIsLoading, 
            setSessionChecked, 
            updateUserState 
          });
          return;
        }
        
        // Fallback for INITIAL_SESSION or other events
        await handleOtherEvents({
          event,
          session,
          setUser,
          setIsLoading,
          setSessionChecked,
          updateUserState
        });
      }
    );
    
    return authListener;
  };

  return { setupAuthChangeListener };
};
