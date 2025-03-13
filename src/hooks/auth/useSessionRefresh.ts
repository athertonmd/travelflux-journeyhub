
import { supabase } from '@/integrations/supabase/client';
import { fetchUserConfig } from './useUserConfig';
import { User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to manage refreshing sessions
 */
export const useSessionRefresh = () => {
  /**
   * Manually refresh the session and get user data
   */
  const refreshSession = async (): Promise<User | null> => {
    try {
      console.log("Manually refreshing session");
      
      // First try to get the session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session retrieval error:", sessionError);
        
        // Handle 400 Bad Request errors more gracefully
        if (sessionError.status === 400) {
          toast({
            title: "Session expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive"
          });
          // Force sign out locally to clear any inconsistent state
          await supabase.auth.signOut({ scope: 'local' });
          return null;
        }
        
        return null;
      }
      
      if (!sessionData.session) {
        console.log("No active session found during refresh");
        return null;
      }
      
      try {
        // If we have a session, try to refresh it
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: sessionData.session.refresh_token,
        });
        
        if (refreshError) {
          console.error("Session refresh error:", refreshError);
          
          // Handle 400 errors more specifically
          if (refreshError.status === 400) {
            toast({
              title: "Unable to refresh session",
              description: "Please log in again to continue.",
              variant: "destructive"
            });
            
            // Force sign out locally to clear any inconsistent state
            await supabase.auth.signOut({ scope: 'local' });
            return null;
          }
          
          // Even if refresh fails, try to fetch user config with existing session
          if (sessionData.session?.user) {
            return await fetchUserConfig(sessionData.session.user);
          }
          return null;
        }
        
        if (!refreshData.session) {
          console.log("No session after refresh attempt");
          return null;
        }
        
        console.log("Session refreshed successfully");
        
        // Wait a moment to ensure session changes are processed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return await fetchUserConfig(refreshData.session.user);
      } catch (refreshException) {
        console.error("Exception during refresh:", refreshException);
        // Fallback to existing session
        if (sessionData.session?.user) {
          return await fetchUserConfig(sessionData.session.user);
        }
        return null;
      }
    } catch (error) {
      console.error("Error in refreshSession:", error);
      return null;
    }
  };

  return { refreshSession };
};
