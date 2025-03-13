
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to manage checking current sessions with timeout handling and retries
 */
export const useSessionCheck = () => {
  /**
   * Check the current session with a timeout and retries
   */
  const checkCurrentSession = async (retryCount = 0): Promise<{ 
    session: any | null, 
    error: Error | null 
  }> => {
    const MAX_RETRIES = 2;
    const TIMEOUT_MS = 8000; // 8 seconds
    
    try {
      console.log(`Checking current session (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      
      // Create a promise that rejects after a timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Session check timed out')), TIMEOUT_MS);
      });
      
      // Create the session check promise
      const sessionCheckPromise = supabase.auth.getSession();
      
      // Race the promises
      try {
        const result = await Promise.race([
          sessionCheckPromise,
          timeoutPromise.catch(err => {
            console.warn('Session check timed out, falling back to cached session');
            // Instead of rejecting, return a fallback result
            return { data: { session: null }, error: new Error('Timed out but continuing') };
          })
        ]);
        
        // TypeScript safety for the result
        const { data, error } = result as { data: { session: any }, error: Error | null };
        
        if (error) {
          // Only log as error if it's not our handled timeout
          if (error.message !== 'Timed out but continuing') {
            console.error('Session retrieval error:', error);
          } else {
            console.warn('Using fallback for timed out session check');
          }
          
          // Retry if we haven't exceeded max retries
          if (retryCount < MAX_RETRIES && error.message === 'Timed out but continuing') {
            console.log(`Session check timed out, retrying (${retryCount + 1}/${MAX_RETRIES})`);
            return await checkCurrentSession(retryCount + 1);
          }
          
          return { session: null, error };
        }
        
        return { session: data.session, error: null };
      } catch (raceError) {
        console.error('Error in race condition:', raceError);
        
        // Retry if we haven't exceeded max retries
        if (retryCount < MAX_RETRIES) {
          console.log(`Session check failed, retrying (${retryCount + 1}/${MAX_RETRIES})`);
          return await checkCurrentSession(retryCount + 1);
        }
        
        return { 
          session: null, 
          error: raceError instanceof Error ? raceError : new Error(String(raceError)) 
        };
      }
    } catch (error) {
      console.error('Error checking session:', error instanceof Error ? error : new Error(String(error)));
      
      // Retry if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        console.log(`Session check failed, retrying (${retryCount + 1}/${MAX_RETRIES})`);
        return await checkCurrentSession(retryCount + 1);
      }
      
      return { 
        session: null, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    }
  };

  return { checkCurrentSession };
};
