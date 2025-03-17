
/**
 * Custom hook for handling different auth events
 */

type HandleAuthEventProps = {
  event: string;
  session: any;
  setUser: (user: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSessionChecked: (checked: boolean) => void;
  updateUserState: (supabaseUser: any) => Promise<any>;
};

export const useAuthEventHandlers = () => {
  const handleSignOut = ({ 
    setUser, 
    setIsLoading, 
    setSessionChecked 
  }: Omit<HandleAuthEventProps, 'event' | 'session' | 'updateUserState'>) => {
    console.log('User signed out, clearing state');
    setUser(null);
    setIsLoading(false);
    setSessionChecked(true);
  };

  const handleSignInOrUpdate = async ({
    session,
    setUser,
    setIsLoading,
    setSessionChecked,
    updateUserState
  }: Omit<HandleAuthEventProps, 'event'>) => {
    console.log('User signed in or updated, updating state with user data');
    setIsLoading(true); // Set loading while we update user state
    
    if (session?.user) {
      try {
        const userData = await updateUserState(session.user);
        console.log('User state updated after sign in:', userData);
        setUser(userData);
        setIsLoading(false); // Make sure to stop loading
        setSessionChecked(true);
      } catch (error) {
        console.error('Error updating user state after sign in:', error);
        setUser(null); // Important: Clear user state if update fails
        setIsLoading(false);
        setSessionChecked(true);
      }
    } else {
      console.warn('Sign in event but no user in session');
      setUser(null);
      setIsLoading(false);
      setSessionChecked(true);
    }
  };

  const handleTokenRefresh = async ({
    session,
    setUser,
    setIsLoading,
    setSessionChecked,
    updateUserState
  }: Omit<HandleAuthEventProps, 'event'>) => {
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
  };

  const handleOtherEvents = async ({
    event,
    session,
    setUser,
    setIsLoading,
    setSessionChecked,
    updateUserState
  }: HandleAuthEventProps) => {
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
  };

  return {
    handleSignOut,
    handleSignInOrUpdate,
    handleTokenRefresh,
    handleOtherEvents
  };
};
