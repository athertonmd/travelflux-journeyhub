
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to manage resetting the session state
 */
export const useSessionReset = () => {
  /**
   * Force reset the session state (for recovery from stuck states)
   */
  const resetSessionState = async (): Promise<void> => {
    try {
      console.log("Forcefully resetting session state");
      // This will clear any cached session data and force a fresh fetch
      await supabase.auth.signOut({ scope: 'local' });
      console.log("Session state reset completed");
    } catch (error) {
      console.error("Error resetting session state:", error);
    }
  };

  return { resetSessionState };
};
