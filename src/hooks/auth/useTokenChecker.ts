
type TokenCheckerProps = {
  isMounted: React.MutableRefObject<boolean>;
  checkSessionExpiry: () => Promise<boolean>;
  refreshSession: () => Promise<any>;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: any) => void;
};

export const useTokenChecker = () => {
  const setupTokenChecker = ({
    isMounted,
    checkSessionExpiry,
    refreshSession,
    setIsLoading,
    setUser
  }: TokenCheckerProps) => {
    console.log('Setting up token checker');
    
    // Set up the interval to check token expiry
    const interval = window.setInterval(async () => {
      if (!isMounted.current) return;
      
      // Only perform check if we're not already loading
      if (!setIsLoading && setUser) {
        const expired = await checkSessionExpiry();
        if (expired) {
          console.log('Token is about to expire, refreshing session');
          await refreshSession();
        }
      }
    }, 60000); // Check every minute
    
    return interval;
  };

  return { setupTokenChecker };
};
